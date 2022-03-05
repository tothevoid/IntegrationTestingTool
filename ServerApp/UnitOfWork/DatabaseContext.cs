using IntegrationTestingTool.Model.Entities;
using IntegrationTestingTool.Settings.Interfaces;
using MongoDB.Bson;
using MongoDB.Driver;
using MongoDB.Driver.GridFS;

namespace IntegrationTestingTool.UnitOfWork
{
    public class DatabaseContext
    {
        private IDatabaseSettings Settings { get; }

        public DatabaseContext(IDatabaseSettings settings)
        {
            Settings = settings;
        }

        public (IMongoCollection<BsonDocument>, GridFSBucket) GetFileCollection()
        {
            var client = new MongoClient(Settings.ConnectionString);
            var database = client.GetDatabase(Settings.DatabaseName);
            var chunksCollection = database.GetCollection<BsonDocument>("fs.chunks");
            var gridFs = new GridFSBucket(database);
            return (chunksCollection, gridFs);
        }

        public IMongoCollection<BsonDocument> GetCollection(string alias)
        {
            var client = new MongoClient(Settings.ConnectionString);
            return client.GetDatabase(Settings.DatabaseName).GetCollection<BsonDocument>(alias);
        }

        public IMongoCollection<TEntity> GetCollection<TEntity>(string alias = null)
            where TEntity : BaseEntity
        {
            var client = new MongoClient(Settings.ConnectionString);
            alias ??= typeof(TEntity).Name;

            return client.GetDatabase(Settings.DatabaseName).GetCollection<TEntity>(alias);
        }
    }
}
