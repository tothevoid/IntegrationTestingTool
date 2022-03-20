using IntegrationTestingTool.Settings.Interfaces;

namespace IntegrationTestingTool.Settings
{
    public class DatabaseSettings : IDatabaseSettings
    {
        public DatabaseSettings() {}

        public DatabaseSettings(string dbName, string host, string port)
        {
            DatabaseName = dbName;
            Host = host;
            Port = port;
        }

        public DatabaseSettings(string dbName, string host, string port, string login, string password)
            :this(dbName, host, port)
        {
            Login = login;
            Password = password;
        }

        public string DatabaseName { get; set; }

        public string Host { get; set; }

        public string Port { get; set; }

        public string Login { get; set; }

        public string Password { get; set; }

        public string ConnectionString =>
           HasAuth ?
                $@"mongodb://{Login}:{Password}@{Host}:{Port}" :
                $@"mongodb://{Host}:{Port}";

        private bool HasAuth =>
             !string.IsNullOrEmpty(Login) && !string.IsNullOrEmpty(Password);
    }
}
