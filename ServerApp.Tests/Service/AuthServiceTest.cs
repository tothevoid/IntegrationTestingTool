using IntegrationTestingTool.Model.Entities;
using IntegrationTestingTool.Services;
using IntegrationTestingTool.Services.Entity;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using ServerApp.Tests.DatabaseMock;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace ServerApp.Tests.Service
{
    [TestClass]
    internal class AuthServiceTest
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

        }

        [TestMethod]
        public async Task GetByIdTest()
        {

        }

        [TestMethod]
        public async Task UpdateTest()
        {

        }

        [TestMethod]
        public async Task CreateTest()
        {

        }


        [TestMethod]
        public async Task DeleteTest()
        {

        }

        [TestMethod]
        public async Task GetAllAsLookupTest()
        {

        }
    }
}
