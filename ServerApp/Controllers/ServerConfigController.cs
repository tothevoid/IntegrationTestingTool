using IntegrationTestingTool.Model;
using IntegrationTestingTool.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace IntegrationTestingTool.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class ServerConfigController
    {
        private IConfigService ConfigService { get; }
        public ServerConfigController(IConfigService configService)
        {
            ConfigService = configService;
        }

        [HttpGet]
        public ServerConfig Get() => 
            ConfigService.GetServerConfig();
    }
}
