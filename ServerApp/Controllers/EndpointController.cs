using IntegrationTestingTool.Model;
using IntegrationTestingTool.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;

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
        public IEnumerable<Endpoint> GetAll(string path) =>
             EndpointService.GetAllByPath(path);

        [HttpPost]
        public void Add(Endpoint endpoint) =>
            EndpointService.Create(endpoint);

        [HttpGet]
        public bool Delete(Guid id) =>
            EndpointService.Delete(id);

        [HttpGet]
        public string ValidateUrl(string path) =>
            EndpointService.ValidateUrl(path);


        [HttpGet]
        public IEnumerable<int> GetStatusCodes() =>
            EndpointService.GetStatusCodes();

        [HttpGet]
        public IEnumerable<string> GetRESTMethods() =>
            EndpointService.GetRESTMethods();
    }
}
