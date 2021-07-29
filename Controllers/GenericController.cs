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
        private IRouteHandlerService RouteHandlerService { get; }
        private ILoggingService LoggingService { get; }
        public GenericController(IRouteHandlerService routeHandlerService, ILoggingService loggingService)
        {
            RouteHandlerService = routeHandlerService;
            LoggingService = loggingService;
        }

        public IActionResult Get([FromRoute(Name = "data")] string data, [FromRoute(Name = "endpoint")] string endpointRaw)
        {
            var endpoint = JsonConvert.DeserializeObject<Endpoint>(endpointRaw);
            var result = RouteHandlerService.ProcessRequest(endpoint, data);
            LoggingService.Create(new RequestLog { Path = endpoint.Path, Recieved = data, Returned = result});
            return Json(result);
        }

        public IActionResult Error([FromRoute(Name = "errorMessage")] string errorMessage)
        {
            return BadRequest(errorMessage);
        }
        
    }
}
