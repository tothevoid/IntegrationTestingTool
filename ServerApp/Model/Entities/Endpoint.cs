using IntegrationTestingTool.Model.Enums;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using System;
using System.Collections.Generic;
using Microsoft.AspNetCore.Http;

namespace IntegrationTestingTool.Model.Entities
{
    public class Endpoint: BaseEntity
    {
        public bool Active { get; set; } = true;

        public string Path { get; set; }

        public string Method { get; set; } = "POST";

        public string OutputData { get; set; }

        public CallbackType CallbackType { get; set; } = CallbackType.Synchronous;

        public string CallbackURL { get; set; }

        public string CallbackMethod { get; set; } = "POST";

        public string CallbackData { get; set; }

        public long CallbackDataSize { get; set; }

        public ObjectId CallbackDataFileId { get; set; }

        public int OutputStatusCode { get; set; } = 200;

        public ObjectId OutputDataFileId { get; set; }

        public long OutputDataSize { get; set; }

        public Guid? AuthId { get; set; }

        [BsonIgnore]
        public Auth Auth { get; set; }

        public IEnumerable<Header> Headers { get; set; }
        
        [BsonIgnore]
        public IFormFile CallbackDataFile { get; set; }

        [BsonIgnore]
        public IFormFile OutputDataFile { get; set; }
    }
}
