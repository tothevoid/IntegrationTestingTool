using IntegrationTestingTool.Model.Entities;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace IntegrationTestingTool.Services.Interfaces
{
    public interface IEndpointService
    {
        Task<IEnumerable<Endpoint>> GetAll();

        Task<IEnumerable<Endpoint>> GetAllByPath(string path);

        Task<Endpoint> Create(Endpoint endpoint);

        Task<bool> Delete(Guid id);

        Task<IEnumerable<Endpoint>> FindByParameter(string parameterName, string value);

        Task<IEnumerable<Endpoint>> FindByPathAndMethod(string path, string method);

        IEnumerable<int> GetStatusCodes();

        IEnumerable<string> GetRESTMethods();

        Task<IEnumerable<Endpoint>> FindLinkedByAuth(Guid authId);

        Task<Endpoint> FindById(Guid id);
    }
}
