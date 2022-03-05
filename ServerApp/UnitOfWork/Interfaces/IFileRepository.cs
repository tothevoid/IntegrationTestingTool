using MongoDB.Bson;
using System;
using System.IO;
using System.Threading.Tasks;

namespace IntegrationTestingTool.UnitOfWork.Interfaces
{
    public interface IFileRepository
    {
        public Task<ObjectId> Create(Guid id, string data);

        public Task<ObjectId> Create(Guid id, Stream stream);

        public Task<string> Get(ObjectId fileId);

        public Task Delete(ObjectId fileId);
    }
}
