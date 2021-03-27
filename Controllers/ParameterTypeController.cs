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
    public class ParameterTypeController
    {
        public ParameterTypeController()
        {

        }
        
        [HttpGet]
        public IEnumerable<ParameterType> GetTypes()
        {
            //samples
            return new List<ParameterType>()
            {
                new ParameterType {Id = "0", Name = nameof(String)},
                new ParameterType {Id = "1", Name = nameof(Boolean)},
                new ParameterType {Id = "2", Name = "Integer"},
                new ParameterType {Id = "3", Name = nameof(DateTime)}
            };
        }
    }
}
