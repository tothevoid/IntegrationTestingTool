using IntegrationTestingTool.Domain.Interfaces;
using IntegrationTestingTool.Model.Entities;
using IntegrationTestingTool.Services.Interfaces;
using MongoDB.Driver;
using System;
using System.Threading.Tasks;

namespace IntegrationTestingTool.Services.Entity
{
    public class GroupService: BaseService<Group>, IGroupService
    {
        public GroupService(IUnitOfWork unitOfWorkService) : base(unitOfWorkService, "Groups")
        {}

        public async Task<bool> Rename(Guid id, string newName)
        {
            var filter = Builders<Group>.Filter.Eq(nameof(Group.Id), id);
            var update = Builders<Group>.Update.Set(x => x.Name, newName);
            var updateResult = await EntityRepository.UpdateFields(filter, update);
            return updateResult.ModifiedCount != 0;
        }
    }
}
