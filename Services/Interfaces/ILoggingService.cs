using IntegrationTestingTool.Model;
using System.Collections.Generic;

namespace IntegrationTestingTool.Services.Interfaces
{
    public interface ILoggingService
    {
        IEnumerable<RequestLog> GetAll();

        RequestLog Create(RequestLog log);
    }
}
