namespace CoffeeTracker.Api.Data;

public interface ICoffeeApi
{
    Task<IEnumerable<string>> GetCoffeeNamesAsync();
}
