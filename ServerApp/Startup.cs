using IntegrationTestingTool.Socket;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.SpaServices.ReactDevelopmentServer;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using IntegrationTestingTool.Extensions;
using IntegrationTestingTool.Settings;
using IntegrationTestingTool.Routing;
using System;

namespace IntegrationTestingTool
{
    public class Startup
    {
        private IConfiguration Configuration { get; }

        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public void ConfigureServices(IServiceCollection services)
        {
            services.AddCors();

            services.AddSignalR();
            services.AddControllersWithViews();
            services.AddSpaStaticFiles(configuration =>
            {
                configuration.RootPath = "ClientApp/build";
            });

            services.BindSettings(Configuration);
            services.BindServices();
            services.AddSingleton<IHttpContextAccessor, HttpContextAccessor>();
            services.AddSingleton<DynamicRouter>();
        }

        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseCors(builder => builder.AllowAnyOrigin().WithOrigins("null", "https://localhost:44315")
                    .AllowAnyHeader().AllowAnyMethod().AllowCredentials());
                app.UseDeveloperExceptionPage();
            }
            else
            {
                var clientConfig = Configuration.GetSection(nameof(ClientSettings)).Get<ClientSettings>();
                if (clientConfig != null && !string.IsNullOrEmpty(clientConfig.ClientUrl))
                {
                    app.UseCors(builder => builder.WithOrigins(clientConfig.ClientUrl)
                        .AllowAnyMethod().AllowAnyHeader().AllowCredentials());
                }
             
                app.UseExceptionHandler("/Error");
                app.UseHsts();
            }
            
            app.UseHttpsRedirection();
            app.UseStaticFiles();
            app.UseSpaStaticFiles();

            app.UseRouting();
             
            app.UseEndpoints(endpoints =>
            {
                endpoints.MapHub<LogsHub>("/hubs/logs");
                var serverConfig = Configuration.GetSection(nameof(ServerSettings)).Get<ServerSettings>();
                if (serverConfig != null && !string.IsNullOrEmpty(serverConfig.ApiName))
                {
                    var dataPart = "{**data}";
                    endpoints.MapDynamicControllerRoute<DynamicRouter>($"{serverConfig.ApiName}/{dataPart}");
                }
                else
                {
                    throw new Exception($"There is no {nameof(ServerSettings.ApiName)} parameter at the appsetings {nameof(ServerSettings)} section");
                }
                
                endpoints.MapControllers();
            });

            if (env.IsDevelopment())
            {
                app.UseSpa(spa =>
                {
                    spa.Options.SourcePath = "../ClientApp";
                    if (env.IsDevelopment())
                    {
                        spa.UseReactDevelopmentServer(npmScript: "start");
                    }
                });
            }
        }
    }
}
