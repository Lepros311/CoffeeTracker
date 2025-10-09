using System.Text.Json.Serialization;

namespace CoffeeTracker.Api.Models;

public class CoffeeDto
{
    [JsonPropertyName("title")]
    public string Name { get; set; }
}
