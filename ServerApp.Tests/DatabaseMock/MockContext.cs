using IntegrationTestingTool.Domain;
using IntegrationTestingTool.Domain.Interfaces;
using IntegrationTestingTool.Model.Entities;
using IntegrationTestingTool.Settings.Interfaces;
using MongoDB.Bson;
using MongoDB.Driver;
using MongoDB.Driver.GridFS;
using System;
using System.Collections.Generic;
using System.Text;

namespace ServerApp.Tests.DatabaseMock
{
    internal class MockContext : DatabaseContext
    {
        public MockContext(IDatabaseSettings databaseSettings)
            :base(databaseSettings)
        {
            var client = new MongoClient(databaseSettings.ConnectionString);
            client.DropDatabase(databaseSettings.DatabaseName);
        }
    }
}
