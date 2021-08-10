using IntegrationTestingTool.Model;
using IntegrationTestingTool.Services.Inerfaces;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc.Routing;
using Microsoft.AspNetCore.Routing;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System;
using System.IO;
using System.Linq;
using System.Threading.Tasks;

namespace IntegrationTestingTool
{
    public class DynamicRouter: DynamicRouteValueTransformer
    {
        private readonly IRouteHandlerService _routeHandlerService;
        public DynamicRouter(IRouteHandlerService routeHandlerService)
        {
            _routeHandlerService = routeHandlerService;
        }

        public override async ValueTask<RouteValueDictionary> TransformAsync(HttpContext httpContext, RouteValueDictionary values)
        {
            var output = new RouteValueDictionary()
            {
                { "controller", "Generic" }
            };

            var parts = httpContext.Request.Path.Value.Split("/").Where(x => x != "test" && x != string.Empty);
            var path = string.Join("/", parts);
            var endpoint = _routeHandlerService.GetEndpointByPath(path);

            string body = string.Empty;
            if (httpContext.Request.ContentType == "application/json")
            {
                using (StreamReader stream = new StreamReader(httpContext.Request.Body))
                {
                    body = await stream.ReadToEndAsync();
                }
            }

            var errorMessage = (endpoint == null) ?
                "There is no endpoint with the same url" :
                string.Empty;

            if (string.IsNullOrEmpty(errorMessage))
            {
                output["action"] = "GET";
                output["data"] = body;
                output["endpoint"] = JsonConvert.SerializeObject(endpoint);
            } 
            else
            {
                output["action"] = "ERROR";
                output["errorMessage"] = errorMessage;
            }
            return output;
        }
    }
}
