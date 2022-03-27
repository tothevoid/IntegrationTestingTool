using IntegrationTestingTool.Domain;
using IntegrationTestingTool.Domain.Interfaces;
using IntegrationTestingTool.Model.Entities;
using IntegrationTestingTool.Settings;

namespace ServerApp.Tests.DatabaseMock
{
    internal class MockUnitOfWork : IUnitOfWork
    {
        public IFileRepository CreateFileRepository()
            => new FileRepository(GetContext());

        public IRepository<TEntity> CreateRepository<TEntity>(string? alias = null) 
            where TEntity : BaseEntity
            => new Repository<TEntity>(GetContext());
        
        private DatabaseContext GetContext()
        {
            var settings = new DatabaseSettings("tests", "localhost", "27017");
            return new MockContext(settings);
        }
    }
}
