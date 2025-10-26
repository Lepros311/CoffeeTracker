namespace CoffeeTracker.Api.Data;

public interface ICoffeeApi
{
    Task<List<string>> GetCoffeeNamesAsync();
}
