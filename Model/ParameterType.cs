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

        public bool CheckValueType(string value)
        {
            switch (Name)
            {
                case nameof(String):
                    return true;
                case nameof(Boolean):
                    return bool.TryParse(value, out bool _);
                case "Integer":
                    return int.TryParse(value, out int _);
                case nameof(DateTime):
                    return DateTime.TryParse(value, out DateTime _);
                default:
                    return false;
            }
        }

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
