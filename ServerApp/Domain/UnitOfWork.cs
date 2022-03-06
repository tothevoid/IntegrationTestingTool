using IntegrationTestingTool.Domain.Interfaces;
using IntegrationTestingTool.Model.Entities;
using System.Collections.Generic;

namespace IntegrationTestingTool.Domain
{
    public class UnitOfWork: IUnitOfWork
    {
        private IDatabaseContext Context { get; }

        private Dictionary<string, object> Repositories { get; } = new Dictionary<string, object>();

        private IFileRepository FileRepository { get; set; }

        public UnitOfWork(IDatabaseContext context)
        {
            Context = context;
        }

        public IFileRepository CreateFileRepository()
        {
            if (FileRepository == null)
            {
                FileRepository = new FileRepository(Context);
            }
            return FileRepository;
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