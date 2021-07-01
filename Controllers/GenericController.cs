using IntegrationTestingTool.Model;
using IntegrationTestingTool.Services.Inerfaces;
using IntegrationTestingTool.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;

namespace IntegrationTestingTool.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class GenericController: Controller
    {
        private readonly IRouteHandlerService _routeHandlerService;
        private readonly ILoggingService _loggingService;
        public GenericController(IRouteHandlerService routeHandlerService, ILoggingService loggingService)
        {
            _routeHandlerService = routeHandlerService;
            _loggingService = loggingService;
        }

        public IActionResult Get([FromRoute(Name = "data")] string data, [FromRoute(Name = "endpoint")] string endpointRaw)
        {
            var endpoint = JsonConvert.DeserializeObject<Endpoint>(endpointRaw);
            var result = _routeHandlerService.ProcessRequest(endpoint, data);
            _loggingService.Create(new RequestLog { Path = endpoint.Path, Recieved = data, Returned = result});
            return Json(result);
        }

        public IActionResult Error([FromRoute(Name = "errorMessage")] string errorMessage)
        {
            return BadRequest(errorMessage);
        }
        
    }
}
