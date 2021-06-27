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
    [Route("[controller]/[action]")]
    [Produces("application/json")]
    public class EndpointController
    {
        private readonly IEndpointService _endpointService;

        public EndpointController(IEndpointService endpointService)
        {
            _endpointService = endpointService;
        }

        [HttpGet]
        public IEnumerable<Endpoint> GetAll() =>
            _endpointService.GetAll();

        [HttpPost]
        public void Add(Endpoint endpoint) =>
            _endpointService.Create(endpoint);

        [HttpGet]
        public string ValidateUrl(string path) =>
            _endpointService.ValidateUrl(path);
    }
}
