using MongoDB.Bson;
using MongoDB.Driver.GridFS;
using System;

namespace IntegrationTestingTool.Services.Interfaces
{
    public interface IFileService
    {
        ObjectId Create(Guid id, string data);

        string Get(ObjectId fileId);

        void Delete(ObjectId fileId);
    }   
}
