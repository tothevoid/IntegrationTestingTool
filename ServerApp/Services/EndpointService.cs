using IntegrationTestingTool.Model;
using IntegrationTestingTool.Model.Entities;
using IntegrationTestingTool.Services.Interfaces;
using IntegrationTestingTool.Settings;
using MongoDB.Bson;
using MongoDB.Driver;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using IntegrationTestingTool.Settings.Interfaces;

namespace IntegrationTestingTool.Services
{
    public class EndpointService: IEndpointService
    {
        private IMongoCollection<Endpoint> MongoCollection { get; }
        private IFileService FileService { get; }

        public EndpointService(IDatabaseSettings settings, IFileService fileService)
        {
            var client = new MongoClient(settings.ConnectionString);
            MongoCollection = client.GetDatabase(settings.DatabaseName).GetCollection<Endpoint>("Endpoints");
            FileService = fileService;
        }

        public async Task<IEnumerable<Endpoint>> GetAll()
        {
            var sort = Builders<Endpoint>.Sort.Descending(endpoint => endpoint.CreatedOn);

            var options = new FindOptions<Endpoint, Endpoint>
            {
                Sort = sort
            };
            return (await MongoCollection.FindAsync(new BsonDocument(), options)).ToList();
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
            return MongoCollection.Find(filters).SortByDescending(bson => bson.CreatedOn).ToList();
        }

        public async Task<Endpoint> Create(Endpoint endpoint)
        {
            endpoint.Id = Guid.NewGuid();
            var updatedEndpoint = await PreprocessEndpointData(endpoint);
            await MongoCollection.InsertOneAsync(updatedEndpoint);
            return updatedEndpoint;
        }
        
        public async Task<Endpoint> Copy(Endpoint endpoint)
        {
            endpoint.Id = Guid.NewGuid();
            var copiedEndpoint = await PreprocessEndpointData(endpoint);
            await MongoCollection.InsertOneAsync(copiedEndpoint);
            return copiedEndpoint;
        }

        public async Task<bool> Delete(Guid id)
        {
            var endpoint = await FindById(id);
            if (endpoint == null) return false;
            var deletionFilter = Builders<Endpoint>.Filter.Eq(nameof(Endpoint.Id), id);
            var result = await MongoCollection.DeleteOneAsync(deletionFilter);
            if (result.DeletedCount == 0) return false;

            var fileFields = new List<(string, ObjectId)>() { };

            if (endpoint.OutputDataFileId != default) 
                fileFields.Add((nameof(Endpoint.OutputDataFileId), endpoint.OutputDataFileId));
            if (endpoint.CallbackDataFileId != default) 
                fileFields.Add((nameof(Endpoint.CallbackDataFileId), endpoint.CallbackDataFileId));

            if (fileFields.Any()) return true; 
            
            var deletionTasks = new List<Task>();
            var existsTasks = fileFields.Select(field =>
                CheckIsFileCopied(nameof(Endpoint.OutputDataFileId), endpoint.OutputDataFileId));
            var isCopiedFilesExists = await Task.WhenAll(existsTasks);

            for (var i = 0; i < fileFields.Count; i++)
            {
                if (isCopiedFilesExists[i])
                {
                    deletionTasks.Add(FileService.Delete(fileFields[i].Item2));
                }
            }

            if (deletionTasks.Any())
            {
                await Task.WhenAll(deletionTasks);
            }
            return true;
        }

        private async Task<bool> CheckIsFileCopied(string fieldName, ObjectId fileId)
        {
            var fileFilter = Builders<Endpoint>.Filter.Eq(fieldName, fileId);
            return (await MongoCollection.CountDocumentsAsync(fileFilter)) > 1;
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
            return (await MongoCollection.FindAsync(filters, options)).ToList();
        }

        public async Task<Endpoint> FindById(Guid id, bool loadFile = false)
        {
            BsonBinaryData binaryId = new BsonBinaryData(id, GuidRepresentation.Standard);
            var endpoint = (await MongoCollection.FindAsync(new BsonDocument("_id", binaryId))).FirstOrDefault();

            if (loadFile && endpoint.OutputDataFileId != default)
            {
                endpoint.OutputData = await FileService.Get(endpoint.OutputDataFileId);
            }
            return endpoint;
        }

        public async Task<IEnumerable<Endpoint>> FindByParameter(string parameterName, string value) =>
            (await MongoCollection.FindAsync(new BsonDocument(parameterName, value))).ToList();

        public async Task<IEnumerable<Endpoint>> FindLinkedByAuth(Guid authId)
        {
            BsonBinaryData binaryId = new BsonBinaryData(authId, GuidRepresentation.Standard);
            return (await MongoCollection.FindAsync(new BsonDocument(nameof(Endpoint.AuthId), binaryId))).ToList();
        }
        public async Task<Endpoint> Update(Endpoint endpoint)
        {
            var updatedEndpoint = await PreprocessEndpointData(endpoint);

            BsonBinaryData binaryId = new BsonBinaryData(updatedEndpoint.Id, GuidRepresentation.Standard);
            var result = await MongoCollection.ReplaceOneAsync(new BsonDocument("_id", binaryId), updatedEndpoint);

            return result.ModifiedCount != 0 ?
                updatedEndpoint :
                null;
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
            var update = Builders<Endpoint>.Update.Set((update)=>update.Active, isActive);
            var result = await MongoCollection.UpdateOneAsync(idFilter, update);
            return result.ModifiedCount == 1;
        }

        private static bool IsFileShouldBeStoredInGridFs(long size) =>
            size > 10 * Math.Pow(2, 20);
    }
}
