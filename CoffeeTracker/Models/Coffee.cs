namespace CoffeeTracker.Api.Models;

public class Coffee
{
    public int Id { get; set; }

    public string Name { get; set; }

    public decimal Price { get; set; }

    public string Description { get; set; }

    public List<string> Ingredients { get; set; }

    public string ImageUrl { get; set; }
}
