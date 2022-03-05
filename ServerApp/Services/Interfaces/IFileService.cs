using MongoDB.Bson;
using System;
using System.Collections.Generic;
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

        Task DeleteLinkedFiles(IEnumerable<ObjectId> fileIds);
    }   
}
