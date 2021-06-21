using IntegrationTestingTool.Model;
using IntegrationTestingTool.Services.Inerfaces;
using IntegrationTestingTool.Services.Interfaces;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
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
    
        public string FormatResponse(IEnumerable<OutputParameter> parameters)
        {
            var values = parameters.ToDictionary(key => key.Name, value => GetValue(value.DesiredValue, value.Type));
            return JsonConvert.SerializeObject(values);
        }

        private object GetValue(string value, ParameterType type) =>
            Convert.ChangeType(value, type.GetTypeCode());
    }
}
