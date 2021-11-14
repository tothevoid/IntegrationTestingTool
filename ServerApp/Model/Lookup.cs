namespace IntegrationTestingTool.Model
{
    public class Option<TKey, TValue>
    {
        public Option(TKey key, TValue value)
        {
            Key = key;
            Value = value;
        }

        public TKey Key { get; set; }
        
        public TValue Value { get; set; }
    }
}