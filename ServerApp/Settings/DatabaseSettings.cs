namespace IntegrationTestingTool.Settings
{
    public class DatabaseSettings : IDatabaseSettings
    {
        public string DatabaseName { get; set; }

        public string Host { get; set; }

        public string Port { get; set; }

        public string ConnectionString =>
            $@"mongodb://{Host}:{Port}";
    }
}
