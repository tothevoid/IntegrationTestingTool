using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Hosting;

namespace IntegrationTestingTool
{
    // ReSharper disable once ClassNeverInstantiated.Global
    public class Program
    {
        public static void Main(string[] args)
        {
            CreateHostBuilder(args).Build().Run();
        }

        // ReSharper disable once MemberCanBePrivate.Global
        public static IHostBuilder CreateHostBuilder(string[] args)
        {
            var isHostedByIis = System.Environment.GetEnvironmentVariable("APP_POOL_ID") != null;
            var builder = Host.CreateDefaultBuilder(args);
            return (isHostedByIis) ?
                builder.ConfigureWebHostDefaults(webBuilder => webBuilder.UseStartup<Startup>()) :
                builder.ConfigureWebHostDefaults(webBuilder =>
                {
                    webBuilder.UseStartup<Startup>().UseKestrel(settings => 
                        settings.Limits.MaxRequestBodySize = long.MaxValue);
                });
        }
    }
}
