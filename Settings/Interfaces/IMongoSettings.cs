using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace IntegrationTestingTool.Settings
{
    public interface IMongoSettings
    {
        string ConnectionString { get; set; }

        string DatabaseName { get; set; }
    }
}
