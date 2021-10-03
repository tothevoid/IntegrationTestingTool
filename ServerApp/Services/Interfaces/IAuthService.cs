using IntegrationTestingTool.Model;
using System;
using System.Collections.Generic;

namespace IntegrationTestingTool.Services.Interfaces
{
    public interface IAuthService
    {
        IEnumerable<Auth> GetAll();

        Auth Create(Auth endpoint);

        bool Delete(Guid id);
    }
}
