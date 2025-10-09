using Microsoft.EntityFrameworkCore;
using CoffeeTracker.Api.Models;

namespace CoffeeTracker.Api.Data;

public class CoffeeSeeder
{
    public static async Task SeedNamesAsync(CoffeeTrackerDbContext db, ICoffeeApi apiClient)
    {
        try
        {
            var coffeeNames = (await apiClient.GetCoffeeNamesAsync()).ToList();

            Console.WriteLine($"Fetched {coffeeNames.Count} coffee names.");


            foreach (var name in coffeeNames)
            {
                var exists = await db.Coffees.AnyAsync(c => c.Name == name);
                if (!exists)
                {
                    db.Coffees.Add(new Coffee
                    {
                        Name = name,
                        Price = 1m,
                        IsDeleted = false
                    });
                }
            }

            await db.SaveChangesAsync();
        }
        catch (Exception ex)
        {
            Console.WriteLine($"SeedNamesAsync failed: {ex.Message}"); 
        }
    }

    public static async Task SeedPricesAsync(CoffeeTrackerDbContext db)
    {
        try
        {
            var coffeesWithoutPrice = await db.Coffees.Where(c => c.Price > 8 &&
            !c.IsDeleted).ToListAsync();

            var random = new Random();

            foreach (var coffee in coffeesWithoutPrice)
            {
                coffee.Price = Math.Round(random.Next(100, 801) / 100m, 2);
            }

            await db.SaveChangesAsync();
        }
        catch (Exception ex)
        {
            Console.WriteLine($"SeedPricesAsync failed: {ex.Message}");
        }
    }
}
