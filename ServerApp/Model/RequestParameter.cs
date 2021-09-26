using IntegrationTestingTool.Model.Enums;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace IntegrationTestingTool.Model
{
    public class RequestParameter
    {
        public PropertyTarget Source { get; set; }
        
        public string SourcePath { get; set; }

        public PropertyTarget Destination { get; set; }

        public string DestinationPath { get; set; }
    }
}
