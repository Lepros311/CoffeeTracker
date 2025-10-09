namespace CoffeeTracker.Api.Models;

public class SaleDto
{
    public int Id { get; set; }

    public DateTime DateAndTimeOfSale { get; set; }

    public decimal Total { get; set; }

    public Coffee Coffee { get; set; }

    public string CoffeeName { get; set; }

    public int CoffeeId { get; set; }
}
