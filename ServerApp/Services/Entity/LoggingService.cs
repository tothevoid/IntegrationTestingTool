using IntegrationTestingTool.Model.Entities;
using IntegrationTestingTool.Services.Interfaces;
using IntegrationTestingTool.Socket;
using Microsoft.AspNetCore.SignalR;
using MongoDB.Driver;
using System;
using System.Collections.Generic;
using System.Linq.Expressions;
using System.Threading.Tasks;
using System.Linq;
using IntegrationTestingTool.Domain.Interfaces;

namespace IntegrationTestingTool.Services.Entity
{
    public class LoggingService: ILoggingService
    {
        private IRepository<RequestLog> LoggingRepository { get; }
        private IHubContext<LogsHub> HubContext { get; }

        public LoggingService(IUnitOfWork unitOfWork, IHubContext<LogsHub> hubContext)
        {
            LoggingRepository = unitOfWork.CreateRepository<RequestLog>("RequestLogs");
            HubContext = hubContext;
        }

        public async Task<IEnumerable<RequestLog>> GetAll(DateTime date)
        {
            var sort = Builders<RequestLog>.Sort.Descending(endpoint => endpoint.CreatedOn);

            Expression<Func<RequestLog, bool>> filter = endpoint =>
                endpoint.CreatedOn >= date.Date && endpoint.CreatedOn < date.Date.AddDays(1);

            return (await LoggingRepository.GetAll(filter, orderBy: sort)).ToList();
        }

        public async Task<RequestLog> Create(RequestLog log)
        {
            var insertTask = LoggingRepository.Insert(log);
            var notificationTask = HubContext.Clients.All.SendAsync("NewLog", log);
            await Task.WhenAll(insertTask, notificationTask);
            return log;
        }
    }
}
