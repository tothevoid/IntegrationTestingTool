﻿using IntegrationTestingTool.Model.Entities;
using IntegrationTestingTool.Services.Interfaces;
using IntegrationTestingTool.Settings;
using MongoDB.Bson;
using MongoDB.Driver;
using System;
using System.Collections.Generic;
using System.Linq;
using IntegrationTestingTool.Model;
using System.Threading.Tasks;
using IntegrationTestingTool.Settings.Interfaces;

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
            IEnumerable<Endpoint> endpoints = linkedEndpoints.ToArray();
            if (endpoints.Any())
                return
                    $"There are some endpoints which use that auth:\n{string.Join("\n", endpoints.Select(x => x.Path))}";
            var deletionFilter = Builders<Auth>.Filter.Eq(nameof(Auth.Id), id);
            var result = await MongoCollection.DeleteOneAsync(deletionFilter);
            //TODO: remove that auth from all endpoints
            return string.Empty;
        }

        public async Task<Auth> GetById(Guid id)
        {
            var binaryId = new BsonBinaryData(id, GuidRepresentation.Standard);
            return (await MongoCollection.FindAsync(new BsonDocument("_id", binaryId))).FirstOrDefault();
        }

        public async Task<Auth> Update(Auth auth)
        {
            var binaryId = new BsonBinaryData(auth.Id, GuidRepresentation.Standard);
            var result = await MongoCollection.ReplaceOneAsync(new BsonDocument("_id", binaryId), auth);

            return result.ModifiedCount != 0 ?
                auth :
                null;
        }

        public async Task<IEnumerable<Auth>> GetAll() =>
            (await MongoCollection.FindAsync(new BsonDocument())).ToList();
        
        public async Task<IEnumerable<Option<Guid, string>>> GetAllAsLookup()
        {
            var projection = Builders<Auth>.Projection
                .Include(auth => auth.Name);
            var options = new FindOptions<Auth, Auth>
            {
                Projection = projection
            };

            return (await MongoCollection.FindAsync(new BsonDocument(), options))
                .ToList().Select(x => new Option<Guid, string>(x.Id, x.Name));
        } 
    }
}
