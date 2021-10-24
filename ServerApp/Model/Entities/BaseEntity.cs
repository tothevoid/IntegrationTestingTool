using MongoDB.Bson.Serialization.Attributes;
using System;

namespace IntegrationTestingTool.Model.Entities
{
    public class BaseEntity
    {
        [BsonId]
        public Guid Id { get; set; }

        public DateTime CreatedOn { get; set; } = DateTime.Now;

    }
}
