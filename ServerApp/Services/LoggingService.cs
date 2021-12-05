using IntegrationTestingTool.Model.Entities;
using IntegrationTestingTool.Services.Interfaces;
using IntegrationTestingTool.Settings;
using IntegrationTestingTool.Socket;
using Microsoft.AspNetCore.SignalR;
using MongoDB.Driver;
using System;
using System.Collections.Generic;
using System.Linq.Expressions;
using System.Threading.Tasks;
using IntegrationTestingTool.Settings.Interfaces;

namespace IntegrationTestingTool.Services
{
    public class LoggingService: ILoggingService
    {
        private IMongoCollection<RequestLog> MongoCollection { get; }
        private IHubContext<LogsHub> HubContext { get; }

        public LoggingService(IDatabaseSettings settings, IHubContext<LogsHub> hubContext)
        {
            var client = new MongoClient(settings.ConnectionString);
            MongoCollection = client.GetDatabase(settings.DatabaseName).GetCollection<RequestLog>("RequestLogs");
            HubContext = hubContext;
        }

        public async Task<IEnumerable<RequestLog>> GetAll(DateTime date)
        {
            var options = new FindOptions<RequestLog, RequestLog>
            {
                Sort = Builders<RequestLog>.Sort.Descending(endpoint => endpoint.CreatedOn)
            };

            Expression<Func<RequestLog, bool>> filter = endpoint =>
                endpoint.CreatedOn >= date.Date && endpoint.CreatedOn < date.Date.AddDays(1);
            
            return (await MongoCollection.FindAsync(filter, options)).ToList();
        }
        
        public async Task<RequestLog> Create(RequestLog log)
        {
            var insertTask = MongoCollection.InsertOneAsync(log);
            var notificationTask = HubContext.Clients.All.SendAsync("NewLog", log);
            await Task.WhenAll(insertTask, notificationTask);
            return log;
        }
    }
}
