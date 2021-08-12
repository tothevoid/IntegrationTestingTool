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
                app.UseCors(builder => builder.WithOrigins("null", "https://localhost:44315").AllowAnyHeader().AllowAnyMethod().AllowCredentials());
                app.UseDeveloperExceptionPage();
            }
            else
            {
                var clientConfig = Configuration.GetSection(nameof(ClientSettings)).Get<ClientSettings>();
                if (clientConfig != null && !string.IsNullOrEmpty(clientConfig.ClientURL))
                {
                    app.UseCors(builder => builder.WithOrigins(clientConfig.ClientURL)
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
                endpoints.MapDynamicControllerRoute<DynamicRouter>("test/{**data}");
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
