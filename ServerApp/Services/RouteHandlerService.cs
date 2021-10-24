using IntegrationTestingTool.Model.Entities;
using IntegrationTestingTool.Services.Inerfaces;
using IntegrationTestingTool.Services.Interfaces;
using System.Linq;
using System.Threading.Tasks;

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
            (await EndpointService.FindByParameter(nameof(Endpoint.Path), path)).FirstOrDefault();

        public async Task<Endpoint> GetEndpointByPathAndMethod(string path, string method,
            Microsoft.AspNetCore.Http.IHeaderDictionary requestHeaders)
        {
            var endpoints = (await EndpointService.FindByPathAndMethod(path, method));
            var suitableEndpoint = endpoints.FirstOrDefault(endpoint => ValidateEndpoint(endpoint, requestHeaders));

            if (suitableEndpoint == null || suitableEndpoint.OutputDataFile == default) return suitableEndpoint;
            var file = await FileService.Get(suitableEndpoint.OutputDataFileId);
            suitableEndpoint.OutputData = file;
            return suitableEndpoint;
        }

        private bool ValidateEndpoint(Endpoint endpoint, Microsoft.AspNetCore.Http.IHeaderDictionary requestHeaders)
        {
            foreach (var expectedHeader in endpoint.Headers)
            {
                bool hasValue = requestHeaders.TryGetValue(expectedHeader.Key, out var values);
                if (!hasValue || !values.Contains(expectedHeader.Value))
                {
                    return false;
                }
            }
            return true;
        }
    }
}
