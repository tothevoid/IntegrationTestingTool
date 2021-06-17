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
    [Produces("application/json")]
    public class EndpointController
    {
        [HttpGet]
        public IEnumerable<Endpoint> Get()
        {
            //fetch endpoints from DB
            return new List<Endpoint>();
        }

        [HttpPost]
        public bool Post(Endpoint endpoint)
        {
            //insert into DB
            return false;
        }

    }
}
