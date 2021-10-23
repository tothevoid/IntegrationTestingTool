using IntegrationTestingTool.Model;
using IntegrationTestingTool.Model.Entities;
using IntegrationTestingTool.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace IntegrationTestingTool.Controllers
{
    [ApiController]
    [Route("[controller]/[action]")]
    [Produces("application/json")]
    public class EndpointController: Controller
    {
        private IEndpointService EndpointService { get; }

        public EndpointController(IEndpointService endpointService)
        {
            EndpointService = endpointService;
        }

        [HttpGet]
        public async Task<IEnumerable<Endpoint>> GetAll(string path, bool onlyActive) =>
             await EndpointService.GetAllByFilters(path, onlyActive);

        [HttpPost]
        [RequestFormLimits(MultipartBodyLengthLimit = 1073741824)]
        public async Task Add([FromForm] Endpoint endpoint) =>
            await EndpointService.Create(endpoint);

        [HttpGet]
        public async Task<IActionResult> Get(Guid id)
        {
            var endpoint = await EndpointService.FindById(id);
            if (endpoint == null) 
            {
                return new BadRequestResult();
            }
            else
            {
                return new OkObjectResult(endpoint);
            }
        }

        [HttpPost]
        [RequestFormLimits(MultipartBodyLengthLimit = 1073741824)]
        public async Task Update([FromForm] Endpoint endpoint) =>
            await EndpointService.Update(endpoint);

        [HttpGet]
        public async Task<bool> Delete(Guid id) =>
            await EndpointService.Delete(id);

        [HttpGet]
        public IEnumerable<int> GetStatusCodes() =>
            EndpointService.GetStatusCodes();

        [HttpGet]
        public IEnumerable<string> GetRESTMethods() =>
            EndpointService.GetRESTMethods();
    }
}
