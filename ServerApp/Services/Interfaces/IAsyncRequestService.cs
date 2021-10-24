using IntegrationTestingTool.Model.Entities;
using System.Threading.Tasks;

namespace IntegrationTestingTool.Services.Interfaces
{
    public interface IAsyncRequestService
    {
        public Task Call(Endpoint endpoint);
    }
}
