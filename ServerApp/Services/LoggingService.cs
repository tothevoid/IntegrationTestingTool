using IntegrationTestingTool.Model.Entities;
using IntegrationTestingTool.Services.Interfaces;
using IntegrationTestingTool.Settings;
using IntegrationTestingTool.Socket;
using Microsoft.AspNetCore.SignalR;
using MongoDB.Bson;
using MongoDB.Driver;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

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
            var filter = new BsonDocument("$and", new BsonArray 
            { 
                new BsonDocument(nameof(RequestLog.CreatedOn), new BsonDocument("$gte", date.Date)),
                new BsonDocument(nameof(RequestLog.CreatedOn), new BsonDocument("$lt", date.Date.AddDays(1)))
            });

            var sort = Builders<RequestLog>.Sort.Descending(endpoint => endpoint.CreatedOn);
            var options = new FindOptions<RequestLog, RequestLog>
            {
                Sort = sort
            };
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
