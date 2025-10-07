using CoffeeTracker.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace CoffeeTracker.Api.Data;

public class CoffeeTrackerDbContext : DbContext
{
    public CoffeeTrackerDbContext(DbContextOptions options) : base(options) { }
   
    public DbSet<Coffee> Coffees { get; set; }

    public DbSet<Sale> Sales { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder) => optionsBuilder.UseSqlServer();

}


