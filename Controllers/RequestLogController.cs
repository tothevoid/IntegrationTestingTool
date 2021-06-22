using IntegrationTestingTool.Model;
using IntegrationTestingTool.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;

namespace IntegrationTestingTool.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class RequestLogController
    {
        private readonly ILoggingService _loggingService;
        public RequestLogController(ILoggingService loggingService)
        {
            _loggingService = loggingService;
        }

        [HttpGet]
        public IEnumerable<RequestLog> Get() =>
            _loggingService.GetAll();
    }
}
