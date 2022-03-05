﻿using IntegrationTestingTool.Model.Entities;
using IntegrationTestingTool.Settings.Interfaces;
using MongoDB.Driver;

namespace IntegrationTestingTool.UnitOfWork
{
    public class DatabaseContext
    {
        private IDatabaseSettings Settings { get; }

        public DatabaseContext(IDatabaseSettings settings)
        {
            Settings = settings;
        }

        public IMongoCollection<TEntity> GetCollection<TEntity>(string alias = null)
            where TEntity : BaseEntity
        {
            var client = new MongoClient(Settings.ConnectionString);
            alias ??= typeof(TEntity).Name;

            return client.GetDatabase(Settings.DatabaseName).GetCollection<TEntity>(alias);
        }
    }
}