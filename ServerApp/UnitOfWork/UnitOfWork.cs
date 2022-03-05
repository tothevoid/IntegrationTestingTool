﻿using IntegrationTestingTool.Model.Entities;
using IntegrationTestingTool.UnitOfWork.Interfaces;
using System.Collections.Generic;

namespace IntegrationTestingTool.UnitOfWork
{
    public class UnitOfWork: IUnitOfWork
    {
        private DatabaseContext Context { get; }

        private Dictionary<string, object> Repositories { get; } = new Dictionary<string, object>();

        public UnitOfWork(DatabaseContext context)
        {
            Context = context;
        }

        public IRepository<T> CreateRepository<T>(string alias) where T : BaseEntity
        {
            var type = typeof(T).Name;

            if (!Repositories.ContainsKey(type))
            {
                var repositoryInstance = new Repository<T>(Context);
                Repositories.Add(type, repositoryInstance);
            }
            return (Repository<T>)Repositories[type];
        }
    }
}