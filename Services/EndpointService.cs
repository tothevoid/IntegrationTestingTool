using IntegrationTestingTool.Model;
using IntegrationTestingTool.Services.Interfaces;
using IntegrationTestingTool.Settings;
using MongoDB.Bson;
using MongoDB.Driver;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.RegularExpressions;
using System.Threading.Tasks;

namespace IntegrationTestingTool.Services
{
    public class EndpointService: IEndpointService
    {
        private readonly IMongoCollection<Endpoint> _collection;

        public EndpointService(IMongoSettings settings)
        {
            var client = new MongoClient(settings.ConnectionString);
            _collection = client.GetDatabase(settings.DatabaseName).GetCollection<Endpoint>("Endpoints");
        }

        public IEnumerable<Endpoint> GetAll() =>
            _collection.Find(new BsonDocument()).ToList();

        public Endpoint Create(Endpoint endpoint)
        {
            endpoint.Id = Guid.NewGuid();
            endpoint.OutputData = Regex.Replace(endpoint.OutputData, @"\""", @"""");

            _collection.InsertOne(endpoint);
            return endpoint;
        }

        public IEnumerable<Endpoint> FindByParameter(string parameterName, string value) =>
            _collection.Find(new BsonDocument(parameterName, value)).ToList();

        public string ValidateUrl(string path)
        {
            var isValid = Uri.TryCreate("https://localhost:44314/test/" + path, UriKind.Absolute, out Uri uri);
           
            if (string.IsNullOrEmpty(path.Trim()))
            {
                return "URL cant be empty";
            } 
            else if (FindByParameter(nameof(Endpoint.Path), path.Trim()).Any())
            {
                return "Same URL already exists";
            }
            //extract into constant
            else if (!isValid)
            {
                return "Incorrect format of URL";
            }
            return string.Empty;
        }

    }
}
