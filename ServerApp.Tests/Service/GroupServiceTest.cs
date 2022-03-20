using IntegrationTestingTool.Model.Entities;
using IntegrationTestingTool.Services.Entity;
using IntegrationTestingTool.Services.Interfaces;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using ServerApp.Tests.DatabaseMock;
using System.Linq;
using System.Threading.Tasks;

namespace ServerApp.Tests
{
    [TestClass]
    public class GroupServiceTest
    {
        private IGroupService GroupService { get; }

        public GroupServiceTest()
        {
            GroupService = new GroupService(new MockUnitOfWork());
        }

        [TestMethod]
        public async Task GetAllTest()
        {
            var groupsBefore = await GroupService.GetAll();

            var firstGroup = GetGroup();
            var secondGroup = GetGroup();
            var elements = new Task[] { GroupService.Add(firstGroup), GroupService.Add(secondGroup) };
            await Task.WhenAll(elements);

            var groupsAfter = await GroupService.GetAll();

            Assert.IsNotNull(groupsBefore);
            Assert.IsNotNull(groupsAfter);
            Assert.AreEqual(elements.Length, groupsAfter.Count() - groupsBefore.Count());
        }

        [TestMethod]
        public async Task AddTest()
        {
            var group = GetGroup();
            await GroupService.Add(group);
            var groupSearchResult = await GroupService.GetOne(group.Id);

            Assert.IsNotNull(groupSearchResult);
            Assert.AreEqual(group.Id, groupSearchResult.Id);
            Assert.AreEqual(group.Name, groupSearchResult.Name);
            Assert.AreEqual(group.CreatedOn, groupSearchResult.CreatedOn);
        }

        [TestMethod]
        public async Task DeleteTest()
        {
            var group = GetGroup();
            await GroupService.Add(group);
            var searchAfterAddResult = await GroupService.GetOne(group.Id);
            var deleteResult = await GroupService.Delete(group.Id);
            var searchAfterDeleteResult = await GroupService.GetOne(group.Id);

            Assert.IsNotNull(searchAfterAddResult);
            Assert.IsTrue(deleteResult);
            Assert.IsNull(searchAfterDeleteResult);
        }

        [TestMethod]
        public async Task RenameTest()
        {
            var group = GetGroup();
            await GroupService.Add(group);
            var addedGroup = await GroupService.GetOne(group.Id);
            var newName = "RenameTest";
            var renameResult = await GroupService.Rename(group.Id, newName);
            var updatedGroup = await GroupService.GetOne(group.Id);

            Assert.IsTrue(renameResult);
            Assert.AreEqual(newName, updatedGroup.Name);
            Assert.AreEqual(addedGroup.CreatedOn, updatedGroup.CreatedOn);
        }

        private Group GetGroup() =>
            new Group()
            {
                Name = "Test"
            };
    }
}