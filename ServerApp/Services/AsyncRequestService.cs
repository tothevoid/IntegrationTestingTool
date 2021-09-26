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

            foreach (var parameter in auth.RequestParameters)
            {
                switch (parameter.Source)
                {
                    case PropertyTarget.Body:
                        throw new NotImplementedException();
                    case PropertyTarget.Header:
                        if (!authResult.Headers.TryGetValues(parameter.SourcePath, out var headerValues))
                        {
                            continue;
                        }
                        string headerValue = headerValues.FirstOrDefault();
                        if (string.IsNullOrEmpty(headerValue))
                        {
                            continue;
                        }

                        switch (parameter.Destination)
                        {
                            case PropertyTarget.Body:
                                var paths = parameter.SourcePath.Split(".");
                                if (paths != null && paths.Length != 0)
                                {

                                }
                                continue;
                            case PropertyTarget.Header:
                                if (parameter.Destination == PropertyTarget.Header)
                                {
                                    client.DefaultRequestHeaders.Add(parameter.DestinationPath, headerValue);
                                }
                                continue;
                            default:
                                throw new NotImplementedException();
                        }
                }
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
