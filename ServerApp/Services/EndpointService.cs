using IntegrationTestingTool.Model;
using IntegrationTestingTool.Services.Interfaces;
using IntegrationTestingTool.Settings;
using MongoDB.Bson;
using MongoDB.Driver;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.RegularExpressions;

namespace IntegrationTestingTool.Services
{
    public class EndpointService: IEndpointService
    {
        private IMongoCollection<Endpoint> MongoCollection { get; }
        private IConfigService ConfigService { get; }

        public EndpointService(IDatabaseSettings settings, IConfigService configService)
        {
            var client = new MongoClient(settings.ConnectionString);
            MongoCollection = client.GetDatabase(settings.DatabaseName).GetCollection<Endpoint>("Endpoints");
            ConfigService = configService;
        }

        public IEnumerable<Endpoint> GetAll() =>
            MongoCollection.Find(new BsonDocument()).ToList();

        public Endpoint Create(Endpoint endpoint)
        {
            endpoint.Id = Guid.NewGuid();
            endpoint.OutputData = Regex.Replace(endpoint.OutputData, @"\""", @"""");
            MongoCollection.InsertOne(endpoint);
            return endpoint;
        }

        public bool Delete(Guid id)
        {
            var deletionFilter = Builders<Endpoint>.Filter.Eq(nameof(Endpoint.Id), id);
            var result = MongoCollection.DeleteOne(deletionFilter);
            return result.DeletedCount != 0;
        }

        public IEnumerable<Endpoint> FindByParameter(string parameterName, string value) =>
            MongoCollection.Find(new BsonDocument(parameterName, value)).ToList();

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

    }
}
