using IntegrationTestingTool.Model;

namespace IntegrationTestingTool.Services.Inerfaces
{
    public interface IRouteHandlerService
    {
        Endpoint GetEndpointByPath(string path);

        string ProcessRequest(Endpoint endpoint, string data);
    }
}
