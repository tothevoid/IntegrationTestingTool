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
using System.Threading.Tasks;

namespace IntegrationTestingTool.Services
{
    public class LoggingService: ILoggingService
    {
        private readonly IMongoCollection<RequestLog> _collection;
        protected readonly IHubContext<LogsHub> _hubContext;

        public LoggingService(IMongoSettings settings, IHubContext<LogsHub> hubContext)
        {
            var client = new MongoClient(settings.ConnectionString);
            _collection = client.GetDatabase(settings.DatabaseName).GetCollection<RequestLog>("RequestLogs");
            _hubContext = hubContext;
        }

        public IEnumerable<RequestLog> GetAll() =>
            _collection.Find(new BsonDocument()).ToList();

        public RequestLog Create(RequestLog log)
        {
            _collection.InsertOne(log);
            _hubContext.Clients.All.SendAsync("NewLog", log).GetAwaiter().GetResult();
            return log;
        }
    }
}
