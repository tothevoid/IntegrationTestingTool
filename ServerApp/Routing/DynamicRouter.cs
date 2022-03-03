using IntegrationTestingTool.Services.Inerfaces;
using IntegrationTestingTool.Utils;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc.Routing;
using Microsoft.AspNetCore.Routing;
using Newtonsoft.Json;
using System;
using System.IO;
using System.Net.Mime;
using System.Threading.Tasks;

namespace IntegrationTestingTool.Routing
{
    public class DynamicRouter: DynamicRouteValueTransformer
    {
        private IRouteHandlerService RouteHandlerService { get; }

        public DynamicRouter(IRouteHandlerService routeHandlerService)
        {
            RouteHandlerService = routeHandlerService;
        }

        public override async ValueTask<RouteValueDictionary> TransformAsync(HttpContext httpContext, 
            RouteValueDictionary values)
        {
            var path = UrlUtils.TrimLastPart(httpContext?.Request?.Path.Value);

            var endpoint = await RouteHandlerService
                .GetEndpointByPathAndMethod(path, httpContext.Request.Method.ToUpper(), httpContext.Request.Headers);
            
            var body = await GetRequestBody(httpContext.Request);

            return endpoint != null ?
                GenerateCorrectRedirect(body, endpoint.Id):
                GenerateErrorRedirect(httpContext.Request.Method, path, body);
        }

        private static RouteValueDictionary GetBasicRouteValueDictionary() =>
           new RouteValueDictionary()
           {
                { "controller", "Generic" }
           };

        private static RouteValueDictionary GenerateCorrectRedirect(string body, Guid endpointId)
        {
            var routeValues = GetBasicRouteValueDictionary();

            routeValues["action"] = "GET";
            routeValues["data"] = body;
            routeValues["endpoint"] = endpointId;

            return routeValues;
        }

        private static RouteValueDictionary GenerateErrorRedirect(string method, string path, string body)
        {
            var routeValues = GetBasicRouteValueDictionary();

            var customEndpoint = new Model.Entities.Endpoint
            {
                Method = method,
                Path = path,
                OutputStatusCode = 400
            };
            routeValues["action"] = "ERROR";
            routeValues["data"] = body;
            routeValues["errorMessage"] = "There is no active endpoint with the same url, method and headers";
            routeValues["endpoint"] = JsonConvert.SerializeObject(customEndpoint,
                new JsonSerializerSettings
                {
                    NullValueHandling = NullValueHandling.Ignore,
                    DefaultValueHandling = DefaultValueHandling.Ignore
                });

            return routeValues;
        }

        private static async Task<string> GetRequestBody(HttpRequest request)
        {
            if (request.ContentType != MediaTypeNames.Application.Json) return string.Empty;
            using var stream = new StreamReader(request.Body);
            return await stream.ReadToEndAsync();
        }
    }
}
