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

        public Repository(DatabaseContext databaseContext)
        {
            MongoCollection = databaseContext.GetCollection<TEntity>();
        }

        public async Task<IEnumerable<TEntity>> GetAll(FieldDefinition<TEntity> orderBy = null)
        {
            var sort = Builders<TEntity>.Sort.Descending(orderBy);

            var options = new FindOptions<TEntity, TEntity>
            {
                Sort = sort
            };
            return (await MongoCollection.FindAsync(new BsonDocument(), options)).ToList();
        }

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

        public async Task<DeleteResult> Delete(Guid id)
        {
            var idFilter = Builders<TEntity>.Filter.Eq(nameof(BaseEntity.Id), id);
            DeleteResult deletionResult = await MongoCollection.DeleteOneAsync(idFilter);
            return deletionResult;
        }
    }
}
