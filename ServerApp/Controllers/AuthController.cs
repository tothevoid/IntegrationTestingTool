using IntegrationTestingTool.Model.Entities;
using IntegrationTestingTool.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;

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
        public IEnumerable<Auth> GetAll()
        {
            var result = AuthService.GetAll();
            return result;
        }
            

        [HttpPost]
        public void Add(Auth auth) =>
            AuthService.Create(auth);
    }
}
