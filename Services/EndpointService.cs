using IntegrationTestingTool.Model;
using IntegrationTestingTool.Services.Interfaces;
using IntegrationTestingTool.Settings;
using MongoDB.Bson;
using MongoDB.Driver;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace IntegrationTestingTool.Services
{
    public class EndpointService: IEndpointService
    {
        private readonly IMongoDatabase _mongoDB;

        public EndpointService(IMongoSettings settings)
        {
            var client = new MongoClient(settings.ConnectionString);
            _mongoDB = client.GetDatabase(settings.DatabaseName);
        }

        public IEnumerable<Endpoint> GetAll() =>
            _mongoDB.GetCollection<Endpoint>("Endpoints").Find(new BsonDocument()).ToList();

        public Endpoint Create(Endpoint endpoint)
        {
            endpoint.Id = Guid.NewGuid();
            _mongoDB.GetCollection<Endpoint>("Endpoints").InsertOne(endpoint);
            return endpoint;
        }

        public IEnumerable<Endpoint> FindByParameter(string parameterName, string value) =>
            _mongoDB.GetCollection<Endpoint>("Endpoints")
                .Find(new BsonDocument(parameterName, value)).ToList();
    }
}
