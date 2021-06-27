using IntegrationTestingTool.Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace IntegrationTestingTool.Services.Interfaces
{
    public interface IEndpointService
    {
        IEnumerable<Endpoint> GetAll();

        Endpoint Create(Endpoint endpoint);

        IEnumerable<Endpoint> FindByParameter(string parameterName, string value);

        string ValidateUrl(string path);
    }
}
