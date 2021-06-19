using IntegrationTestingTool.Model;
using IntegrationTestingTool.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace IntegrationTestingTool.Controllers
{
    [ApiController]
    [Route("[controller]")]
    [Produces("application/json")]
    public class EndpointController
    {
        private readonly IEndpointService _endpointService;

        public EndpointController(IEndpointService endpointService)
        {
            _endpointService = endpointService;
        }

        [HttpGet]
        public IEnumerable<Endpoint> Get() =>
            _endpointService.GetAll();

        [HttpPost]
        public void Post(Endpoint endpoint) =>
            _endpointService.Create(endpoint);

    }
}
