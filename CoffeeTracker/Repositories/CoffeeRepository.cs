using CoffeeTracker.Api.Models;
using CoffeeTracker.Api.Data;
using Microsoft.EntityFrameworkCore;
using CoffeeTracker.Api.Responses;

namespace CoffeeTracker.Api.Repositories;

public class CoffeeRepository : ICoffeeRepository
{
    private readonly CoffeeTrackerDbContext _dbContext;

    public CoffeeRepository(CoffeeTrackerDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<PagedResponse<List<Coffee>>> GetPagedCoffees(PaginationParams paginationParams)
    {
        var response = new PagedResponse<List<Coffee>>(data: new List<Coffee>(),
                                                       pageNumber: paginationParams.Page,
                                                       pageSize: paginationParams.PageSize,
                                                       totalRecords: 0);

        try
        {
            var query = _dbContext.Coffees.AsQueryable();

            if (!string.IsNullOrEmpty(paginationParams.Name))
                query = query.Where(p => p.Name.Contains(paginationParams.Name));
            if (paginationParams.MinPrice.HasValue)
                query = query.Where(p => p.Price >= paginationParams.MinPrice.Value);
            if (paginationParams.MaxPrice.HasValue)
                query = query.Where(p => p.Price <= paginationParams.MaxPrice.Value);

            var sortBy = paginationParams.SortBy?.Trim().ToLower() ?? "id";
            var sortAscending = paginationParams.SortAscending;

            bool useAscending = sortAscending ?? (sortBy == "id" ? false : true);

            query = sortBy switch
            {
                "name" => useAscending ? query.OrderBy(c => c.Name) : query.OrderByDescending(c => c.Name),
                "price" => useAscending ? query.OrderBy(c => c.Price) : query.OrderByDescending(c => c.Price),
                _ => useAscending ? query.OrderBy(c => c.Id) : query.OrderByDescending(c => c.Id)
            };

            var pagedCoffees = await query.Skip((paginationParams.Page - 1) * paginationParams.PageSize)
                .Take(paginationParams.PageSize)
                .ToListAsync();

            response.Status = ResponseStatus.Success;
            response.Data = pagedCoffees;
        }
        catch (Exception ex)
        {
            response.Message = $"Error in CoffeeRepository {nameof(GetPagedCoffees)}: {ex.Message}";
            response.Status = ResponseStatus.Fail;
        }

        return response;
    }
}
