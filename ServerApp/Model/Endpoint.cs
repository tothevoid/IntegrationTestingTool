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

        public string OutputData { get; set; }

        public int OutputStatusCode { get; set; } = 200;
    }
}
