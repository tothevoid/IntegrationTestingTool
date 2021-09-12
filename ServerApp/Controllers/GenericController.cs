using IntegrationTestingTool.Model;
using IntegrationTestingTool.Services.Inerfaces;
using IntegrationTestingTool.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;

namespace IntegrationTestingTool.Controllers
{
    [ApiController]
    [Route("[controller]")]
    [Produces("application/json")]
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
            
            //TODO: get rid of try/catch
            try
            {
                var json = JsonConvert.DeserializeObject(result);
                HttpContext.Response.Headers["Content-Type"] = "application/json; charset=utf-8";
            }
            catch { }
            HttpContext.Response.StatusCode = endpoint.OutputStatusCode;
            LoggingService.Create(new RequestLog 
            {
                Recieved = data, 
                Returned = result, 
                Endpoint = endpoint
            });
            return Content(result);
        }

        public IActionResult Error([FromRoute(Name = "data")] string data, [FromRoute(Name = "endpoint")] string endpointRaw, 
            [FromRoute(Name = "errorMessage")] string errorMessage)
        {
            var endpoint = JsonConvert.DeserializeObject<Endpoint>(endpointRaw);
            LoggingService.Create(new RequestLog
            {
                Recieved = data,
                Returned = errorMessage,
                Endpoint = endpoint,
                IsError = true
            });
            return BadRequest(errorMessage);
        }
        
    }
}
