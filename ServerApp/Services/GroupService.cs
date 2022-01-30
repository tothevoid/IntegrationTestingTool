using IntegrationTestingTool.Model.Entities;
using IntegrationTestingTool.Services.Interfaces;
using IntegrationTestingTool.Settings.Interfaces;
using MongoDB.Bson;
using MongoDB.Driver;
using System;
using System.Linq;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace IntegrationTestingTool.Services
{
    public class GroupService : IGroupService
    {
        private IMongoCollection<Group> MongoCollection { get; }

        public GroupService(IDatabaseSettings settings)
        {
            var client = new MongoClient(settings.ConnectionString);
            MongoCollection = client.GetDatabase(settings.DatabaseName).GetCollection<Group>("Groups");
        }

        public async Task<Group> Add(Group group)
        {
            await MongoCollection.InsertOneAsync(group);
            return group;
        }

        public async Task<bool> Delete(Guid id)
        {
            var deletionFilter = Builders<Group>.Filter.Eq(nameof(Group.Id), id);
            DeleteResult deletionResult = await MongoCollection.DeleteOneAsync(deletionFilter);
            return deletionResult.DeletedCount != 0;
        }

        public async Task<IEnumerable<Group>> GetAll() =>
            (await MongoCollection.FindAsync(new BsonDocument())).ToList();

        public async Task<Group> GetOne(Guid id) =>
            (await MongoCollection.FindAsync(Builders<Group>.Filter.Eq(nameof(Group.Id), id))).FirstOrDefault();

        public async Task<bool> Rename(Guid id, string newName)
        {
            var filter = Builders<Group>.Filter.Eq(nameof(Group.Id), id);
            var update = Builders<Group>.Update.Set(x => x.Name, newName);
            var updateResult = await MongoCollection.UpdateOneAsync(filter, update);
            return updateResult.ModifiedCount != 0;
        }
    }
}
