using IntegrationTestingTool.Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace IntegrationTestingTool.Services.Inerfaces
{
    public interface IRouteHandlerService
    {
        Endpoint GetEndpointByPath(string path);

        string ProcessRequest(Endpoint endpoint, string data);

        bool ValidateInputData(string inputData, IEnumerable<InputParameter> inputParameters);
    }
}
