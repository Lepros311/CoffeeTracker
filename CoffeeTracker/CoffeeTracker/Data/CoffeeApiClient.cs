using System.Text.Json;
using CoffeeTracker.Api.Models;

namespace CoffeeTracker.Api.Data;

public class CoffeeApiClient : ICoffeeApi
{
    private readonly HttpClient _http;

    public CoffeeApiClient(HttpClient http)
    {
        _http = http;
    }

    public async Task<List<string>> GetCoffeeNamesAsync()
    {
        var response = await _http.GetAsync("https://api.sampleapis.com/coffee/iced");
        response.EnsureSuccessStatusCode();

        var json = await response.Content.ReadAsStringAsync();
        var coffees = JsonSerializer.Deserialize<List<CoffeeDto>>(json);

        return coffees?.Select(c => c.Name?.Trim()).Where(name => !string.IsNullOrEmpty(name)).Distinct().ToList() ?? new List<string>();
    }
}
