using IntegrationTestingTool.Services;
using IntegrationTestingTool.Services.Inerfaces;
using IntegrationTestingTool.Services.Interfaces;
using IntegrationTestingTool.Settings;
using IntegrationTestingTool.Settings.Interfaces;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Options;

namespace IntegrationTestingTool.Extensions
{
    public static class ServiceCollectionExtensions
    {
        public static void BindServices(this IServiceCollection services)
        {
            services.AddTransient<IRouteHandlerService, RouteHandlerService>();
            services.AddTransient<IEndpointService, EndpointService>();
            services.AddTransient<ILoggingService, LoggingService>();
            services.AddTransient<IConfigService, ConfigService>();
            services.AddTransient<IAsyncRequestService, AsyncRequestService>();
            services.AddTransient<IAuthService, AuthService>();
            services.AddTransient<IFileService, FileService>();
        }

        public static void BindSettings(this IServiceCollection services, IConfiguration configuration)
        {
            services.AddConfigSection<DatabaseSettings, IDatabaseSettings>(configuration);
            services.AddConfigSection<ServerSettings, IServerSettings>(configuration);
            services.AddConfigSection<ClientSettings, IClientSettings>(configuration);
        }
        
        private static void AddConfigSection<T, I>(this IServiceCollection services, IConfiguration configuration, 
            string sectionName = null) 
            where T: class, I, new()
            where I: class
        {
            if (string.IsNullOrEmpty(sectionName))
            {
                sectionName = typeof(T).Name;
            }

            services.Configure<T>(configuration.GetSection(sectionName));

            services.AddSingleton<I>(sp => sp.GetRequiredService<IOptions<T>>().Value);
        }
    }
}
