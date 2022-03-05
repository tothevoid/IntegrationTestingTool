using IntegrationTestingTool.Model.Entities;
using IntegrationTestingTool.Services.Interfaces;
using MongoDB.Driver;
using System;
using System.Collections.Generic;
using System.Linq;
using IntegrationTestingTool.Model;
using System.Threading.Tasks;
using IntegrationTestingTool.UnitOfWork.Interfaces;

namespace IntegrationTestingTool.Services.Entity
{
    public class AuthService : IAuthService
    {
        private IRepository<Auth> AuthRepository { get; }
        private IEndpointService EndpointService { get; }

        public AuthService(IUnitOfWork unitOfWorkService, IEndpointService endpointService)
        {
            AuthRepository = unitOfWorkService.CreateRepository<Auth>("Auths");
            EndpointService = endpointService;
        }

        public async Task<Auth> Create(Auth auth)
        {
            await AuthRepository.Insert(auth);
            return auth;
        }

        public async Task<string> Delete(Guid id)
        {
            var linkedEndpoints = await EndpointService.FindLinkedByAuth(id);
            IEnumerable<Endpoint> endpoints = linkedEndpoints.ToArray();
            if (endpoints.Any())
                return
                    $"There are some endpoints which use that auth:\n{string.Join("\n", endpoints.Select(x => x.Path))}";
            var result = await AuthRepository.Delete(id);
            //TODO: remove that auth from all endpoints
            return string.Empty;
        }

        public async Task<Auth> GetById(Guid id) =>
            await AuthRepository.GetById(id);
        
        public async Task<Auth> Update(Auth auth)
        {
            var result = await AuthRepository.Update(auth);
            return result.ModifiedCount != 0 ?
                auth :
                null;
        }

        public async Task<IEnumerable<Auth>> GetAll() =>
            (await AuthRepository.GetAll()).ToList();
        
        public async Task<IEnumerable<Option<Guid, string>>> GetAllAsLookup()
        {
            var projection = Builders<Auth>.Projection
                .Include(auth => auth.Name);

            return (await AuthRepository.GetAll(projection: projection))
                .Select(option => new Option<Guid, string>(option.Id, option.Name));
        } 
    }
}
