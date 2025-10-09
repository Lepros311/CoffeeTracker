using CoffeeTracker.Api.Models;
using CoffeeTracker.Api.Repositories;
using CoffeeTracker.Api.Responses;

namespace CoffeeTracker.Api.Services;

public class CoffeeService : ICoffeeService
{
    private readonly ISaleRepository _saleRepository;

    private readonly ICoffeeRepository _coffeeRepository;

    public CoffeeService(ICoffeeRepository coffeeRepository, ISaleRepository saleRepository)
    {
        _coffeeRepository = coffeeRepository;
        _saleRepository = saleRepository;
    }

    public async Task<PagedResponse<List<CoffeeDto>>> GetPagedCoffees(PaginationParams paginationParams)
    {
        var response = new PagedResponse<List<Coffee>>(data: new List<Coffee>(),
                                               pageNumber: paginationParams.Page,
                                               pageSize: paginationParams.PageSize,
                                               totalRecords: 0);
        var responseWithDataDto = new PagedResponse<List<CoffeeDto>>(data: new List<CoffeeDto>(),
                                               pageNumber: paginationParams.Page,
                                               pageSize: paginationParams.PageSize,
                                               totalRecords: 0);

        response = await _coffeeRepository.GetPagedCoffees(paginationParams);

        if (response.Status == ResponseStatus.Fail)
        {
            responseWithDataDto.Status = response.Status;
            responseWithDataDto.Message = response.Message;
            return responseWithDataDto;
        }

        responseWithDataDto.Data = response.Data.Select(c => new CoffeeDto
        {
            Id = c.Id,
            Name = c.Name,
            Price = c.Price,
        }).ToList();

        return responseWithDataDto;
    }
}
