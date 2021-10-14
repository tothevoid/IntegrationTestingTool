using IntegrationTestingTool.Services.Interfaces;
using IntegrationTestingTool.Settings;
using MongoDB.Bson;
using MongoDB.Driver;
using MongoDB.Driver.GridFS;
using System;
using System.Text;

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

        public ObjectId Create(Guid id, string data)
        {
            var bytesData = Encoding.UTF8.GetBytes(data);
            var itemId = GridFS.UploadFromBytes($"{id}.txt", bytesData);
            return itemId;
        }

        public string Get(ObjectId fileId)
        {
            var file = GridFS.DownloadAsBytes(fileId);
            return Encoding.UTF8.GetString(file);
        }

        public void Delete(ObjectId fileId)
        {
            GridFS.Delete(fileId);
        }
    }
}
