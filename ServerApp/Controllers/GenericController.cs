using IntegrationTestingTool.Model.Entities;
using IntegrationTestingTool.Model.Enums;
using IntegrationTestingTool.Services.Inerfaces;
using IntegrationTestingTool.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using System;
using System.Threading.Tasks;

namespace IntegrationTestingTool.Controllers
{
    [ApiController]
    [Route("[controller]")]
    [Produces("application/json")]
    public class GenericController: Controller
    {
        private IRouteHandlerService RouteHandlerService { get; }
        private ILoggingService LoggingService { get; }
        private IAsyncRequestService AsyncRequestService { get; }
        private IEndpointService EndpointService { get; }
        private IFileService FileService { get; }

        public GenericController(IRouteHandlerService routeHandlerService, ILoggingService loggingService, 
            IAsyncRequestService asyncRequestService, IEndpointService endpointService, IFileService fileService)
        {
            RouteHandlerService = routeHandlerService;
            LoggingService = loggingService;
            AsyncRequestService = asyncRequestService;
            EndpointService = endpointService;
            FileService = fileService;
        }

        public IActionResult Get([FromRoute(Name = "data")] string data, [FromRoute(Name = "endpoint")] Guid endpointId)
        {
            var endpoint = EndpointService.FindById(endpointId);
            var text = FileService.Get(endpoint.OutputDataFile);

            //TODO: get rid of try/catch
            try
            {
                var json = JsonConvert.DeserializeObject(text);
                HttpContext.Response.Headers["Content-Type"] = "application/json; charset=utf-8";
            }
            catch { }
            HttpContext.Response.StatusCode = endpoint.OutputStatusCode;
            LoggingService.Create(new RequestLog 
            {
                Recieved = data,
                Endpoint = endpoint
            });

            if (endpoint.CallbackType == CallbackType.Asynchronous)
            {
                Task.Run(() => AsyncRequestService.Call(endpoint));
            }

            return Content(text);
        }

        public IActionResult Error([FromRoute(Name = "data")] string data, [FromRoute(Name = "endpoint")] string endpointRaw, 
            [FromRoute(Name = "errorMessage")] string errorMessage)
        {
            var endpoint = JsonConvert.DeserializeObject<Endpoint>(endpointRaw);
            LoggingService.Create(new RequestLog
            {
                Recieved = data,
                Endpoint = endpoint,
                IsError = true
            });
            return BadRequest(errorMessage);
        }
    }
}
