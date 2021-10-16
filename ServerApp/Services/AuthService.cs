﻿using IntegrationTestingTool.Model;
using IntegrationTestingTool.Model.Entities;
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

        public async Task<Auth> Create(Auth auth)
        {
            await MongoCollection.InsertOneAsync(auth);
            return auth;
        }

        public async Task<string> Delete(Guid id)
        {
            var linkedEndpoints = await EndpointService.FindLinkedByAuth(id);
            if (!linkedEndpoints.Any())
            {
                var deletionFilter = Builders<Auth>.Filter.Eq(nameof(Auth.Id), id);
                var result = MongoCollection.DeleteOne(deletionFilter);
                return string.Empty;
            }
            return $"There are some endpoints which use that auth:\n{string.Join("\n", linkedEndpoints.Select(x => x.Path))}";
        }

        public async Task<Auth> GetById(Guid id)
        {
            BsonBinaryData binaryId = new BsonBinaryData(id, GuidRepresentation.Standard);
            return (await MongoCollection.FindAsync(new BsonDocument("_id", binaryId))).FirstOrDefault();
        }
           

        public async Task<IEnumerable<Auth>> GetAll() =>
            (await MongoCollection.FindAsync(new BsonDocument())).ToList();
    }
}
