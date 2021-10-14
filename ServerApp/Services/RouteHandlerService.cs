using IntegrationTestingTool.Model;
using IntegrationTestingTool.Model.Entities;
using IntegrationTestingTool.Services.Inerfaces;
using IntegrationTestingTool.Services.Interfaces;
using System.Linq;

namespace IntegrationTestingTool.Services
{
    public class RouteHandlerService : IRouteHandlerService
    {
        private IEndpointService EndpointService { get; }
        
        private IFileService FileService {get;}

        public RouteHandlerService(IEndpointService endpointService, IFileService fileService)
        {
            EndpointService = endpointService;
            FileService = fileService;
        }

        public Endpoint GetEndpointByPath(string path) =>
            EndpointService.FindByParameter(nameof(Endpoint.Path), path).FirstOrDefault();

        public Endpoint GetEndpointByPathAndMethod(string path, string method)
        {
            var endpoint = EndpointService.FindByPathAndMethod(path, method).FirstOrDefault();
            if (endpoint != null && endpoint.OutputDataFile != default)
            {
                var file = FileService.Get(endpoint.OutputDataFile);
                endpoint.OutputData = file;
            }
            return endpoint;
        }
    
        public string ProcessRequest(Endpoint endpoint, string data) =>
            endpoint.OutputData;
    }
}
