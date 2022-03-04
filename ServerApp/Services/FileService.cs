using IntegrationTestingTool.Services.Interfaces;
using MongoDB.Bson;
using MongoDB.Driver;
using MongoDB.Driver.GridFS;
using System;
using System.IO;
using System.Text;
using System.Threading.Tasks;
using IntegrationTestingTool.Settings.Interfaces;

namespace IntegrationTestingTool.Services
{
    public class FileService: IFileService
    {
        private IGridFSBucket GridFs { get; }
        
        private IMongoCollection<BsonDocument> ChunksCollection { get; }

        public FileService(IDatabaseSettings settings)
        {
            var client = new MongoClient(settings.ConnectionString);
            var database = client.GetDatabase(settings.DatabaseName);
            ChunksCollection = database.GetCollection<BsonDocument>("fs.chunks");
            GridFs = new GridFSBucket(database);
        }

        public async Task<ObjectId> Create(Guid id, string data) =>
            await GridFs.UploadFromBytesAsync($"{id}.txt", 
                Encoding.UTF8.GetBytes(data));
        public async Task<ObjectId> Create(Guid id, Stream stream) =>
           await GridFs.UploadFromStreamAsync($"{id}.txt", stream);

        public async Task<string> Get(ObjectId fileId)
        {
            var file = await GridFs.DownloadAsBytesAsync(fileId);
            return Encoding.UTF8.GetString(file);
        }
        public async Task Delete(ObjectId fileId)
        {
            var fileIdFilter = Builders<BsonDocument>.Filter.Eq("files_id", fileId);
            await Task.WhenAll(GridFs.DeleteAsync(fileId), ChunksCollection.DeleteManyAsync(fileIdFilter));
        }
    }
}
