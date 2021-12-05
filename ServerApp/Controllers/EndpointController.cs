using IntegrationTestingTool.Model;
using IntegrationTestingTool.Model.Entities;
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
    public class EndpointController: Controller
    {
        private IEndpointService EndpointService { get; }

        public EndpointController(IEndpointService endpointService)
        {
            EndpointService = endpointService;
        }

        [HttpGet]
        public async Task<IEnumerable<Endpoint>> GetAll(string path, bool isOnlyActive) =>
             await EndpointService.GetAllByFilters(path, isOnlyActive);

        [HttpPost]
        [RequestFormLimits(MultipartBodyLengthLimit = 1073741824)]
        public async Task<string> Add([FromForm] Endpoint endpoint)
        {
            var result = await EndpointService.Create(endpoint);
            return (result != null) ? string.Empty : "An error occured during endpoint creating";
        }
        
        [HttpPost]
        [RequestFormLimits(MultipartBodyLengthLimit = 1073741824)]
        public async Task<string> Copy([FromForm] Endpoint endpoint)
        {
            var result = await EndpointService.Copy(endpoint);
            return (result != null) ? string.Empty : "An error occured during endpoint creating";
        }

        [HttpGet]
        public async Task<IActionResult> Get(Guid id)
        {
            var endpoint = await EndpointService.FindById(id);
            return endpoint == null ? 
                (IActionResult) new BadRequestResult() : 
                new OkObjectResult(endpoint);
        }

        [HttpPost]
        [RequestFormLimits(MultipartBodyLengthLimit = 1073741824)]
        public async Task Update([FromForm] Endpoint endpoint) =>
            await EndpointService.Update(endpoint);

        [HttpGet]
        public async Task<bool> Delete(Guid id) =>
            await EndpointService.Delete(id);

        [HttpGet]
        public async Task<bool> SwitchActivity(Guid id, bool isActive) =>
            await EndpointService.SwitchActivity(id, isActive);
        
        [HttpGet]
        public IEnumerable<int> GetStatusCodes() =>
            EndpointService.GetStatusCodes().Distinct();
    }
}
