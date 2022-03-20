using IntegrationTestingTool.Model.Enums;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace IntegrationTestingTool.Model.Entities
{
    public class Endpoint: BaseEntity
    {
        public bool Active { get; set; } = true;

        public string Path { get; set; }

        public string Method { get; set; } = "POST";

        public string OutputData { get; set; }

        public CallbackType CallbackType { get; set; } = CallbackType.Synchronous;

        public string CallbackUrl { get; set; }

        public string CallbackMethod { get; set; } = "POST";

        public string CallbackData { get; set; }

        public long CallbackDataSize { get; set; }

        [JsonIgnore]
        public ObjectId CallbackDataFileId { get; set; }

        [JsonPropertyName("callbackDataFileId")]
        [FromForm(Name = "callbackDataFileId")]
        public string CallbackDataFileConverted
        {
            get => CallbackDataFileId != default ? CallbackDataFileId.ToString() : null;
            set
            {
                if (!string.IsNullOrEmpty(value)) CallbackDataFileId = new ObjectId(value);
            }
        }

        public int OutputStatusCode { get; set; } = 200;

        [JsonIgnore]
        public ObjectId OutputDataFileId { get; set; }

        [JsonPropertyName("outputDataFileId")]
        [FromForm(Name = "outputDataFileId")]
        public string OutputDataFileIdConverted
        {
            get => OutputDataFileId != default ? OutputDataFileId.ToString() : null;
            set
            {
                if (!string.IsNullOrEmpty(value)) OutputDataFileId = new ObjectId(value);
            }
        }
        
        public long OutputDataSize { get; set; }

        public Guid? AuthId { get; set; }

        [BsonIgnore]
        public Auth Auth { get; set; }

        public IEnumerable<Header> Headers { get; set; } = new List<Header>();
        
        [BsonIgnore]
        public IFormFile CallbackDataFile { get; set; }

        [BsonIgnore]
        public IFormFile OutputDataFile { get; set; }

        public Guid? GroupId { get; set; }

        [BsonIgnore]
        public Group Group { get; set; }
    }
}
