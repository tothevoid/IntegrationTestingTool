using IntegrationTestingTool.Domain.Interfaces;
using IntegrationTestingTool.Model.Entities;
using System;

namespace ServerApp.Tests.DatabaseMock
{
    internal class InMemoryUnitOfWork : IUnitOfWork
    {
        public IFileRepository CreateFileRepository()
        {
            throw new NotImplementedException();
        }

        public IRepository<TEntity> CreateRepository<TEntity>(string? alias = null) where TEntity : BaseEntity
        {
            throw new NotImplementedException();
        }
    }
}
