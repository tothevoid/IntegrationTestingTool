using IntegrationTestingTool.Services.Inerfaces;
using IntegrationTestingTool.Services.Interfaces;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Endpoint = IntegrationTestingTool.Model.Entities.Endpoint;

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

        public async Task<Endpoint> GetEndpointByPath(string path) =>
            (await EndpointService.FindByPath(path)).FirstOrDefault();

        public async Task<Endpoint> GetEndpointByPathAndMethod(string path, string method,
            IHeaderDictionary requestHeaders)
        {
            var endpoints = await EndpointService.FindByPathAndMethod(path, method);
            var suitableEndpoint = endpoints.FirstOrDefault(endpoint => ValidateEndpoint(endpoint, requestHeaders));

            if (suitableEndpoint?.OutputDataFile != null)
            {
                var file = await FileService.Get(suitableEndpoint.OutputDataFileId);
                suitableEndpoint.OutputData = file;
            }
            return suitableEndpoint;
        }

        private static bool ValidateEndpoint(Endpoint endpoint, IHeaderDictionary requestHeaders)
        {
            foreach (var expectedHeader in endpoint.Headers)
            {
                var hasValue = requestHeaders.TryGetValue(expectedHeader.Key, out var values);
                if (!hasValue || !values.Contains(expectedHeader.Value))
                {
                    return false;
                }
            }
            return true;
        }
    }
}
