using IntegrationTestingTool.Model;
using IntegrationTestingTool.Services.Interfaces;
using IntegrationTestingTool.Settings.Interfaces;
using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace IntegrationTestingTool.Services
{
    public class ConfigService: IConfigService
    {
        private HttpRequest RequestContext { get; }

        private IServerSettings ServerSettings { get; }

        public ConfigService(IHttpContextAccessor httpContextAccessor, IServerSettings settings)
        {
            RequestContext = httpContextAccessor.HttpContext.Request;
            ServerSettings = settings;
        }

        public ServerConfig GetServerConfig() =>
            new ServerConfig
            {
                TestAPIUrl = $"{RequestContext.Scheme}://{RequestContext.Host.Value}/{ServerSettings.APIName}"
            };
    }
}
