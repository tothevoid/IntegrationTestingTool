using IntegrationTestingTool.Model.Entities;

namespace IntegrationTestingTool.Domain.Interfaces
{
    public interface IUnitOfWork
    {
        IRepository<TEntity> CreateRepository<TEntity>(string alias = null) where TEntity : BaseEntity;

        IFileRepository CreateFileRepository();
    }
}
