namespace IntegrationTestingTool.Settings
{
    public interface IDatabaseSettings
    {
        public string DatabaseName { get; set; }

        public string Host { get; set; }

        public string Port { get; set; }

        public string Login { get; set; }

        public string Password { get; set; }

        public string ConnectionString { get; }
    }
}
