using IntegrationTestingTool.Model.Entities;
using IntegrationTestingTool.Services;
using IntegrationTestingTool.Services.Entity;
using IntegrationTestingTool.Services.Interfaces;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using ServerApp.Tests.DatabaseMock;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ServerApp.Tests
{
    [TestClass]
    public class EndpointServiceTest
    {
        private IEndpointService EndpointService { get; }
        private IAuthService AuthService { get; }

        public EndpointServiceTest()
        {
            var uow = new MockUnitOfWork();
            var fileService = new FileService(uow);
            EndpointService = new EndpointService(uow, fileService);
            AuthService = new AuthService(uow, EndpointService);
        }

        [TestMethod]
        public async Task GetAllTest()
        {
            int quantity = 3;
            var endpoints = Enumerable.Range(0, quantity)
                .Select(endpoint => EntityFactory.GetEndpoint());
            await Task.WhenAll(endpoints.Select(endpoint => EndpointService.Create(endpoint)));

            var allEndpoints = await EndpointService.GetAll();

            Assert.IsNotNull(allEndpoints);
            Assert.AreEqual(quantity, allEndpoints.Count());
        }

        [TestMethod]
        public async Task GetAllByFiltersTest()
        {
            var firstEndpoint = EntityFactory.GetEndpoint();
            firstEndpoint.Path = "http://filter.com";
            var secondEndpoint = EntityFactory.GetEndpoint();
            var thirdEndpoint = EntityFactory.GetEndpoint();
            thirdEndpoint.Path = "http://filter.com";
            thirdEndpoint.Active = false;

            await Task.WhenAll(EndpointService.Create(firstEndpoint),
                EndpointService.Create(secondEndpoint),
                EndpointService.Create(thirdEndpoint));
            var all = await EndpointService.GetAllByFilters(secondEndpoint.Path, true);

            Assert.IsNotNull(all);
            Assert.AreEqual(1, all.Count());
            Assert.AreEqual(all.First().Id, secondEndpoint.Id);
        }

        [TestMethod]
        public async Task CreateTest()
        {
            var endpoint = EntityFactory.GetEndpoint();

            var insertedEndpoint = await EndpointService.Create(endpoint);
            var storedEndpoint = await EndpointService.FindById(insertedEndpoint.Id);

            Assert.IsNotNull(storedEndpoint);
            Assert.AreEqual(endpoint.Id, storedEndpoint.Id);
            Assert.AreEqual(endpoint.OutputData, storedEndpoint.OutputData);
            Assert.AreEqual(endpoint.CallbackData, storedEndpoint.CallbackData);
            Assert.AreEqual(endpoint.Path, storedEndpoint.Path);
            Assert.AreEqual(endpoint.Active, storedEndpoint.Active);
            Assert.AreEqual(endpoint.Method, storedEndpoint.Method);
            Assert.AreEqual(endpoint.CallbackUrl, storedEndpoint.CallbackUrl);
            Assert.AreEqual(endpoint.OutputStatusCode, storedEndpoint.OutputStatusCode);
        }

        [TestMethod]
        public async Task CopyTest()
        {
            var endpoint = EntityFactory.GetEndpoint();

            var insertedEndpoint = await EndpointService.Copy(endpoint);
            var storedEndpoint = await EndpointService.FindById(insertedEndpoint.Id);

            Assert.AreEqual(insertedEndpoint.Id, storedEndpoint.Id);
        }

        [TestMethod]
        public async Task DeleteTest()
        {
            var endpoint = EntityFactory.GetEndpoint();

            var insertedEndpoint = await EndpointService.Create(endpoint);
            var isDeleted = await EndpointService.Delete(insertedEndpoint.Id);
            var isDeletedAgain = await EndpointService.Delete(insertedEndpoint.Id);
            var storedEndpoint = await EndpointService.FindById(insertedEndpoint.Id);
            
            Assert.IsTrue(isDeleted);
            Assert.IsFalse(isDeletedAgain);
            Assert.IsNull(storedEndpoint);
        }

        [TestMethod]
        public async Task FindByPathAndMethodTest()
        {
            var firstEndpoint = EntityFactory.GetEndpoint();
            var secondEndpoint = EntityFactory.GetEndpoint();

            firstEndpoint.Method = "PUT";
            secondEndpoint.Method = "POST";

            await Task.WhenAll(EndpointService.Create(firstEndpoint),
                EndpointService.Create(secondEndpoint));

            var storedPutEndpoints = 
                await EndpointService.FindByPathAndMethod(firstEndpoint.Path, "PUT");
            var storedPostEndpoint =
                await EndpointService.FindByPathAndMethod(secondEndpoint.Path, "POST");

            Assert.IsNotNull(storedPutEndpoints);
            Assert.IsNotNull(storedPostEndpoint);
            Assert.AreEqual(1, storedPutEndpoints.Count());
            Assert.AreEqual(1, storedPostEndpoint.Count());
            Assert.AreEqual(firstEndpoint.Id, storedPutEndpoints.First().Id);
            Assert.AreEqual(secondEndpoint.Id, storedPostEndpoint.First().Id);
        }

        [TestMethod]
        public async Task FindByIdTest()
        {
            var endpoint = EntityFactory.GetEndpoint();

            var insertedEndpoint = await EndpointService.Create(endpoint);
            var storedEndpoint = await EndpointService.FindById(insertedEndpoint.Id);

            Assert.IsNotNull(storedEndpoint);
            Assert.AreEqual(endpoint.Id, storedEndpoint.Id);
            Assert.AreEqual(endpoint.OutputData, storedEndpoint.OutputData);
            Assert.AreEqual(endpoint.CallbackData, storedEndpoint.CallbackData);
            Assert.AreEqual(endpoint.Path, storedEndpoint.Path);
            Assert.AreEqual(endpoint.Active, storedEndpoint.Active);
            Assert.AreEqual(endpoint.Method, storedEndpoint.Method);
            Assert.AreEqual(endpoint.CallbackUrl, storedEndpoint.CallbackUrl);
            Assert.AreEqual(endpoint.OutputStatusCode, storedEndpoint.OutputStatusCode);
        }

        [TestMethod]
        public async Task FindByPathTest()
        {
            var firstEndpoint = EntityFactory.GetEndpoint();
            var secondEndpoint = EntityFactory.GetEndpoint();

            firstEndpoint.Path = "https://testpath.com";

            await Task.WhenAll(EndpointService.Create(firstEndpoint),
                EndpointService.Create(secondEndpoint));

            var endpointsByPath = await EndpointService.FindByPath(firstEndpoint.Path);

            Assert.IsNotNull(endpointsByPath);
            Assert.AreEqual(1, endpointsByPath.Count());
            Assert.AreEqual(firstEndpoint.Id, endpointsByPath.First().Id);
            Assert.AreEqual(firstEndpoint.Path, endpointsByPath.First().Path);
        }

        [TestMethod]
        public async Task FindLinkedByAuthTest()
        {
            (Auth, Endpoint) GenerateAuthAndEdnpoint() 
            {
                var auth = EntityFactory.GetAuth();
                var endpoint = EntityFactory.GetEndpoint();
                endpoint.Auth = auth;
                endpoint.AuthId = auth.Id;
                return (auth, endpoint);
            }

            var (firstAuth, firstEndpoint) = GenerateAuthAndEdnpoint();
            var (secondAuth, secondEndpoint) = GenerateAuthAndEdnpoint();
            var endpointWithoutAuth = EntityFactory.GetEndpoint();

            await Task.WhenAll(AuthService.Create(firstAuth),
                AuthService.Create(secondAuth),
                EndpointService.Create(firstEndpoint),
                EndpointService.Create(secondEndpoint),
                EndpointService.Create(endpointWithoutAuth));
            
            var linkedAuths = await Task.WhenAll(
                EndpointService.FindLinkedByAuth(firstAuth.Id),
                EndpointService.FindLinkedByAuth(secondAuth.Id));

            void AssertCollection(IEnumerable<Endpoint> collection, Guid authId)
            {
                Assert.IsNotNull(collection);
                Assert.AreEqual(1, collection.Count());
                Assert.AreEqual(collection.First().AuthId, authId);
            }

            Assert.AreEqual(2, linkedAuths.Length);
            AssertCollection(linkedAuths[0], firstAuth.Id);
            AssertCollection(linkedAuths[1], secondAuth.Id);
        }
        
        [TestMethod]
        public async Task UpdateTest()
        {
            var endpoint = EntityFactory.GetEndpoint();
            await EndpointService.Create(endpoint);
            var updatedEndpoint = (Endpoint) endpoint.Clone();
            updatedEndpoint.Path = "update test";
            updatedEndpoint.Method = "PUT";
            updatedEndpoint.CallbackUrl = "http://www.updatecallback.com";

            await EndpointService.Update(updatedEndpoint);
            var auths = await EndpointService.GetAll();
            var storedEndpoint = auths.First();

            Assert.IsNotNull(auths);
            Assert.AreEqual(1, auths.Where(x => x.Id == updatedEndpoint.Id).Count());
            Assert.AreEqual(updatedEndpoint.Path, storedEndpoint.Path);
            Assert.AreEqual(updatedEndpoint.Method, storedEndpoint.Method);
            Assert.AreEqual(updatedEndpoint.CallbackUrl, storedEndpoint.CallbackUrl);
        }

        [TestMethod]
        public void GetStatusCodesTest()
        {
            var codes = EndpointService.GetStatusCodes();
            Assert.IsNotNull(codes);
            Assert.AreNotEqual(0, codes.Count());
        }

        [TestMethod]
        public async Task SwitchActivityTest()
        {
            var endpoint = EntityFactory.GetEndpoint();
            endpoint.Active = false;
            await EndpointService.Create(endpoint);

            foreach (var state in new bool[] { true, false })
            {
                await EndpointService.SwitchActivity(endpoint.Id, state);
                var storedEndpoint = await EndpointService.FindById(endpoint.Id);
                Assert.AreEqual(state, storedEndpoint.Active);
            }
        }
    }
}
