using IntegrationTestingTool.Model;
using IntegrationTestingTool.Model.Entities;
using IntegrationTestingTool.Services.Interfaces;
using IntegrationTestingTool.Settings;
using MongoDB.Bson;
using MongoDB.Driver;
using System;
using System.Collections.Generic;
using System.Linq;

namespace IntegrationTestingTool.Services
{
    public class AuthService : IAuthService
    {
        private IMongoCollection<Auth> MongoCollection { get; }
        private IEndpointService EndpointService { get; }

        public AuthService(IDatabaseSettings settings, IEndpointService endpointService)
        {
            var client = new MongoClient(settings.ConnectionString);
            MongoCollection = client.GetDatabase(settings.DatabaseName).GetCollection<Auth>("Auths");
            EndpointService = endpointService;
        }

        public Auth Create(Auth auth)
        {
            MongoCollection.InsertOne(auth);
            return auth;
        }

        public string Delete(Guid id)
        {
            var linkedEndpoints = EndpointService.FindLinkedByAuth(id);
            if (!linkedEndpoints.Any())
            {
                var deletionFilter = Builders<Auth>.Filter.Eq(nameof(Auth.Id), id);
                var result = MongoCollection.DeleteOne(deletionFilter);
                return string.Empty;
            }
            return $"There are some endpoints which use that auth:\n{string.Join("\n", linkedEndpoints.Select(x => x.Path))}";
        }

        public Auth GetById(Guid id)
        {
            BsonBinaryData binaryId = new BsonBinaryData(id, GuidRepresentation.Standard);
            return MongoCollection.Find(new BsonDocument("_id", binaryId)).FirstOrDefault();
        }
           

        public IEnumerable<Auth> GetAll() =>
            MongoCollection.Find(new BsonDocument()).ToList();
    }
}
