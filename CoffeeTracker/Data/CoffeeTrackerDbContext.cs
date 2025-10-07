using CoffeeTracker.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace CoffeeTracker.Api.Data;

public class CoffeeTrackerDbContext : DbContext
{
    public CoffeeTrackerDbContext(DbContextOptions options) : base(options) { }
   
    public DbSet<Coffee> Coffees { get; set; }

    public DbSet<Sale> Sales { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Coffee>(entity =>
        {
            entity.ToTable("Coffees", t => t.HasCheckConstraint("CK_Coffees_Price", "Price > 0"));
            entity.Property(p => p.Name).IsRequired();
            entity.Property(p => p.Price).IsRequired().HasColumnType("decimal(18,2)");
            entity.Property(p => p.IsDeleted).IsRequired();
            entity.HasQueryFilter(p => !p.IsDeleted);
        });

        modelBuilder.Entity<Sale>(entity =>
        {
            entity.ToTable("Sales");
            entity.Property(s => s.DateAndTimeOfSale).IsRequired();
            entity.Property(s => s.Total).IsRequired().HasColumnType("decimal(18,2)");
            entity.HasOne(s => s.Coffee).WithMany(c => c.Sales).HasForeignKey(s => s.CoffeeId).IsRequired();
            entity.HasQueryFilter(s => !s.IsDeleted);
        });
    }
}


