using IntegrationTestingTool.Model.Entities;
using IntegrationTestingTool.Services.Interfaces;
using IntegrationTestingTool.Settings.Interfaces;
using MongoDB.Driver;
using System;
using System.Threading.Tasks;

namespace IntegrationTestingTool.Services
{
    public class GroupService: BaseService<Group>, IGroupService
    {
        public GroupService(IDatabaseSettings settings) : base(settings, "Groups")
        {}

        public async Task<bool> Rename(Guid id, string newName)
        {
            var filter = Builders<Group>.Filter.Eq(nameof(Group.Id), id);
            var update = Builders<Group>.Update.Set(x => x.Name, newName);
            var updateResult = await MongoCollection.UpdateOneAsync(filter, update);
            return updateResult.ModifiedCount != 0;
        }
    }
}
