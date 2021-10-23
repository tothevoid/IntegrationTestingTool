using IntegrationTestingTool.Model.Entities;
using IntegrationTestingTool.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace IntegrationTestingTool.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class RequestLogController: Controller
    {
        private ILoggingService LoggingService { get; }
        public RequestLogController(ILoggingService loggingService)
        {
            LoggingService = loggingService;
        }

        [HttpGet]
        public async Task<IEnumerable<RequestLog>> Get(DateTime date) =>
            await LoggingService.GetAll(date);
    }
}
