namespace CoffeeTracker.Api.Models;

public class Sale
{
    public int Id { get; set; }

    public DateTime DateAndTimeOfSale { get; set; }

    public decimal Total { get; set; }

    public Coffee Coffee { get; set; }

    public bool IsDeleted { get; set; }
}
