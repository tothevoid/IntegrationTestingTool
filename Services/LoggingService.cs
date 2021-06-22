using IntegrationTestingTool.Model;
using IntegrationTestingTool.Services.Interfaces;
using IntegrationTestingTool.Settings;
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

        public LoggingService(IMongoSettings settings)
        {
            var client = new MongoClient(settings.ConnectionString);
            _collection = client.GetDatabase(settings.DatabaseName).GetCollection<RequestLog>("RequestLogs");
        }

        public IEnumerable<RequestLog> GetAll() =>
            _collection.Find(new BsonDocument()).ToList();

        public RequestLog Create(RequestLog log)
        {
            _collection.InsertOne(log);
            return log;
        }
    }
}
