using IntegrationTestingTool.Model;
using IntegrationTestingTool.Model.Entities;
using System.Threading.Tasks;

namespace IntegrationTestingTool.Services.Inerfaces
{
    public interface IRouteHandlerService
    {
        Task<Endpoint> GetEndpointByPath(string path);

        Task<Endpoint> GetEndpointByPathAndMethod(string path, string method);
    }
}
