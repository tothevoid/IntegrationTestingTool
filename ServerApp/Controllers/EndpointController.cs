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
    public class EndpointController
    {
        private IEndpointService EndpointService { get; }

        public EndpointController(IEndpointService endpointService)
        {
            EndpointService = endpointService;
        }

        [HttpGet]
        public async Task<IEnumerable<Endpoint>> GetAll(string path) =>
             await EndpointService.GetAllByPath(path);

        [HttpPost]
        public async Task Add(Endpoint endpoint) =>
            await EndpointService.Create(endpoint);

        [HttpGet]
        public async Task<bool> Delete(Guid id) =>
            await EndpointService.Delete(id);

        [HttpGet]
        public async Task<string> ValidateUrl(string path) =>
            await EndpointService.ValidateUrl(path);


        [HttpGet]
        public IEnumerable<int> GetStatusCodes() =>
            EndpointService.GetStatusCodes();

        [HttpGet]
        public IEnumerable<string> GetRESTMethods() =>
            EndpointService.GetRESTMethods();
    }
}
