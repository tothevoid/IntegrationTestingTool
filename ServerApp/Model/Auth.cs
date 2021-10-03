using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace IntegrationTestingTool.Model
{
    public class Auth
    {
        public Guid Id { get; set; } = Guid.NewGuid();

        public string Name { get; set; }

        public string Data { get; set; }

        public string URL { get; set; }

        public string Method { get; set; }

        public Dictionary<string, string> Headers { get; set; }
    }
}
