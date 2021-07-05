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
        private readonly ILoggingService _loggingService;
        public RequestLogController(ILoggingService loggingService)
        {
            _loggingService = loggingService;
        }

        [HttpGet]
        public IEnumerable<RequestLog> Get(DateTime date) =>
            _loggingService.GetAll(date).OrderByDescending(x => x.CreatedOn);
    }
}
