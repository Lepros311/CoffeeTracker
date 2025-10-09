using CoffeeTracker.Api.Models;
using CoffeeTracker.Api.Repositories;
using CoffeeTracker.Api.Responses;

namespace CoffeeTracker.Api.Services;

public class SaleService : ISaleService
{
    private readonly ISaleRepository _saleRepository;

    private readonly ICoffeeRepository _coffeeRepository;

    public SaleService(ICoffeeRepository coffeeRepository, ISaleRepository saleRepository)
    {
        _coffeeRepository = coffeeRepository;
        _saleRepository = saleRepository;
    }

    public async Task<PagedResponse<List<SaleDto>>> GetPagedSales(PaginationParams paginationParams)
    {
        var response = new PagedResponse<List<Sale>>(data: new List<Sale>(),
                                               pageNumber: paginationParams.Page,
                                               pageSize: paginationParams.PageSize,
                                               totalRecords: 0);
        var responseWithDataDto = new PagedResponse<List<SaleDto>>(data: new List<SaleDto>(),
                                               pageNumber: paginationParams.Page,
                                               pageSize: paginationParams.PageSize,
                                               totalRecords: 0);

        response = await _saleRepository.GetPagedSales(paginationParams);

        if (response.Status == ResponseStatus.Fail)
        {
            responseWithDataDto.Status = response.Status;
            responseWithDataDto.Message = response.Message;
            return responseWithDataDto;
        }

        responseWithDataDto.Data = response.Data.Select(s => new SaleDto
        {
            Id = s.Id,
            DateAndTimeOfSale = s.DateAndTimeOfSale,
            Total = s.Coffee.Price,
            CoffeeName = s.Coffee.Name
        }).ToList();

        return responseWithDataDto;
    }
}
