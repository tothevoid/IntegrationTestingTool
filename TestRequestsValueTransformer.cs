using IntegrationTestingTool.Services.Inerfaces;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc.Routing;
using Microsoft.AspNetCore.Routing;
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
            values["controller"] = "Generic";
            values["action"] = httpContext.Request.Method;
            return new ValueTask<RouteValueDictionary>(values);
        }
    }
}
