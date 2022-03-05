using IntegrationTestingTool.Model.Entities;
using IntegrationTestingTool.UnitOfWork.Interfaces;
using MongoDB.Bson;
using MongoDB.Driver;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace IntegrationTestingTool.UnitOfWork
{
    public class Repository<TEntity> : IRepository<TEntity>
        where TEntity : BaseEntity
    {
        private IMongoCollection<TEntity> MongoCollection { get; }

        public Repository(DatabaseContext databaseContext, string alias = null)
        {
            MongoCollection = !string.IsNullOrEmpty(alias) ?
                databaseContext.GetCollection<TEntity>(alias) :
                databaseContext.GetCollection<TEntity>();
        }

        public async Task<IEnumerable<TEntity>> GetAll()
        {
            return (await MongoCollection.FindAsync(new BsonDocument())).ToList();
        }

        public async Task<IEnumerable<TEntity>> GetAll(FilterDefinition<TEntity> filter = null, 
            ProjectionDefinition<TEntity> projection = null, 
            SortDefinition<TEntity> orderBy = null,
            int limit = 0)
        {
            filter ??= new BsonDocument();

            var options = new FindOptions<TEntity, TEntity>
            {
                Sort = orderBy,
                Projection = projection,
            };

            if (limit > 0)
            {
                options.Limit = limit;
            }

            var result = options != null ?
                await MongoCollection.FindAsync(filter, options):
                await MongoCollection.FindAsync(filter);

            return result.ToList();
        }

        public async Task<long> GetCount(FilterDefinition<TEntity> filter) =>
            await MongoCollection.CountDocumentsAsync(filter);

        public async Task<TEntity> GetById(Guid id)
        {
            BsonBinaryData binaryId = new BsonBinaryData(id, GuidRepresentation.Standard);
            var entities = await MongoCollection.FindAsync(new BsonDocument("_id", binaryId));
            var entity = entities.FirstOrDefault();

            return entity;
        }

        public async Task Insert(TEntity entity)
        {
            await MongoCollection.InsertOneAsync(entity);
        }

        public async Task<ReplaceOneResult> Update(TEntity entity)
        {
            var binaryId = new BsonBinaryData(entity.Id, GuidRepresentation.Standard);
            return await MongoCollection.ReplaceOneAsync(new BsonDocument("_id", binaryId), entity);
        }

        public async Task<UpdateResult> UpdateFields(FilterDefinition<TEntity> filter, UpdateDefinition<TEntity> update)
        {
            return await MongoCollection.UpdateManyAsync(filter, update);
        }

        public async Task<DeleteResult> Delete(Guid id)
        {
            var idFilter = Builders<TEntity>.Filter.Eq(nameof(BaseEntity.Id), id);
            DeleteResult deletionResult = await MongoCollection.DeleteOneAsync(idFilter);
            return deletionResult;
        }
    }
}
