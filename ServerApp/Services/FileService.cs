using IntegrationTestingTool.Services.Interfaces;
using IntegrationTestingTool.Settings;
using MongoDB.Bson;
using MongoDB.Driver;
using MongoDB.Driver.GridFS;
using System;
using System.IO;
using System.Text;
using System.Threading.Tasks;

namespace IntegrationTestingTool.Services
{
    public class FileService: IFileService
    {
        private IGridFSBucket GridFS { get; }

        public FileService(IDatabaseSettings settings)
        {
            var client = new MongoClient(settings.ConnectionString);
            var collection = client.GetDatabase(settings.DatabaseName);
            GridFS = new GridFSBucket(collection);
        }

        public async Task<ObjectId> Create(Guid id, string data) =>
            await GridFS.UploadFromBytesAsync($"{id}.txt", 
                Encoding.UTF8.GetBytes(data));
        public async Task<ObjectId> Create(Guid id, Stream stream) =>
           await GridFS.UploadFromStreamAsync($"{id}.txt", stream);

        public async Task<string> Get(ObjectId fileId)
        {
            var file = await GridFS.DownloadAsBytesAsync(fileId);
            return Encoding.UTF8.GetString(file);
        }

        public async Task Delete(ObjectId fileId)
        {
            await GridFS.DeleteAsync(fileId);
        }
    }
}
