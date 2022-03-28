using MongoDB.Bson.Serialization.Attributes;
using System;

namespace IntegrationTestingTool.Model.Entities
{
    public class BaseEntity: ICloneable
    {
        [BsonId]
        public Guid Id { get; set; } = Guid.NewGuid();

        public DateTime CreatedOn { get; set; } = DateTime.Now;

        public object Clone()
        {
            return this.MemberwiseClone();
        }
    }
}
