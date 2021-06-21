using IntegrationTestingTool.Model;
using IntegrationTestingTool.Services.Inerfaces;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace IntegrationTestingTool.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class GenericController: Controller
    {
        private readonly IRouteHandlerService _routeHandlerService;
        public GenericController(IRouteHandlerService routeHandlerService)
        {
            _routeHandlerService = routeHandlerService;
        }

        public string Get([FromRoute(Name = "data")] string data, [FromRoute(Name = "endpoint")] string endpointRaw)
        {
            var endpoint = JsonConvert.DeserializeObject<Endpoint>(endpointRaw);
            if (endpoint.AcceptJustSuccessfulStatusCode)
            {
                return string.Empty;
            }
            else
            {
                return _routeHandlerService.FormatResponse(endpoint.OutputParameters);
            }
        }
    }
}
