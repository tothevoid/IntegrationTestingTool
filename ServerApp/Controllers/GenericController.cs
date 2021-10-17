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

        public async Task<IActionResult> Get([FromRoute(Name = "data")] string data, [FromRoute(Name = "endpoint")] Guid endpointId)
        {
            var endpoint = await EndpointService.FindById(endpointId);
            var text = (endpoint.OutputDataFile != default) ?
                await FileService.Get(endpoint.OutputDataFile) :
                endpoint.OutputData;

            //TODO: get rid of try/catch
            try
            {
                var json = JsonConvert.DeserializeObject(text);
                HttpContext.Response.Headers["Content-Type"] = "application/json; charset=utf-8";
            }
            catch { }
            HttpContext.Response.StatusCode = endpoint.OutputStatusCode;
            await LoggingService.Create(new RequestLog 
            {
                Recieved = data,
                Endpoint = endpoint
            });

            if (endpoint.CallbackType == CallbackType.Asynchronous)
            {
                await Task.Run(async () => await AsyncRequestService.Call(endpoint));
            }

            return Content(text);
        }

        public async Task<IActionResult> Error([FromRoute(Name = "data")] string data, [FromRoute(Name = "endpoint")] string endpointRaw, 
            [FromRoute(Name = "errorMessage")] string errorMessage)
        {
            var settings = new JsonSerializerSettings { NullValueHandling = NullValueHandling.Ignore };
            var endpoint = JsonConvert.DeserializeObject<Endpoint>(endpointRaw, settings);
            await LoggingService.Create(new RequestLog
            {
                Recieved = data,
                Endpoint = endpoint,
                IsError = true
            });
            return BadRequest(errorMessage);
        }
    }
}
