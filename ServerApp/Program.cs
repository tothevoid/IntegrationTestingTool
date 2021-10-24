using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Hosting;

namespace IntegrationTestingTool
{
    public class Program
    {
        public static void Main(string[] args)
        {
            CreateHostBuilder(args).Build().Run();
        }

        public static IHostBuilder CreateHostBuilder(string[] args)
        {
            bool isHostedByIIS = System.Environment.GetEnvironmentVariable("APP_POOL_ID") != null;
            var builder = Host.CreateDefaultBuilder(args);
            return (isHostedByIIS) ?
                builder.ConfigureWebHostDefaults(webBuilder => webBuilder.UseStartup<Startup>()) :
                builder.ConfigureWebHostDefaults(webBuilder =>
                {
                    webBuilder.UseStartup<Startup>().UseKestrel(settings => 
                        settings.Limits.MaxRequestBodySize = long.MaxValue);
                });
        }
    }
}
