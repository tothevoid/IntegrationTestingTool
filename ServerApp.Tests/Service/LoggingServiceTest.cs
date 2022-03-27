using IntegrationTestingTool.Model.Entities;
using IntegrationTestingTool.Services.Entity;
using IntegrationTestingTool.Services.Interfaces;
using IntegrationTestingTool.Socket;
using Microsoft.AspNetCore.SignalR;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using MongoDB.Driver;
using Moq;
using ServerApp.Tests.DatabaseMock;
using System;
using System.Dynamic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace ServerApp.Tests
{
    [TestClass]
    public class LoggingServiceTest
    {
        private ILoggingService LogService { get; }

        private event Action<string, object[]>? OnMessageSent;

        public LoggingServiceTest()
        {
            void callback(string action, object[] methods)
            {
                OnMessageSent?.Invoke(action, methods);
            };

            var mockHub = UtilitaryFactory.GetMockHub<LogsHub>(callback);
            LogService = new LoggingService(new MockUnitOfWork(), mockHub);
        }

        [TestMethod]
        public async Task GetAllTest()
        {
            var endpoint = EntityFactory.GetEndpoint();

            RequestLog GetEndpoint(DateTime dateTime)
            {
                var log = EntityFactory.GetLog();
                log.Endpoint = endpoint;
                log.CreatedOn = dateTime;
                return log;
            }

            var currentDateTime = DateTime.Now;

            var endpointsBefore = await LogService.GetAll(currentDateTime);
            var firstLog = GetEndpoint(currentDateTime);
            var secondLog = GetEndpoint(currentDateTime.AddDays(-2));
            await Task.WhenAll(LogService.Create(firstLog),
                LogService.Create(secondLog));

            var endpointsAfter = await LogService.GetAll(currentDateTime);

            Assert.AreEqual(0, endpointsBefore.Count());
            Assert.AreEqual(1, endpointsAfter.Count());
            var newEndpoints = endpointsAfter.Except(endpointsBefore);
            Assert.AreEqual(firstLog.Id, newEndpoints.First().Id);
        }

        [TestMethod]
        public async Task CreateTest()
        {
            var log = EntityFactory.GetLog();
            var messageSent = false;

            OnMessageSent += (string action, object[] entities) =>
            {
                if (action == "NewLog" && entities != null &&
                    entities.Length == 1) 
                {
                    var storedLog = entities[0] as RequestLog;
                    if (storedLog != null && log.Id == storedLog.Id)
                    {
                        messageSent = true;
                    }
                }
            };

            await LogService.Create(log);
            Assert.IsTrue(messageSent);
        }
    }
}