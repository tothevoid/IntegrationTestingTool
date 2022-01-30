using IntegrationTestingTool.Model.Entities;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace IntegrationTestingTool.Services.Interfaces
{
    public interface IGroupService
    {
        Task<Group> GetOne(Guid id);

        Task<IEnumerable<Group>> GetAll();

        Task<Group> Add(Group group);

        Task<bool> Rename(Guid id, string newName);

        Task<bool> Delete(Guid id);
    }
}
