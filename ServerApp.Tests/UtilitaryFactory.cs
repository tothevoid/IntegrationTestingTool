using IntegrationTestingTool.Socket;
using Microsoft.AspNetCore.SignalR;
using Moq;
using ServerApp.Tests.DatabaseMock;
using System;
using System.Collections.Generic;
using System.Text;

namespace ServerApp.Tests
{
    internal static class UtilitaryFactory
    {
        public static IHubContext<T> GetMockHub<T>(Action<string, object[]> callback)
            where T: Hub
        {
            var proxy = new MockProxy(callback);
            var mockClients = new Mock<IHubClients>();
            mockClients.Setup(m => m.All).Returns(proxy);

            var hubContext = new Mock<IHubContext<T>>();
            hubContext.Setup(x => x.Clients).Returns(mockClients.Object);
            return hubContext.Object;
        }
    }
}
