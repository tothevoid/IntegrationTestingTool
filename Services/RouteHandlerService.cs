using IntegrationTestingTool.Model;
using IntegrationTestingTool.Services.Inerfaces;
using IntegrationTestingTool.Services.Interfaces;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;

namespace IntegrationTestingTool.Services
{
    public class RouteHandlerService: IRouteHandlerService
    {
        private readonly IEndpointService _endpointService;
        public RouteHandlerService(IEndpointService endpointService)
        {
            _endpointService = endpointService;
        }

        public Endpoint GetEndpointByPath(string path) =>
            _endpointService.FindByParameter(nameof(Endpoint.Path), path).FirstOrDefault();
    

        public string ProcessRequest(Endpoint endpoint, string data)
        {
            if (endpoint.NoInput)
            {
                return string.Empty;
            }
            else
            {
                return FormatResponse(endpoint.OutputParameters);
            }
        }

        private string FormatResponse(IEnumerable<OutputParameter> parameters)
        {
            var values = parameters.ToDictionary(key => key.Name, value => GetValue(value.DesiredValue, value.Type));
            return JsonConvert.SerializeObject(values);
        }

        private object GetValue(string value, ParameterType type) =>
            Convert.ChangeType(value, type.GetTypeCode());

        private bool CheckIsCorrectProp(object value, ParameterType type)
        {
            if (type.CheckValueType(value.ToString()))
            {
                var convertedValue = Convert.ChangeType(value, type.GetTypeCode());
                return convertedValue != default;
            }
            return false;
        }
         

        public bool ValidateInputData(string inputData, IEnumerable<InputParameter> inputParameters)
        {
            if (string.IsNullOrEmpty(inputData))
            {
                return false;
            }
            List<string> ignoredParameters = new List<string>();
            var values = JsonConvert.DeserializeObject<Dictionary<string, object>>(inputData);

            foreach (var parameter in inputParameters)
            { 
                if (values.TryGetValue(parameter.Name, out object parameterValue) && 
                    CheckIsCorrectProp(parameterValue, parameter.Type))
                {
                    continue;
                }
                ignoredParameters.Add(parameter.Name);
            }

            return !ignoredParameters.Any();
        }
    }
}
