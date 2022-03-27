using IntegrationTestingTool.Model.Entities;
using System;
using System.Collections.Generic;
using System.Text;

namespace ServerApp.Tests
{
    internal static class EntityFactory
    {
        public static Auth GetAuth() =>
            new Auth
            {
                Name = "TestAuth",
                Method = "POST",
                URL = "https://www.test.com",
                Data = "{data:\"test\"}"
            };

        public static Endpoint GetEndpoint() =>
            new Endpoint
            {
                OutputData = "output test data",
                CallbackData = "callback test data",
                Path = "test",
                Active = true,
                Method = "POST",
                CallbackUrl = "http://www.testcallback.com",
                OutputStatusCode = 200
            };

        public static Group GetGroup()
        {
            var date = DateTime.UtcNow;
            return new Group()
            {
                Name = "Test",
                CreatedOn = new DateTime(date.Year, date.Month, date.Day, date.Hour, date.Minute, date.Second, date.Kind)
            };
        }

        public static RequestLog GetLog() =>
            new RequestLog
            {
                Received = "TestLog",
                IsError = false
            };
    }
}
