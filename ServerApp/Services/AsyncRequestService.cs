using IntegrationTestingTool.Model.Entities;
using IntegrationTestingTool.Services.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Net.Mime;
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
            if (endpoint.AuthId != null)
            {
                await GetAuth(endpoint.AuthId.Value);
            }
            using var client = new HttpClient();
            
            try
            {
                var message = new HttpRequestMessage(new HttpMethod(endpoint.CallbackMethod), endpoint.CallbackUrl);
                var result = await client.SendAsync(message);
                await LoggingService.Create(new RequestLog { Endpoint = endpoint });
            }
            catch (Exception ex)
            {
                await LoggingService.Create(new RequestLog { Endpoint = endpoint, IsError = true, Received = ex.Message});
            }
        }

        private async Task<Dictionary<string, IEnumerable<string>>> GetAuth(Guid authId)
        {
            var auth = await AuthService.GetById(authId);
            var authResult = await SendAuthRequest(auth);

            var possibleValues = new Dictionary<string, IEnumerable<string>>();
            foreach (var (key, value) in authResult.Headers)
            {
                possibleValues.TryAdd(key, value);
            }

            if (authResult.Headers.TryGetValues("Set-Cookie", out var cookies))
            {
                ParseCookies(cookies).ToList().ForEach(cookie =>
                    possibleValues.TryAdd(cookie.Key, cookie.Value));
            }

            var headers = new Dictionary<string, IEnumerable<string>>();
            foreach (var responseHeader in auth.UsedResponseHeaders)
            {
                if (possibleValues.TryGetValue(responseHeader, out var value))
                {
                    headers.Add(responseHeader, value);
                }
            }
            return headers;
        }

        private Dictionary<string, IEnumerable<string>> ParseCookies(IEnumerable<string> cookies)
        {
            var allCookies = cookies.Select(cookie => cookie.Split(";").First()).ToArray();
            var possibleValues = new Dictionary<string, IEnumerable<string>>()
            {
                {"Cookie", new List<string> { string.Join(";", allCookies) }}
            };
           
            foreach (var cookie in allCookies.Select(x => x.Split("=")))
            {
                var values = new List<string>();
                if (cookie.Length >= 1)
                {
                    values.Add(cookie[1]);
                }
                possibleValues.TryAdd(cookie[0], values);
            }
            return possibleValues;
        }

        private async Task<HttpResponseMessage> SendAuthRequest(Auth auth)
        {
            using var client = new HttpClient();

            foreach (var header in auth.Headers)
            {
                client.DefaultRequestHeaders.Add(header.Key, header.Value);
            }

            var message = new HttpRequestMessage(new HttpMethod(auth.Method), auth.URL);
            if (!string.IsNullOrEmpty(auth.Data))
            {
                message.Content = new StringContent(auth.Data, 
                    Encoding.UTF8, MediaTypeNames.Application.Json);
            }

            return await client.SendAsync(message);
        }
    }
}
