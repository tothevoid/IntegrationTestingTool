using IntegrationTestingTool.Model;
using IntegrationTestingTool.Services.Inerfaces;
using IntegrationTestingTool.Services.Interfaces;
using System.Linq;

namespace IntegrationTestingTool.Services
{
    public class RouteHandlerService: IRouteHandlerService
    {
        private readonly IEndpointService _endpointService;
        public RouteHandlerService(IEndpointService endpointService)
        {
            _endpointService = endpointService;
        }

        public Endpoint GetEndpointByPath(string path) =>
            _endpointService.FindByParameter(nameof(Endpoint.Path), path).FirstOrDefault();
    

        public string ProcessRequest(Endpoint endpoint, string data) =>
            endpoint.OutputData;
    }
}
