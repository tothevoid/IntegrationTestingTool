using IntegrationTestingTool.Model.Entities;
using IntegrationTestingTool.Services.Interfaces;
using MongoDB.Bson;
using MongoDB.Driver;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using IntegrationTestingTool.UnitOfWork.Interfaces;

namespace IntegrationTestingTool.Services
{
    public class EndpointService: IEndpointService
    {
        private IRepository<Endpoint> EndpointRepository { get; }
        private IFileService FileService { get; }

        public EndpointService(IUnitOfWork unitOfWorkService, IFileService fileService)
        {
            EndpointRepository = unitOfWorkService.CreateRepository<Endpoint>("Endpoints");
            FileService = fileService;
        }

        public async Task<IEnumerable<Endpoint>> GetAll()
        {
            var sort = Builders<Endpoint>.Sort.Descending(endpoint => endpoint.CreatedOn);
            return (await EndpointRepository.GetAll(orderBy: sort)).ToList();
        }

        public async Task<IEnumerable<Endpoint>> GetAllByFilters(string path, bool onlyActive)
        {
            if (string.IsNullOrEmpty(path) && !onlyActive)
            {
                return await GetAll();
            }
            var list = new List<FilterDefinition<Endpoint>>();
            if (!string.IsNullOrEmpty(path))
            {
                list.Add(Builders<Endpoint>.Filter.Regex(nameof(Endpoint.Path), 
                    new BsonRegularExpression(path, "i")));
            }

            if (onlyActive)
            {
                list.Add(Builders<Endpoint>.Filter.Eq(nameof(Endpoint.Active), true));
            }

            var filters = list.Count > 1 ?
                Builders<Endpoint>.Filter.And(list) :
                list.First();

            var sort = Builders<Endpoint>.Sort.Descending(endpoint => endpoint.CreatedOn);

            return (await EndpointRepository.GetAll(filters, orderBy: sort)).ToList();
        }

        public async Task<Endpoint> Create(Endpoint endpoint)
        {
            endpoint.Id = Guid.NewGuid();
            var updatedEndpoint = await PreprocessEndpointData(endpoint);
            await EndpointRepository.Insert(updatedEndpoint);

            return updatedEndpoint;
        }
        
        public async Task<Endpoint> Copy(Endpoint endpoint)
        {
            endpoint.Id = Guid.NewGuid();
            var copiedEndpoint = await PreprocessEndpointData(endpoint);
            await EndpointRepository.Insert(copiedEndpoint);

            return copiedEndpoint;
        }

        public async Task<bool> Delete(Guid id)
        {
            var projection = Builders<Endpoint>.Projection
                .Include(endpoint => endpoint.OutputDataFileId)
                .Include(endpoint => endpoint.CallbackDataFileId);

            var endpoint = await EndpointRepository.GetById(id, projection);
            if (endpoint == null) return false;

            var result = await EndpointRepository.Delete(id);
            if (result.DeletedCount == 0) return false;
            
            var fileFields = new List<(string, ObjectId)>() { };

            if (endpoint.OutputDataFileId != default) 
                fileFields.Add((nameof(Endpoint.OutputDataFileId), endpoint.OutputDataFileId));
            if (endpoint.CallbackDataFileId != default) 
                fileFields.Add((nameof(Endpoint.CallbackDataFileId), endpoint.CallbackDataFileId));
            
            await DeleteLinkedFiles(fileFields);
            return true;
        }

        private async Task DeleteLinkedFiles(List<(string, ObjectId)> fileFields)
        {
            var existsTasks = fileFields.Select(field => CheckIsFileCopied(field.Item1, field.Item2));
            var isCopiedFilesExists = await Task.WhenAll(existsTasks);

            var fileToDelete = fileFields.Where((element, index) => isCopiedFilesExists[index])
                .Select(element => element.Item2);
            await FileService.DeleteLinkedFiles(fileToDelete);
        }

        private async Task<bool> CheckIsFileCopied(string fieldName, ObjectId fileId)
        {
            var fileFilter = Builders<Endpoint>.Filter.Eq(fieldName, fileId);
            return await EndpointRepository.GetCount(fileFilter) != 0;
        }

        public async Task<IEnumerable<Endpoint>> FindByPathAndMethod(string path, string method)
        {
            var sort = Builders<Endpoint>.Sort.Descending(endpoint => endpoint.CreatedOn);
            var options = new FindOptions<Endpoint, Endpoint>
            {
                Sort = sort
            };

            var pathFilter = Builders<Endpoint>.Filter.Eq(nameof(Endpoint.Path), path);
            var activeFilter = Builders<Endpoint>.Filter.Eq(nameof(Endpoint.Active), true);
            var methodFilter = Builders<Endpoint>.Filter.Eq(nameof(Endpoint.Method), method);
            var filters = Builders<Endpoint>.Filter.And(pathFilter, methodFilter, activeFilter);

            return (await EndpointRepository.GetAll(filters, orderBy: sort)).ToList();
        }

        public async Task<Endpoint> FindById(Guid id, bool loadFile = false)
        {
            var endpoint = await EndpointRepository.GetById(id);

            if (loadFile && endpoint.OutputDataFileId != default)
            {
                endpoint.OutputData = await FileService.Get(endpoint.OutputDataFileId);
            }
            return endpoint;
        }

        public async Task<IEnumerable<Endpoint>> FindByParameter(string parameterName, string value, int limit = 1)
        {
            var pathFilter = Builders<Endpoint>.Filter.Eq(parameterName, value);
            var endpoints = await EndpointRepository.GetAll(pathFilter, limit: limit);
            return endpoints.ToList();
        }

        public async Task<IEnumerable<Endpoint>> FindLinkedByAuth(Guid authId)
        {
            BsonBinaryData binaryId = new BsonBinaryData(authId, GuidRepresentation.Standard);
            var pathFilter = Builders<Endpoint>.Filter.Eq(nameof(Endpoint.AuthId), binaryId);
            return (await EndpointRepository.GetAll(pathFilter)).ToList();
        }

        public async Task<Endpoint> Update(Endpoint endpoint)
        {
            var storedEndpoint = await FindById(endpoint.Id);
            var updatedEndpoint = await PreprocessEndpointData(endpoint);
           
            var result = await EndpointRepository.Update(updatedEndpoint);

            if (result.ModifiedCount == 0) return updatedEndpoint;

            var fileFields = new List<(string, ObjectId)>() { };
            if (endpoint.OutputDataFileId != default && storedEndpoint.OutputDataFileId != updatedEndpoint.OutputDataFileId) 
                fileFields.Add((nameof(Endpoint.OutputDataFileId), storedEndpoint.OutputDataFileId));
            if (endpoint.CallbackDataFileId != default && storedEndpoint.CallbackDataFileId != updatedEndpoint.CallbackDataFileId) 
                fileFields.Add((nameof(Endpoint.CallbackDataFileId), storedEndpoint.CallbackDataFileId));
            await DeleteLinkedFiles(fileFields);
            return updatedEndpoint;
        }

        public IEnumerable<int> GetStatusCodes() =>
            Enum.GetValues(typeof(HttpStatusCode)).Cast<int>();

        private async Task<(ObjectId, int)> HandleLargeOutputData(Guid endpointId, string data)
        {
            if (string.IsNullOrEmpty(data))
            {
                return default;
            }

            var size = Encoding.UTF8.GetBytes(data).Length;

            //Store data into file it has size more than 10MB
            return IsFileShouldBeStoredInGridFs(size) ? 
                (await FileService.Create(endpointId, data), size) : 
                (default, size);
        }
        
        private async Task<Endpoint> PreprocessEndpointData(Endpoint endpoint)
        {
            if (!string.IsNullOrEmpty((endpoint.OutputData)))
            {
                endpoint.OutputData = Regex.Replace(endpoint.OutputData, @"\""", @"""");
            }

            //TODO: Remove code duplication
            if (endpoint.OutputDataFile != null && endpoint.OutputDataFileId == default)
            {
                var isShouldBeStored = IsFileShouldBeStoredInGridFs(endpoint.OutputDataFile.Length);
                if (isShouldBeStored)
                {
                    using (var stream = endpoint.OutputDataFile.OpenReadStream())
                    {
                        ObjectId fileId = await FileService.Create(endpoint.Id, stream);
                        endpoint.OutputDataFileId = fileId;
                    }
                    endpoint.OutputDataSize = endpoint.OutputDataFile.Length;
                    endpoint.OutputDataFile = null;
                }
                else
                {
                    using (var reader = new StreamReader(endpoint.OutputDataFile.OpenReadStream()))
                    {
                        endpoint.OutputData = await reader.ReadToEndAsync();
                    }
                }
            }

            if (endpoint.CallbackDataFile != null && endpoint.CallbackDataFileId == default)
            {
                var isShouldBeStored = IsFileShouldBeStoredInGridFs(endpoint.CallbackDataFile.Length);
                if (isShouldBeStored)
                {
                    using (var stream = endpoint.CallbackDataFile.OpenReadStream())
                    {
                        ObjectId fileId = await FileService.Create(endpoint.Id, stream);
                        endpoint.CallbackDataFileId = fileId;
                    }
                    endpoint.CallbackDataSize = endpoint.CallbackDataFile.Length;
                    endpoint.CallbackDataFile = null;
                }
                else
                {
                    using (var reader = new StreamReader(endpoint.CallbackDataFile.OpenReadStream()))
                    {
                        endpoint.CallbackData = await reader.ReadToEndAsync();
                    }
                }
            }

            if (!string.IsNullOrEmpty(endpoint.OutputData))
            {
                (ObjectId outputFileId, int outputSize) = await HandleLargeOutputData(endpoint.Id, endpoint.OutputData);
                if (outputFileId != default)
                {
                    endpoint.OutputDataFileId = outputFileId;
                    endpoint.OutputData = null;
                }
                endpoint.OutputDataSize = outputSize;
            }

            if (!string.IsNullOrEmpty(endpoint.CallbackData))
            {
                (ObjectId callbackFileId, int callbackSize) = await HandleLargeOutputData(endpoint.Id, endpoint.CallbackData);
                if (callbackFileId != default)
                {
                    endpoint.CallbackDataFileId = callbackFileId;
                    endpoint.CallbackData = null;
                }
                endpoint.CallbackDataSize = callbackSize;
            }
            return endpoint;
        }

        public async Task<bool> SwitchActivity(Guid id, bool isActive)
        {
            var idFilter = Builders<Endpoint>.Filter.Eq(nameof(Endpoint.Id), id);
            var update = Builders<Endpoint>.Update.Set((update) => update.Active, isActive);
            var result = await EndpointRepository.UpdateFields(idFilter, update);
            return result.ModifiedCount == 1;
        }

        private static bool IsFileShouldBeStoredInGridFs(long size) =>
            size > 10 * Math.Pow(2, 20);
    }
}
