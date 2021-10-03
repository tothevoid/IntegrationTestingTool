using IntegrationTestingTool.Model;
using IntegrationTestingTool.Model.Enums;
using IntegrationTestingTool.Services.Interfaces;
using Newtonsoft.Json;
using System;
using System.Linq;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;

namespace IntegrationTestingTool.Services
{
    public class AsyncRequestService : IAsyncRequestService
    {
        private ILoggingService LoggingService { get; }
        public AsyncRequestService(ILoggingService loggingService)
        {
            LoggingService = loggingService;
        }

        public async Task Call(Endpoint endpoint)
        {
            using var client = new HttpClient();

            var message = new HttpRequestMessage(new HttpMethod(endpoint.CallbackMethod), endpoint.CallbackData);

            if (!string.IsNullOrEmpty(endpoint.CallbackData))
            {
                message.Content = new StringContent(endpoint.CallbackData, Encoding.UTF8, "application/json");
            }
            try
            {
                var result = await client.SendAsync(message);
                LoggingService.Create(new RequestLog { Endpoint = endpoint, Returned = await result.Content.ReadAsStringAsync() });
            }
            catch (Exception ex)
            {
                LoggingService.Create(new RequestLog { Endpoint = endpoint, IsError = true, Returned = ex.Message });
            }
            
        }

        public async Task Authorize(Endpoint endpoint, Auth auth)
        {
            var authResult = await CallAuthRequest(auth);
            var responseText = await authResult.Content.ReadAsStringAsync();

            dynamic callbackData = JsonConvert.DeserializeObject(endpoint.CallbackData);

            using var client = new HttpClient();

            var message = new HttpRequestMessage(new HttpMethod(endpoint.CallbackMethod), endpoint.CallbackURL);
            if (!string.IsNullOrEmpty(endpoint.CallbackData) || !string.IsNullOrEmpty(responseText))
            {
                message.Content = new StringContent(auth.Data, Encoding.UTF8, "application/json");
            }

            await client.SendAsync(message);
        }

        private async Task<HttpResponseMessage> CallAuthRequest(Auth auth)
        {
            using var client = new HttpClient();

            var message = new HttpRequestMessage(new HttpMethod(auth.Method), auth.URL);
            if (!string.IsNullOrEmpty(auth.Data))
            {
                message.Content = new StringContent(auth.Data, Encoding.UTF8, "application/json");
            }

            return await client.SendAsync(message);
        }
    }
}
