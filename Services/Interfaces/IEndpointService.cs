using IntegrationTestingTool.Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace IntegrationTestingTool.Services.Interfaces
{
    public interface IEndpointService
    {
        public IEnumerable<Endpoint> GetAll();

        public Endpoint Create(Endpoint endpoint);
    }
}
