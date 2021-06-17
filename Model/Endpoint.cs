using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace IntegrationTestingTool.Model
{
    public class Endpoint
    {
        public string Path { get; set; }

        public IEnumerable<InputParameter> InputParameters { get; set; }

        public bool AcceptJustSuccessfulStatusCode { get; set; }

        public IEnumerable<OutputParameter> OutputParameters { get; set; }
    }
}
