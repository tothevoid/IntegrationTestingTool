using IntegrationTestingTool.Model.Entities;
using IntegrationTestingTool.Settings.Interfaces;
using MongoDB.Bson;
using MongoDB.Driver;
using System;
using System.Linq;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace IntegrationTestingTool.Services
{
    public abstract class BaseService<TEntity>
        where TEntity: BaseEntity
    {
        protected IMongoCollection<TEntity> MongoCollection { get; }

        public BaseService(IDatabaseSettings settings, string collectionName)
        {
            var client = new MongoClient(settings.ConnectionString);
            MongoCollection = client.GetDatabase(settings.DatabaseName).GetCollection<TEntity>(collectionName);
        }

        public async Task<IEnumerable<TEntity>> GetAll() =>
            (await MongoCollection.FindAsync(new BsonDocument())).ToList();

        public async Task<TEntity> GetOne(Guid id) =>
            (await MongoCollection.FindAsync(GetIdFilter(id))).FirstOrDefault();

        public async Task<TEntity> Add(TEntity group)
        {
            await MongoCollection.InsertOneAsync(group);
            return group;
        }

        public async Task<bool> Delete(Guid id)
        {
            DeleteResult deletionResult = await MongoCollection.DeleteOneAsync(GetIdFilter(id));
            return deletionResult.DeletedCount != 0;
        }

        protected FilterDefinition<TEntity> GetIdFilter(Guid id) =>
            Builders<TEntity>.Filter.Eq(nameof(BaseEntity.Id), id);
    }
}
