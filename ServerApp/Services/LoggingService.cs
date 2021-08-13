using IntegrationTestingTool.Model;
using IntegrationTestingTool.Services.Interfaces;
using IntegrationTestingTool.Settings;
using IntegrationTestingTool.Socket;
using Microsoft.AspNetCore.SignalR;
using MongoDB.Bson;
using MongoDB.Driver;
using System;
using System.Collections.Generic;
using System.Linq;

namespace IntegrationTestingTool.Services
{
    public class LoggingService: ILoggingService
    {
        private IMongoCollection<RequestLog> MongoCollection { get; }
        protected IHubContext<LogsHub> HubContext { get; }

        public LoggingService(IDatabaseSettings settings, IHubContext<LogsHub> hubContext)
        {
            var client = new MongoClient(settings.ConnectionString);
            MongoCollection = client.GetDatabase(settings.DatabaseName).GetCollection<RequestLog>("RequestLogs");
            HubContext = hubContext;
        }

        public IEnumerable<RequestLog> GetAll(DateTime date)
        {
            var filter = new BsonDocument("$and", new BsonArray 
            { 
                new BsonDocument(nameof(RequestLog.CreatedOn), new BsonDocument("$gte", date.Date)),
                new BsonDocument(nameof(RequestLog.CreatedOn), new BsonDocument("$lt", date.Date.AddDays(1)))
            });
            return MongoCollection.Find(filter).ToList();
        }
        
        public RequestLog Create(RequestLog log)
        {
            MongoCollection.InsertOne(log);
            HubContext.Clients.All.SendAsync("NewLog", log).GetAwaiter().GetResult();
            return log;
        }
    }
}
