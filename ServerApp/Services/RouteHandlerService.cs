using IntegrationTestingTool.Model;
using IntegrationTestingTool.Model.Entities;
using IntegrationTestingTool.Services.Inerfaces;
using IntegrationTestingTool.Services.Interfaces;
using System.Linq;

namespace IntegrationTestingTool.Services
{
    public class RouteHandlerService: IRouteHandlerService
    {
        private IEndpointService EndpointService { get; }
        public RouteHandlerService(IEndpointService endpointService)
        {
            EndpointService = endpointService;
        }

        public Endpoint GetEndpointByPath(string path) =>
            EndpointService.FindByParameter(nameof(Endpoint.Path), path).FirstOrDefault();

        public Endpoint GetEndpointByPathAndMethod(string path, string method) =>
            EndpointService.FindByPathAndMethod(path, method).FirstOrDefault();
    
        public string ProcessRequest(Endpoint endpoint, string data) =>
            endpoint.OutputData;
    }
}
