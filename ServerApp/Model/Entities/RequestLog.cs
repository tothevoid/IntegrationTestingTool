namespace IntegrationTestingTool.Model.Entities
{
    public class RequestLog: BaseEntity
    {
        public bool IsError { get; set; } = false;

        public string Received { get; set; }

        public Endpoint Endpoint { get; set; }
    }
}
