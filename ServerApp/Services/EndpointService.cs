using IntegrationTestingTool.Model;
using IntegrationTestingTool.Model.Entities;
using IntegrationTestingTool.Services.Interfaces;
using IntegrationTestingTool.Settings;
using MongoDB.Bson;
using MongoDB.Driver;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Text;
using System.Text.RegularExpressions;

namespace IntegrationTestingTool.Services
{
    public class EndpointService: IEndpointService
    {
        private IMongoCollection<Endpoint> MongoCollection { get; }
        private IConfigService ConfigService { get; }

        private IFileService FileService { get; }

        public EndpointService(IDatabaseSettings settings, IConfigService configService, IFileService fileService)
        {
            var client = new MongoClient(settings.ConnectionString);
            MongoCollection = client.GetDatabase(settings.DatabaseName).GetCollection<Endpoint>("Endpoints");
            ConfigService = configService;
            FileService = fileService;
        }

        public IEnumerable<Endpoint> GetAll() =>
            MongoCollection.Find(new BsonDocument()).SortByDescending(bson => bson.CreatedOn).ToList();

        public IEnumerable<Endpoint> GetAllByPath(string path)
        {
            if (string.IsNullOrEmpty(path)) 
            {
                return GetAll();
            }
            var filter = new BsonDocument {{nameof(Endpoint.Path), new BsonDocument {{ "$regex", path }, { "$options", "i" }}}};
            return MongoCollection.Find(filter).SortByDescending(bson => bson.CreatedOn).ToList();
        }

        public Endpoint Create(Endpoint endpoint)
        {
            endpoint.Id = Guid.NewGuid();
            endpoint.OutputData = Regex.Replace(endpoint.OutputData, @"\""", @"""");

            var preprocessedEndpoint = HandleLargeOutputData(endpoint);
            MongoCollection.InsertOne(preprocessedEndpoint);
            return preprocessedEndpoint;
        }
        public bool Delete(Guid id)
        {
            var endpoint = FindById(id);
            if (endpoint != null)
            {
                var deletionFilter = Builders<Endpoint>.Filter.Eq(nameof(Endpoint.Id), id);
                var result = MongoCollection.DeleteOne(deletionFilter);
                var isDeleted = result.DeletedCount != 0;
                if (isDeleted)
                {
                    FileService.Delete(endpoint.OutputDataFile);
                    return isDeleted;
                }
            }
            return false;
        }

        public IEnumerable<Endpoint> FindByPathAndMethod(string path, string method)
        {
            var pathFilter = Builders<Endpoint>.Filter.Eq(nameof(Endpoint.Path), path);
            var methodFilter = Builders<Endpoint>.Filter.Eq(nameof(Endpoint.Method), method);
            var filters = Builders<Endpoint>.Filter.And(pathFilter, methodFilter);
            return MongoCollection.Find(filters).ToList();
        }

        public Endpoint FindById(Guid id)
        {
            BsonBinaryData binaryId = new BsonBinaryData(id, GuidRepresentation.Standard);
            return MongoCollection.Find(new BsonDocument("_id", binaryId)).FirstOrDefault();
        }

        public IEnumerable<Endpoint> FindByParameter(string parameterName, string value) =>
            MongoCollection.Find(new BsonDocument(parameterName, value)).ToList();

        public IEnumerable<Endpoint> FindLinkedByAuth(Guid authId)
        {
            BsonBinaryData binaryId = new BsonBinaryData(authId, GuidRepresentation.Standard);
            return MongoCollection.Find(new BsonDocument(nameof(Endpoint.AuthId), binaryId)).ToList();
        }

        public string ValidateUrl(string path)
        {
            var fullPath = $"{ConfigService.GetServerConfig().MockURL}/{path}";
            var isValid = Uri.TryCreate(fullPath, UriKind.Absolute, out _);
           
            if (string.IsNullOrEmpty(path.Trim()))
            {
                return "URL cant be empty";
            } 
            else if (FindByParameter(nameof(Endpoint.Path), path.Trim()).Any())
            {
                return "Same URL already exists";
            }
            //extract into constant
            else if (!isValid)
            {
                return "Incorrect format of URL";
            }
            return string.Empty;
        }

        public IEnumerable<int> GetStatusCodes() =>
            Enum.GetValues(typeof(HttpStatusCode)).Cast<int>();

        public IEnumerable<string> GetRESTMethods()
        {
            var props = typeof(HttpMethod).GetProperties();
            return props.Where(prop => prop.GetMethod.IsStatic).Select(x => x.Name.ToUpper());
        }

        private Endpoint HandleLargeOutputData(Endpoint endpoint)
        {
            if (string.IsNullOrEmpty(endpoint.OutputData))
            {
                return endpoint;
            }

            endpoint.OutputDataSize = Encoding.UTF8.GetBytes(endpoint.OutputData).Length;

            double fileSize = 10 * Math.Pow(2, 20);

            //Store data into file it has size more than 10MB
            if (endpoint.OutputDataSize > fileSize)
            {
                endpoint.OutputDataFile = FileService.Create(endpoint.Id, endpoint.OutputData);
                endpoint.OutputData = null;
            }

            return endpoint;
        }
    }
}
