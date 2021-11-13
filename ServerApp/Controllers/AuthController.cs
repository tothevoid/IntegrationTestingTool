using IntegrationTestingTool.Model.Entities;
using IntegrationTestingTool.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using IntegrationTestingTool.Model;

namespace IntegrationTestingTool.Controllers
{
    [ApiController]
    [Route("[controller]/[action]")]
    [Produces("application/json")]
    public class AuthController: Controller
    {
        private IAuthService AuthService { get; }

        public AuthController(IAuthService authService)
        {
            AuthService = authService;
        }

        [HttpGet]
        public async Task<IEnumerable<Auth>> GetAll() =>
            await AuthService.GetAll();

        [HttpGet]
        public async Task<IEnumerable<Option<Guid, string>>> GetAllAsLookup() =>
            await AuthService.GetAllAsLookup();

        [HttpGet]
        public async Task<Auth> Get(Guid id) =>
            await AuthService.GetById(id);
        
        [HttpPost]
        public async Task<Auth> Add(Auth auth) =>
            await AuthService.Create(auth);

        [HttpPost]
        public async Task<Auth> Update(Auth auth) =>
            await AuthService.Update(auth);

        [HttpGet]
        public async Task<string> Delete(Guid id) =>
            await AuthService.Delete(id);
    }
}
