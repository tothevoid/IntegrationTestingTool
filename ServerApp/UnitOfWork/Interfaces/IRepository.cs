using MongoDB.Driver;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace IntegrationTestingTool.UnitOfWork.Interfaces
{
    public interface IRepository<TEntity>
        where TEntity: class
    {
        Task<IEnumerable<TEntity>> GetAll();

        Task<IEnumerable<TEntity>> GetAll(FilterDefinition<TEntity> filter = null,
            ProjectionDefinition<TEntity> projection = null,
            SortDefinition<TEntity> orderBy = null,
            int limit = 0);

        Task<TEntity> GetById(Guid id);

        Task Insert(TEntity entity);

        Task<DeleteResult> Delete(Guid id);

        Task<ReplaceOneResult> Update(TEntity entity);

        Task<UpdateResult> UpdateFields(FilterDefinition<TEntity> filter, UpdateDefinition<TEntity> update);

        Task<long> GetCount(FilterDefinition<TEntity> filter);
    }
}
