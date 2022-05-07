using IntegrationTestingTool.Model.Entities;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace IntegrationTestingTool.Services.Interfaces
{
    public interface ILoggingService
    {
        Task<IEnumerable<RequestLog>> GetAll(DateTime date, int offset);

        Task<RequestLog> Create(RequestLog log);
    }
}
