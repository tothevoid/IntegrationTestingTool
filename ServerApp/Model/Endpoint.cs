using IntegrationTestingTool.Model.Enums;
using MongoDB.Bson.Serialization.Attributes;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace IntegrationTestingTool.Model
{
    public class Endpoint
    {
        [BsonId]
        public Guid Id { get; set; }

        public string Path { get; set; }

        public string Method { get; set; } = "POST";

        public string OutputData { get; set; }

        public CallbackType CallbackType { get; set; } = CallbackType.Synchronous;

        public string CallbackURL { get; set; }

        public string CallbackMethod { get; set; } = "POST";

        public string CallbackData { get; set; }

        public int OutputStatusCode { get; set; } = 200;
    }
}
