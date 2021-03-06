using IntegrationTestingTool.Services.Inerfaces;
using IntegrationTestingTool.Services.Interfaces;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc.Routing;
using Microsoft.AspNetCore.Routing;
using Newtonsoft.Json;
using System.IO;
using System.Linq;
using System.Threading.Tasks;

namespace IntegrationTestingTool
{
    public class DynamicRouter: DynamicRouteValueTransformer
    {
        private IRouteHandlerService RouteHandlerService { get; }
   
        public DynamicRouter(IRouteHandlerService routeHandlerService)
        {
            RouteHandlerService = routeHandlerService;
        }

        public override async ValueTask<RouteValueDictionary> TransformAsync(HttpContext httpContext, RouteValueDictionary values)
        {
            var output = new RouteValueDictionary()
            {
                { "controller", "Generic" }
            };

            var urlParts = httpContext.Request.Path.Value.Split("/")
                .Where(x => x != string.Empty)
                .Skip(1);
            string path = string.Join("/", urlParts);
            var endpoint = RouteHandlerService.GetEndpointByPathAndMethod(path, httpContext.Request.Method.ToUpper());

            string body = string.Empty;
            if (httpContext.Request.ContentType == "application/json")
            {
                using (StreamReader stream = new StreamReader(httpContext.Request.Body))
                {
                    body = await stream.ReadToEndAsync();
                }
            }

            var errorMessage = (endpoint == null) ?
                "There is no endpoint with the same url and method" :
                string.Empty;

            if (string.IsNullOrEmpty(errorMessage))
            {
                output["action"] = "GET";
                output["data"] = body;
                output["endpoint"] = JsonConvert.SerializeObject(endpoint);
            } 
            else
            {
                var customEndpoint = new Model.Endpoint { Method = httpContext.Request.Method, Path = path, OutputStatusCode = 400};
                output["action"] = "ERROR";
                output["data"] = body;
                output["errorMessage"] = errorMessage;
                output["endpoint"] = JsonConvert.SerializeObject(customEndpoint);
            }
            return output;
        }
    }
}
