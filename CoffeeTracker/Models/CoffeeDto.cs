using System.Text.Json.Serialization;

namespace CoffeeTracker.Api.Models;

public class CoffeeDto
{
    public int Id { get; set; }

    [JsonPropertyName("title")]
    public string Name { get; set; }

    public decimal Price { get; set; }
}
