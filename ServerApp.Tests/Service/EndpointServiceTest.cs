using IntegrationTestingTool.Model.Entities;
using IntegrationTestingTool.Services;
using IntegrationTestingTool.Services.Entity;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using ServerApp.Tests.DatabaseMock;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace ServerApp.Tests
{
    [TestClass]
    public class EndpointServiceTest
    {
        private EndpointService EndpointService { get; }

        public EndpointServiceTest()
        {
            var uow = new MockUnitOfWork();
            var fileService = new FileService(uow);
            EndpointService = new EndpointService(uow, fileService);
        }

        [TestMethod]
        public async Task GetAllTest()
        {

        }

        [TestMethod]
        public async Task GetAllByFiltersTest()
        {

        }

        [TestMethod]
        public async Task CreateTest()
        {
        
        }

        [TestMethod]
        public async Task CopyTest()
        {
            
        }

        [TestMethod]
        public async Task DeleteTest()
        {
            
        }

        [TestMethod]
        public async Task FindByPathAndMethodTest()
        {
        
        }

        [TestMethod]
        public async Task FindByIdTest()
        {
           
        }

        [TestMethod]
        public async Task FindByParameterTest()
        {
          
        }

        [TestMethod]
        public async Task FindLinkedByAuthTest()
        {
            
        }
        
        [TestMethod]
        public async Task Update()
        {
           
        }

        [TestMethod]
        public void GetStatusCodes()
        {

        }

        [TestMethod]
        public async Task SwitchActivity()
        {
      
        }
    }
}
