using IntegrationTestingTool.Domain.Interfaces;
using MongoDB.Bson;
using MongoDB.Driver;
using MongoDB.Driver.GridFS;
using System;
using System.IO;
using System.Text;
using System.Threading.Tasks;

namespace IntegrationTestingTool.Domain
{
    public class FileRepository: IFileRepository
    {
        private IGridFSBucket GridFs { get; }

        private IMongoCollection<BsonDocument> ChunksCollection { get; }

        public FileRepository(IDatabaseContext context)
        {
            (ChunksCollection, GridFs) = context.GetFileCollection();
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
