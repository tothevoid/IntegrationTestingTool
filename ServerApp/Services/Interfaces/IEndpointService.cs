using IntegrationTestingTool.Model.Entities;
using System;
using System.Collections.Generic;

namespace IntegrationTestingTool.Services.Interfaces
{
    public interface IEndpointService
    {
        IEnumerable<Endpoint> GetAll();

        IEnumerable<Endpoint> GetAllByPath(string path);

        Endpoint Create(Endpoint endpoint);

        bool Delete(Guid id);

        IEnumerable<Endpoint> FindByParameter(string parameterName, string value);

        IEnumerable<Endpoint> FindByPathAndMethod(string path, string method);

        string ValidateUrl(string path);

        IEnumerable<int> GetStatusCodes();

        IEnumerable<string> GetRESTMethods();

        IEnumerable<Endpoint> FindLinkedByAuth(Guid authId);

        Endpoint FindById(Guid id);
    }
}
