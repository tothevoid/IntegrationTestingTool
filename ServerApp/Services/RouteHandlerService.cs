﻿using IntegrationTestingTool.Model;
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

        public async Task<Endpoint> GetEndpointByPathAndMethod(string path, string method)
        {
            var endpoint = (await EndpointService.FindByPathAndMethod(path, method)).FirstOrDefault();
            if (endpoint != null && endpoint.OutputDataFile != default)
            {
                var file = await FileService.Get(endpoint.OutputDataFile);
                endpoint.OutputData = file;
            }
            return endpoint;
        }
    }
}
