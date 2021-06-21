using IntegrationTestingTool.Model;
using IntegrationTestingTool.Services.Inerfaces;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc.Routing;
using Microsoft.AspNetCore.Routing;
using Newtonsoft.Json;
using System;
using System.Linq;
using System.Threading.Tasks;

namespace IntegrationTestingTool
{
    public class TestRequestsValueTransformer: DynamicRouteValueTransformer
    {
        private readonly IRouteHandlerService _routeHandlerService;
        public TestRequestsValueTransformer(IRouteHandlerService routeHandlerService)
        {
            _routeHandlerService = routeHandlerService;
        }

        public override ValueTask<RouteValueDictionary> TransformAsync(HttpContext httpContext, RouteValueDictionary values)
        {
            var parts = httpContext.Request.Path.Value.Split("/").Where(x => x != "test" && x != string.Empty);
            var path = string.Join("/", parts);
            var endpoint = _routeHandlerService.GetEndpointByPath(path);

            if (endpoint != null)
            {
                values["controller"] = "Generic";
                values["action"] = httpContext.Request.Method;
                values["data"] = string.Empty;
                values["endpoint"] = JsonConvert.SerializeObject(endpoint);
                return new ValueTask<RouteValueDictionary>(values);
            }
            return default;
        }
    }
}
