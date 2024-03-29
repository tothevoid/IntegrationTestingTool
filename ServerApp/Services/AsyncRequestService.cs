﻿using IntegrationTestingTool.Model.Entities;
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
            using var client = new HttpClient();
            if (endpoint.AuthId != null)
            {
                var auth = await AuthService.GetById(endpoint.AuthId.Value);
                var authResult = await CallAuthRequest(auth);
                var possibleValues = new Dictionary<string, IEnumerable<string>>();
                foreach (var (key, value) in authResult.Headers)
                {
                    possibleValues.TryAdd(key, value);
                }

                if (authResult.Headers.TryGetValues("Set-Cookie", out var cookies))
                {
                    var enumerable = cookies.ToList();
                    var allCookies = enumerable.Select(cookie => cookie.Split(";").First()).ToArray();
                    possibleValues.Add("Cookie", new List<string> { string.Join(";", allCookies) });
                    foreach (var cookie in allCookies.Select(x=>x.Split("=")))
                    {
                        var values = new List<string>();
                        if (cookie.Any())
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

            var message = new HttpRequestMessage(new HttpMethod(endpoint.CallbackMethod), endpoint.CallbackUrl);
            try
            {
                var result = await client.SendAsync(message);
                await LoggingService.Create(new RequestLog { Endpoint = endpoint });
            }
            catch (Exception ex)
            {
                await LoggingService.Create(new RequestLog { Endpoint = endpoint, IsError = true, Received = ex.Message});
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
