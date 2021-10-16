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
    public class AuthController
    {
        private IAuthService AuthService { get; }

        public AuthController(IAuthService authService)
        {
            AuthService = authService;
        }

        [HttpGet]
        public async Task<IEnumerable<Auth>> GetAll()
        {
            var result = await AuthService.GetAll();
            return result;
        }
            

        [HttpPost]
        public async Task Add(Auth auth) =>
            await AuthService.Create(auth);

        [HttpGet]
        public async Task<string> Delete(Guid id) =>
            await AuthService.Delete(id);
    }
}
