using MongoDB.Bson.Serialization.Attributes;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace IntegrationTestingTool.Model.Entities
{
    public class Auth
    {
        [BsonId]
        public Guid Id { get; set; } = Guid.NewGuid();

        public string Name { get; set; }

        public string Data { get; set; }

        public string URL { get; set; }

        public string Method { get; set; }

        public IEnumerable<Header> Headers { get; set; }

        public HashSet<string> UsedResponseHeaders { get; set; }

        public HashSet<string> UsedBodyPaths { get; set; }
    }
}
