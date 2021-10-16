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
using System.Threading.Tasks;

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

        public async Task<IEnumerable<Endpoint>> GetAll()
        {
            var sort = Builders<Endpoint>.Sort.Descending(endpoint => endpoint.CreatedOn);
            var options = new FindOptions<Endpoint, Endpoint>
            {
                Sort = sort
            };
            return (await MongoCollection.FindAsync(new BsonDocument(), options)).ToList();
        }

        public async Task<IEnumerable<Endpoint>> GetAllByPath(string path)
        {
            if (string.IsNullOrEmpty(path)) 
            {
                return await GetAll();
            }
            var filter = new BsonDocument {{nameof(Endpoint.Path), new BsonDocument {{ "$regex", path }, { "$options", "i" }}}};
            return MongoCollection.Find(filter).SortByDescending(bson => bson.CreatedOn).ToList();
        }

        public async Task<Endpoint> Create(Endpoint endpoint)
        {
            endpoint.Id = Guid.NewGuid();
            endpoint.OutputData = Regex.Replace(endpoint.OutputData, @"\""", @"""");

            if (!string.IsNullOrEmpty(endpoint.OutputData))
            {
                (ObjectId outputFileId, int outputSize) = await HandleLargeOutputData(endpoint.Id, endpoint.OutputData);
                if (outputFileId != default)
                {
                    endpoint.OutputDataFile = outputFileId;
                    endpoint.OutputData = null;
                }
                endpoint.OutputDataSize = outputSize;
            }

            //TODO: Remove code duplication
            if (!string.IsNullOrEmpty(endpoint.CallbackData))
            {
                (ObjectId callbackFileId, int callbackSize) = await HandleLargeOutputData(endpoint.Id, endpoint.CallbackData);
                if (callbackFileId != default)
                {
                    endpoint.CallbackDataFile = callbackFileId;
                    endpoint.CallbackData = null;
                }
                endpoint.OutputDataSize = callbackSize;
            }


            await MongoCollection.InsertOneAsync(endpoint);
            return endpoint;
        }
        public async Task<bool> Delete(Guid id)
        {
            var endpoint = await FindById(id);
            if (endpoint != null)
            {
                var deletionFilter = Builders<Endpoint>.Filter.Eq(nameof(Endpoint.Id), id);
                var result = await MongoCollection.DeleteOneAsync(deletionFilter);
                var isDeleted = result.DeletedCount != 0;
                if (isDeleted && endpoint.OutputDataFile != default)
                {
                    await FileService.Delete(endpoint.OutputDataFile);
                    return isDeleted;
                }
            }
            return false;
        }

        public async Task<IEnumerable<Endpoint>> FindByPathAndMethod(string path, string method)
        {
            var pathFilter = Builders<Endpoint>.Filter.Eq(nameof(Endpoint.Path), path);
            var methodFilter = Builders<Endpoint>.Filter.Eq(nameof(Endpoint.Method), method);
            var filters = Builders<Endpoint>.Filter.And(pathFilter, methodFilter);
            return (await MongoCollection.FindAsync(filters)).ToList();
        }

        public async Task<Endpoint> FindById(Guid id)
        {
            BsonBinaryData binaryId = new BsonBinaryData(id, GuidRepresentation.Standard);
            return (await MongoCollection.FindAsync(new BsonDocument("_id", binaryId))).FirstOrDefault();
        }

        public async Task<IEnumerable<Endpoint>> FindByParameter(string parameterName, string value) =>
            (await MongoCollection.FindAsync(new BsonDocument(parameterName, value))).ToList();

        public async Task<IEnumerable<Endpoint>> FindLinkedByAuth(Guid authId)
        {
            BsonBinaryData binaryId = new BsonBinaryData(authId, GuidRepresentation.Standard);
            return (await MongoCollection.FindAsync(new BsonDocument(nameof(Endpoint.AuthId), binaryId))).ToList();
        }

        public async Task<string> ValidateUrl(string path)
        {
            var fullPath = $"{ConfigService.GetServerConfig().MockURL}/{path}";
            var isValid = Uri.TryCreate(fullPath, UriKind.Absolute, out _);
           
            if (string.IsNullOrEmpty(path.Trim()))
            {
                return "URL cant be empty";
            } 
            else if ((await FindByParameter(nameof(Endpoint.Path), path.Trim())).Any())
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

        private async Task<(ObjectId, int)> HandleLargeOutputData(Guid endpointId, string data)
        {
            if (string.IsNullOrEmpty(data))
            {
                return default;
            }

            var size = Encoding.UTF8.GetBytes(data).Length;

            double minFileSize = 10 * Math.Pow(2, 20);

            //Store data into file it has size more than 10MB
            if (size > minFileSize)
            {
                return (await FileService.Create(endpointId, data), size);
            }

            return (default, size);
        }
    }
}
