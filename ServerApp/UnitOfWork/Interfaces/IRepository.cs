using MongoDB.Driver;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace IntegrationTestingTool.UnitOfWork.Interfaces
{
    public interface IRepository<TEntity>
        where TEntity: class
    {
        Task<IEnumerable<TEntity>> GetAll(FieldDefinition<TEntity> orderBy = null);

        Task<TEntity> GetById(Guid id);

        Task Insert(TEntity entity);

        Task<DeleteResult> Delete(Guid id);

        Task<ReplaceOneResult> Update(TEntity entity);
    }
}
