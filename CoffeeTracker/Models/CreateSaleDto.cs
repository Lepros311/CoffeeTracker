namespace CoffeeTracker.Api.Models;

public class CreateSaleDto
{
    public int CoffeeId { get; set; }

    public DateTime? DateAndTimeOfSale { get; set; }
}
