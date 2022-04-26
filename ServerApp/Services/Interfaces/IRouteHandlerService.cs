using IntegrationTestingTool.Model;
using IntegrationTestingTool.Model.Entities;
using System.Threading.Tasks;

namespace IntegrationTestingTool.Services.Inerfaces
{
    public interface IRouteHandlerService
    {
        Task<Endpoint> GetEndpointByPathAndMethod(string path, string method,
            Microsoft.AspNetCore.Http.IHeaderDictionary requestHeaders);
    }
}
