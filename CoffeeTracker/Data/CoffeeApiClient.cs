using System.Text.Json;

namespace CoffeeTracker.Api.Data;

public class CoffeeApiClient : ICoffeeApi
{
    private readonly HttpClient _http;

    public CoffeeApiClient(HttpClient http)
    {
        _http = http;
    }

    public async Task<IEnumerable<string>> GetCoffeeNamesAsync()
    {
        var response = await _http.GetAsync("https://api.sampleapis.com/coffee/iced");
        response.EnsureSuccessStatusCode();

        var json = await response.Content.ReadAsStringAsync();
        var names = JsonSerializer.Deserialize<List<string>>(json);

        return names ?? Enumerable.Empty<string>();
    }
}
