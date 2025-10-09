using CoffeeTracker.Api.Data;
using CoffeeTracker.Api.Models;
using CoffeeTracker.Api.Responses;
using Microsoft.EntityFrameworkCore;

namespace CoffeeTracker.Api.Repositories;

public class SaleRepository : ISaleRepository
{
    private readonly CoffeeTrackerDbContext _dbContext;

    public SaleRepository(CoffeeTrackerDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<PagedResponse<List<Sale>>> GetPagedSales(PaginationParams paginationParams)
    {
        var response = new PagedResponse<List<Sale>>(data: new List<Sale>(),
                                                       pageNumber: paginationParams.Page,
                                                       pageSize: paginationParams.PageSize,
                                                       totalRecords: 0);

        try
        {
            var query = _dbContext.Sales.Include(s => s.Coffee).AsQueryable();

            if (paginationParams.MinPrice.HasValue)
                query = query.Where(s => s.Total >= paginationParams.MinPrice.Value);
            if (paginationParams.MaxPrice.HasValue)
                query = query.Where(s => s.Total <= paginationParams.MaxPrice.Value);
            if (paginationParams.MinDateOfSale.HasValue)
                query = query.Where(s => s.DateAndTimeOfSale >= paginationParams.MinDateOfSale.Value);
            if (paginationParams.MaxDateOfSale.HasValue)
                query = query.Where(s => s.DateAndTimeOfSale <= paginationParams.MaxDateOfSale.Value);

            var sortBy = paginationParams.SortBy?.Trim().ToLower() ?? "saleid";
            var sortAscending = paginationParams.SortAscending;

            bool useAscending = sortAscending ?? (sortBy == "saleid" ? false : true);

            query = sortBy switch
            {
                "total" => useAscending ? query.OrderBy(s => s.Total) : query.OrderByDescending(s => s.Total),
                "dateOfSale" => useAscending ? query.OrderBy(s => s.DateAndTimeOfSale) : query.OrderByDescending(s => s.DateAndTimeOfSale),
                _ => useAscending ? query.OrderBy(s => s.Id) : query.OrderByDescending(s => s.Id)
            };

            var pagedSales = await query
                                    .Skip((paginationParams.Page - 1) * paginationParams.PageSize)
                                    .Take(paginationParams.PageSize)
                                    .ToListAsync();

            response.Status = ResponseStatus.Success;
            response.Data = pagedSales;
        }
        catch (Exception ex)
        {
            response.Message = $"Error in SaleRepository {nameof(GetPagedSales)}: {ex.Message}";
            response.Status = ResponseStatus.Fail;
        }

        return response;
    }
}
