using MongoDB.Bson;
using MongoDB.Driver.GridFS;
using System;
using System.IO;
using System.Threading.Tasks;

namespace IntegrationTestingTool.Services.Interfaces
{
    public interface IFileService
    {
        Task<ObjectId> Create(Guid id, string data);

        Task<ObjectId> Create(Guid id, Stream stream);

        Task<string> Get(ObjectId fileId);

        Task Delete(ObjectId fileId);
    }   
}
