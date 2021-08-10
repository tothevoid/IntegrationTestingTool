using MongoDB.Bson.Serialization.Attributes;
using System;

namespace IntegrationTestingTool.Model
{
    public class RequestLog
    {
        [BsonId]
        public Guid Id { get; set; } = Guid.NewGuid();

        public DateTime CreatedOn { get; set; } = DateTime.Now;

        public string Path { get; set; } 

        public string Recieved { get; set; }

        public string Returned { get; set; }

    }
}
