using IntegrationTestingTool.Model.Entities;
using IntegrationTestingTool.Services;
using IntegrationTestingTool.Services.Entity;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using ServerApp.Tests.DatabaseMock;
using System.Linq;
using System.Threading.Tasks;

namespace ServerApp.Tests
{
    [TestClass]
    public class AuthServiceTest
    {
        private AuthService AuthService { get; }

        public AuthServiceTest()
        {
            var uow = new MockUnitOfWork();
            var fileService = new FileService(uow);
            var endpointService = new EndpointService(uow, fileService);
            AuthService = new AuthService(uow, endpointService);
        }

        [TestMethod]
        public async Task GetAllTest()
        {
            await Task.WhenAll(AuthService.Create(EntityFactory.GetAuth()),
                AuthService.Create(EntityFactory.GetAuth()));

            var storedElements = await AuthService.GetAll();
            Assert.IsNotNull(storedElements);
            Assert.AreEqual(2, storedElements.Count());
        }

        [TestMethod]
        public async Task GetByIdTest()
        {
            var auth = EntityFactory.GetAuth();
            await AuthService.Create(auth);
            var storedAuth = await AuthService.GetById(auth.Id);
            Assert.IsNotNull(auth);

            Assert.AreEqual(auth.Id, storedAuth.Id);
            Assert.AreEqual(auth.Name, storedAuth.Name);
            Assert.AreEqual(auth.Method, storedAuth.Method);
            Assert.AreEqual(auth.URL, storedAuth.URL);
            Assert.AreEqual(auth.Data, storedAuth.Data);
        }

        [TestMethod]
        public async Task UpdateTest()
        {
            var auth = EntityFactory.GetAuth();
            await AuthService.Create(auth);
            var updateAuth = (Auth) auth.Clone();
            updateAuth.Name = "Update test";
            updateAuth.Method = "DELETE";
            await AuthService.Update(updateAuth);
            var auths = await AuthService.GetAll();

            Assert.IsNotNull(auths);
            Assert.AreEqual(1, auths.Where(x => x.Id == auth.Id).Count());
            var storedUpdatedAuth = auths.First();
            Assert.AreEqual(updateAuth.Name, storedUpdatedAuth.Name);
            Assert.AreEqual(updateAuth.Method, storedUpdatedAuth.Method);
        }

        [TestMethod]
        public async Task CreateTest()
        {
            var auth = EntityFactory.GetAuth();
            var collectionBeforeInsert = await AuthService.GetAll();
            await AuthService.Create(auth);
            var collectionAfterInsert = await AuthService.GetAll();

            Assert.AreEqual(1, collectionAfterInsert.Count() - 
                collectionBeforeInsert.Count());
            var insertedElement = collectionAfterInsert.First();

            Assert.AreEqual(auth.Id, insertedElement.Id);
            Assert.AreEqual(auth.Name, insertedElement.Name);
            Assert.AreEqual(auth.Method, insertedElement.Method);
            Assert.AreEqual(auth.URL, insertedElement.URL);
            Assert.AreEqual(auth.Data, insertedElement.Data);
        }

        [TestMethod]
        public async Task DeleteTest()
        {
            var auth = EntityFactory.GetAuth();
            await AuthService.Create(auth);
            await AuthService.Delete(auth.Id);
            var storedAuth = await AuthService.GetById(auth.Id);
            Assert.IsNull(storedAuth);
        }

        [TestMethod]
        public async Task GetAllAsLookupTest()
        {
            var firstAuth = EntityFactory.GetAuth();
            firstAuth.Name = "First";
            await AuthService.Create(firstAuth);

            var secondAuth = EntityFactory.GetAuth();
            secondAuth.Name = "Second";
            await AuthService.Create(secondAuth);

            var storedElements = await AuthService.GetAllAsLookup();
            Assert.IsNotNull(storedElements);
            Assert.AreEqual(2, storedElements.Count());

            foreach (var element in new Auth[] { firstAuth, secondAuth })
            {
                var storedElement = storedElements.FirstOrDefault(storedElement => 
                    storedElement.Key == element.Id);
                Assert.IsNotNull(storedElement);
                Assert.AreEqual(storedElement.Value, element.Name);
            }
        }
    }
}
