using IntegrationTestingTool.Model.Entities;
using MongoDB.Bson;
using MongoDB.Driver;
using MongoDB.Driver.GridFS;

namespace IntegrationTestingTool.Domain.Interfaces
{
    public interface IDatabaseContext
    {
        public (IMongoCollection<BsonDocument>, GridFSBucket) GetFileCollection();

        public IMongoCollection<BsonDocument> GetCollection(string alias);

        public IMongoCollection<TEntity> GetCollection<TEntity>(string alias = null) where TEntity : BaseEntity;
    }
}
