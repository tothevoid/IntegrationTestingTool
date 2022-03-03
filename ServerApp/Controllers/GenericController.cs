using IntegrationTestingTool.Model.Entities;
using IntegrationTestingTool.Model.Enums;
using IntegrationTestingTool.Services.Inerfaces;
using IntegrationTestingTool.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace IntegrationTestingTool.Controllers
{
    [ApiController]
    [Route("[controller]")]
    [Produces("application/json")]
    public class GenericController: Controller
    {
        private ILoggingService LoggingService { get; }
        private IAsyncRequestService AsyncRequestService { get; }
        private IEndpointService EndpointService { get; }

        public GenericController(ILoggingService loggingService, 
            IAsyncRequestService asyncRequestService, IEndpointService endpointService, IFileService fileService)
        {
            LoggingService = loggingService;
            AsyncRequestService = asyncRequestService;
            EndpointService = endpointService;
        }

        public async Task<IActionResult> Get([FromRoute(Name = "data")] string data, 
            [FromRoute(Name = "endpoint")] Guid endpointId)
        {
            var caller = HttpContext.Request.Host;

            var endpoint = await EndpointService.FindById(endpointId, true);
            var outputData = endpoint.OutputData;
            //TODO: get rid of try/catch
            try
            {
                var json = JsonConvert.DeserializeObject(endpoint.OutputData);
                HttpContext.Response.Headers["Content-Type"] = "application/json; charset=utf-8";
            }
            catch { }
            HttpContext.Response.StatusCode = endpoint.OutputStatusCode;
            endpoint.OutputData = null;
            var tasks = new List<Task>
            {
                LoggingService.Create(new RequestLog
                {
                    Received = data,
                    Endpoint = endpoint
                })
            };

            if (endpoint.CallbackType == CallbackType.Asynchronous)
            {
                tasks.Add(Task.Run(async () => await AsyncRequestService.Call(endpoint)));
            }

            await Task.WhenAll(tasks);
            return Content(outputData);
        }

        public async Task<IActionResult> Error([FromRoute(Name = "data")] string data, 
            [FromRoute(Name = "endpoint")] string endpointRaw, 
            [FromRoute(Name = "errorMessage")] string errorMessage) 
        {
            var settings = new JsonSerializerSettings { NullValueHandling = NullValueHandling.Ignore };
            var endpoint = JsonConvert.DeserializeObject<Endpoint>(endpointRaw, settings);
            await LoggingService.Create(new RequestLog
            {
                Received = data,
                Endpoint = endpoint,
                IsError = true
            });
            return BadRequest(errorMessage);
        }
    }
}
