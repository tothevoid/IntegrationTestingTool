using IntegrationTestingTool.Model;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace IntegrationTestingTool.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class ServerConfigController
    {
        [HttpGet]
        public ServerConfig Get() =>
            new ServerConfig
            {
                //TODO: Load it from env
                TestUrl = "https://localhost:44314/test/"
            };
        
    }
}
