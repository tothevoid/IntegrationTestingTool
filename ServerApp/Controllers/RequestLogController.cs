using IntegrationTestingTool.Model;
using IntegrationTestingTool.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;

namespace IntegrationTestingTool.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class RequestLogController
    {
        private ILoggingService LoggingService { get; }
        public RequestLogController(ILoggingService loggingService)
        {
            LoggingService = loggingService;
        }

        [HttpGet]
        public IEnumerable<RequestLog> Get(DateTime date) =>
            LoggingService.GetAll(date).OrderByDescending(x => x.CreatedOn);
    }
}
