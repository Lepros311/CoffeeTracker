using CoffeeTracker.Api.Data;
using CoffeeTracker.Api.Repositories;
using CoffeeTracker.Api.Services;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddControllers();

builder.Services.AddDbContext<CoffeeTrackerDbContext>(opt => opt.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddScoped<ICoffeeRepository, CoffeeRepository>();
builder.Services.AddScoped<ISaleRepository, SaleRepository>();
builder.Services.AddScoped<ICoffeeService, CoffeeService>();
builder.Services.AddScoped<ISaleService, SaleService>();

builder.Services.AddHttpClient<ICoffeeApi, CoffeeApiClient>();

builder.Services.AddOpenApi();

var app = builder.Build();

using (var scope = app.Services.CreateScope())
{
    var dbContext = scope.ServiceProvider.GetRequiredService<CoffeeTrackerDbContext>();
    dbContext.Database.Migrate();

    var apiClient = scope.ServiceProvider.GetRequiredService<ICoffeeApi>();
    await CoffeeSeeder.SeedNamesAsync(dbContext, apiClient);
    await CoffeeSeeder.SeedPricesAsync(dbContext);
}

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.MapControllers();

app.Run();
