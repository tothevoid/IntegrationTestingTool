using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace IntegrationTestingTool.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class GenericController
    {
        public string Get(string data)
        {
            return "Success";
        }

        public string Post(string data)
        {
            return "Success";
        }

        public string Put(string data)
        {
            return "Success";
        }

        public string Delete(string data)
        {
            return "Success";
        }
    }
}
