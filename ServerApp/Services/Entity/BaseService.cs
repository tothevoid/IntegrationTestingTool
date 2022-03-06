using IntegrationTestingTool.Model.Entities;
using MongoDB.Driver;
using System;
using System.Linq;
using System.Collections.Generic;
using System.Threading.Tasks;
using IntegrationTestingTool.Domain.Interfaces;

namespace IntegrationTestingTool.Services.Entity
{
    public abstract class BaseService<TEntity>
        where TEntity: BaseEntity
    {
        protected IRepository<TEntity> EntityRepository { get; }

        public BaseService(IUnitOfWork unitOfWorkService, string collectionName)
        {
            EntityRepository = unitOfWorkService.CreateRepository<TEntity>(collectionName);
        }

        public async Task<IEnumerable<TEntity>> GetAll() =>
            (await EntityRepository.GetAll()).ToList();

        public async Task<TEntity> GetOne(Guid id) =>
            await EntityRepository.GetById(id);

        public async Task<TEntity> Add(TEntity entity)
        {
            await EntityRepository.Insert(entity);
            return entity;
        }

        public async Task<bool> Delete(Guid id)
        {
            DeleteResult deletionResult = await EntityRepository.Delete(id);
            return deletionResult.DeletedCount != 0;
        }
    }
}
