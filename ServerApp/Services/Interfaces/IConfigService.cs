using IntegrationTestingTool.Model;
using System.Threading.Tasks;

namespace IntegrationTestingTool.Services.Interfaces
{
    public interface IConfigService
    {
        public ServerConfig GetServerConfig();
    }
}
