using Microsoft.AspNetCore.SignalR;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace ServerApp.Tests.DatabaseMock
{
    internal class MockProxy : IClientProxy
    {
        private Action<string, object[]> MessageSent { get; }

        public MockProxy(Action<string, object[]> messageSentEvent)
        {
            MessageSent = messageSentEvent;
        }

        public async Task SendCoreAsync(string method, object[] args,
            CancellationToken cancellationToken = default)
        {
            MessageSent?.Invoke(method, args);
        }
    }
}
