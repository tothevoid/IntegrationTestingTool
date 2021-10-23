using IntegrationTestingTool.Model.Entities;
using IntegrationTestingTool.Services.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;

namespace IntegrationTestingTool.Services
{
    public class AsyncRequestService : IAsyncRequestService
    {
        private ILoggingService LoggingService { get; }
        private IAuthService AuthService { get; }
        public AsyncRequestService(ILoggingService loggingService, IAuthService authService)
        {
            LoggingService = loggingService;
            AuthService = authService;
        }

        public async Task Call(Endpoint endpoint)
        {
            Auth auth = null;
            if (endpoint.AuthId != null)
            {
                auth = await AuthService.GetById(endpoint.AuthId.Value);
            }
            using var client = new HttpClient();

            if (auth != null)
            {
                var authResult = await CallAuthRequest(auth);
                var possibleValues = new Dictionary<string, IEnumerable<string>>();
                foreach (var header in authResult.Headers)
                {
                    possibleValues.TryAdd(header.Key, header.Value);
                }

                if (authResult.Headers.TryGetValues("Set-Cookie", out var cookies))
                {
                    var allCookies = cookies.Select(cookie => cookie.Split(";").First());
                    possibleValues.Add("Cookie", new List<string> { string.Join(";", allCookies) });
                    foreach (var cookie in cookies.Select(cookie => cookie.Split(";").First().Split("=")))
                    {
                        var values = new List<string>();
                        if (cookie.Count() >= 1)
                        {
                            values.Add(cookie[1]);
                        }
                        possibleValues.TryAdd(cookie[0], values);
                    }
                }
                
                //TODO: filter
                foreach (var responseHeader in auth.UsedResponseHeaders)
                {
                    if (possibleValues.TryGetValue(responseHeader, out var value))
                    {
                        client.DefaultRequestHeaders.Add(responseHeader, value);
                    }  
                }
            }

            var message = new HttpRequestMessage(new HttpMethod(endpoint.CallbackMethod), endpoint.CallbackURL);
            try
            {
                var result = await client.SendAsync(message);
                await LoggingService.Create(new RequestLog { Endpoint = endpoint });
            }
            catch (Exception ex)
            {
                await LoggingService.Create(new RequestLog { Endpoint = endpoint, IsError = true, Recieved = ex.Message});
            }
        }

        private async Task<HttpResponseMessage> CallAuthRequest(Auth auth)
        {
            using var client = new HttpClient();

            foreach (var header in auth.Headers)
            {
                client.DefaultRequestHeaders.Add(header.Key, header.Value);
            }

            var message = new HttpRequestMessage(new HttpMethod(auth.Method), auth.URL);
            if (!string.IsNullOrEmpty(auth.Data))
            {
                message.Content = new StringContent(auth.Data, Encoding.UTF8, "application/json");
            }

            return await client.SendAsync(message);
        }
    }
}
