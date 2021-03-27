using IntegrationTestingTool.Model;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace IntegrationTestingTool.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class EndpointController : ControllerBase
    {
        private readonly ILogger<EndpointController> _logger;

        public EndpointController(ILogger<EndpointController> logger)
        {
            _logger = logger;
        }

        [HttpPost]
        public void Post(Endpoint endpoint)
        {

        }
    }
}
