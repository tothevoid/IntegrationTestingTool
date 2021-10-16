using IntegrationTestingTool.Model.Entities;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace IntegrationTestingTool.Services.Interfaces
{
    public interface IAuthService
    {
        Task<IEnumerable<Auth>> GetAll();

        Task<Auth> GetById(Guid id);

        Task<Auth> Create(Auth endpoint);

        Task<string> Delete(Guid id);
    }
}
