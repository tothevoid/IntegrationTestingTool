using IntegrationTestingTool.Domain.Interfaces;
using IntegrationTestingTool.Model.Entities;
using MongoDB.Bson;
using MongoDB.Driver;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace IntegrationTestingTool.Domain
{
    public class Repository<TEntity> : IRepository<TEntity>
        where TEntity : BaseEntity
    {
        private IMongoCollection<TEntity> MongoCollection { get; }

        public Repository(IDatabaseContext databaseContext, string alias = null)
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
            var options = new FindOptions<TEntity, TEntity>();

            if (orderBy != null) options.Sort = orderBy;
            if (projection != null) options.Projection = projection;
            if (limit > 0) options.Limit = limit;

            var result = options != null ?
                await MongoCollection.FindAsync(filter, options):
                await MongoCollection.FindAsync(filter);

            return result.ToList();
        }

        public async Task<long> GetCount(FilterDefinition<TEntity> filter) =>
            await MongoCollection.CountDocumentsAsync(filter);

        public async Task<TEntity> GetById(Guid id, ProjectionDefinition<TEntity> projection = null)
        {
            var options = new FindOptions<TEntity, TEntity>
            {
                Limit = 1,
            };

            if (projection != null)
            {
                options.Projection = projection;
            }

            var entities = await MongoCollection.FindAsync(GetIdFilter(id), options);
            return entities.FirstOrDefault();
        }

        public async Task Insert(TEntity entity)
        {
            await MongoCollection.InsertOneAsync(entity);
        }

        public async Task<ReplaceOneResult> Update(TEntity entity) =>
            await MongoCollection.ReplaceOneAsync(GetIdFilter(entity.Id), entity);

        public async Task<UpdateResult> UpdateFields(FilterDefinition<TEntity> filter, UpdateDefinition<TEntity> update) =>
            await MongoCollection.UpdateManyAsync(filter, update);
        
        public async Task<DeleteResult> Delete(Guid id) =>
            await MongoCollection.DeleteOneAsync(GetIdFilter(id));

        private static BsonBinaryData GetBinaryId(Guid id) =>
            new BsonBinaryData(id, GuidRepresentation.Standard);

        private static BsonDocument GetIdFilter(Guid id) =>
            new BsonDocument("_id", GetBinaryId(id));
    }
}
