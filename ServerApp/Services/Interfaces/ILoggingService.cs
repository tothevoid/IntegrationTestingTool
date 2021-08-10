using IntegrationTestingTool.Model;
using System;
using System.Collections.Generic;

namespace IntegrationTestingTool.Services.Interfaces
{
    public interface ILoggingService
    {
        IEnumerable<RequestLog> GetAll(DateTime date);

        RequestLog Create(RequestLog log);
    }
}
