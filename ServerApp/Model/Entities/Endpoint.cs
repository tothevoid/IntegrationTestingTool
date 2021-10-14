using IntegrationTestingTool.Model.Enums;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using System;

namespace IntegrationTestingTool.Model.Entities
{
    public class Endpoint: BaseEntity
    {
        public string Path { get; set; }

        public string Method { get; set; } = "POST";

        public string OutputData { get; set; }

        public CallbackType CallbackType { get; set; } = CallbackType.Synchronous;

        public string CallbackURL { get; set; }

        public string CallbackMethod { get; set; } = "POST";

        public string CallbackData { get; set; }

        public int OutputStatusCode { get; set; } = 200;

        public ObjectId OutputDataFile { get; set; }

        public int OutputDataSize { get; set; }

        public Guid? AuthId { get; set; }

        [BsonIgnore]
        public Auth Auth { get; set; }
    }
}
