using MongoDB.Bson;
using System;
using System.IO;
using System.Threading.Tasks;

namespace IntegrationTestingTool.Domain.Interfaces
{
    public interface IFileRepository
    {
        Task<ObjectId> Create(Guid id, string data);

        Task<ObjectId> Create(Guid id, Stream stream);

        Task<string> Get(ObjectId fileId);

        Task Delete(ObjectId fileId);
    }
}
