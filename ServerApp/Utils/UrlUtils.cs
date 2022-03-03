using System.Linq;

namespace IntegrationTestingTool.Utils
{
    public static class UrlUtils
    {
        private const string Separator = "";

        public static string TrimLastPart(string url)
        {
            if (string.IsNullOrEmpty(url))
            {
                return string.Empty;
            }

            var urlParts = url.Split(Separator).Where(part => part != string.Empty).Skip(1);
            return string.Join(Separator, urlParts);
        }
    }     
}