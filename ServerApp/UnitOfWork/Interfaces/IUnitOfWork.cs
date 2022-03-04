using IntegrationTestingTool.Model.Entities;

namespace IntegrationTestingTool.UnitOfWork.Interfaces
{
    public interface IUnitOfWork
    {
        IRepository<TEntity> CreateRepository<TEntity>() where TEntity : BaseEntity;
    }
}
