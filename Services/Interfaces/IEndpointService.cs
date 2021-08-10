using IntegrationTestingTool.Model;
using System;
using System.Collections.Generic;

namespace IntegrationTestingTool.Services.Interfaces
{
    public interface IEndpointService
    {
        IEnumerable<Endpoint> GetAll();

        Endpoint Create(Endpoint endpoint);

        bool Delete(Guid id);

        IEnumerable<Endpoint> FindByParameter(string parameterName, string value);

        string ValidateUrl(string path);
    }
}
