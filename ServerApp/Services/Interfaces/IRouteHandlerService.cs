using IntegrationTestingTool.Model;
using IntegrationTestingTool.Model.Entities;

namespace IntegrationTestingTool.Services.Inerfaces
{
    public interface IRouteHandlerService
    {
        Endpoint GetEndpointByPath(string path);

        Endpoint GetEndpointByPathAndMethod(string path, string method);

        string ProcessRequest(Endpoint endpoint, string data);
    }
}
