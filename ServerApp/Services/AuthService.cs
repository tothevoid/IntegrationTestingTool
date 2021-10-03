using IntegrationTestingTool.Model;
using IntegrationTestingTool.Services.Interfaces;
using IntegrationTestingTool.Settings;
using MongoDB.Bson;
using MongoDB.Driver;
using System;
using System.Collections.Generic;

namespace IntegrationTestingTool.Services
{
    public class AuthService : IAuthService
    {
        private IMongoCollection<Auth> MongoCollection { get; }
   
        public AuthService(IDatabaseSettings settings)
        {
            var client = new MongoClient(settings.ConnectionString);
            MongoCollection = client.GetDatabase(settings.DatabaseName).GetCollection<Auth>("Auths");
        }

        public Auth Create(Auth auth)
        {
            MongoCollection.InsertOne(auth);
            return auth;
        }

        public bool Delete(Guid id)
        {
            throw new NotImplementedException();
        }

        public Auth GetById(Guid id) =>
            MongoCollection.Find(new BsonDocument("_id", id)).FirstOrDefault();

        public IEnumerable<Auth> GetAll() =>
            MongoCollection.Find(new BsonDocument()).ToList();
    }
}
