using IntegrationTestingTool.Services.Interfaces;
using MongoDB.Bson;
using MongoDB.Driver;
using System;
using System.IO;
using System.Threading.Tasks;
using System.Linq;
using System.Collections.Generic;
using IntegrationTestingTool.Domain.Interfaces;

namespace IntegrationTestingTool.Services
{
    public class FileService: IFileService
    {
        private IFileRepository FileRepository { get; }

        public FileService(IUnitOfWork unitOfWork)
        {
            FileRepository = unitOfWork.CreateFileRepository();
        }

        public async Task<ObjectId> Create(Guid id, string data) =>
            await FileRepository.Create(id, data);

        public async Task<ObjectId> Create(Guid id, Stream stream) =>
           await FileRepository.Create(id, stream);

        public async Task<string> Get(ObjectId fileId) =>
            await FileRepository.Get(fileId);
        
        public async Task Delete(ObjectId fileId) =>
             await FileRepository.Delete(fileId);

        public async Task DeleteLinkedFiles(IEnumerable<ObjectId> fileIds)
        {
            if (fileIds.Any())
            {
                await Task.WhenAll(fileIds.Select(fileId => Delete(fileId)));
            }
        }
    }
}
