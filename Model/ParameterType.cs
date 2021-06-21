using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace IntegrationTestingTool.Model
{
    public class ParameterType
    {
        public string Id { get; set; }
        public string Name { get; set; }

        public TypeCode GetTypeCode()
        {
            switch (Name)
            {
                case nameof(String):
                    return TypeCode.String;
                case nameof(Boolean):
                    return TypeCode.Boolean;
                case "Integer":
                    return TypeCode.Int32;
                case nameof(DateTime):
                    return TypeCode.DateTime;
                default:
                    return TypeCode.Object;
            }
        }
    }
}
