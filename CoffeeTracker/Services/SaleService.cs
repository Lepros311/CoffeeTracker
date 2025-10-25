using CoffeeTracker.Api.Models;
using CoffeeTracker.Api.Repositories;
using CoffeeTracker.Api.Responses;
using Humanizer;
using System.Globalization;

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
            CoffeeName = s.CoffeeName,
            CoffeeId = s.CoffeeId,
            Total = s.Total
        }).ToList();

        return responseWithDataDto;
    }

    public async Task<BaseResponse<Sale>> GetSaleById(int id)
    {
        return await _saleRepository.GetSaleById(id);
    }

    public async Task<BaseResponse<SaleDto>> CreateSale(CreateSaleDto writeSaleDto)
    {
        var saleResponse = new BaseResponse<Sale>();
        var saleResponseWithDataDto = new BaseResponse<SaleDto>();

        var coffeeResponse = await _coffeeRepository.GetCoffeeById(writeSaleDto.CoffeeId);

        if (coffeeResponse.Status == ResponseStatus.Fail)
        {
            saleResponseWithDataDto.Status = ResponseStatus.Fail;
            saleResponseWithDataDto.Message = coffeeResponse.Message;
            return saleResponseWithDataDto;
        }

        DateTime dateAndTimeOfSale = writeSaleDto.DateAndTimeOfSale ?? DateTime.UtcNow;

        //DateTime dateAndTimeOfSale;

        //if (!string.IsNullOrWhiteSpace(writeSaleDto.DateAndTimeOfSale))
        //{
        //    var formats = new[] { "MM-dd-yyyy h:mm tt", "M-d-yyyy h:mm tt" };
        //    if (!DateTime.TryParseExact(writeSaleDto.DateAndTimeOfSale, formats, CultureInfo.InvariantCulture, DateTimeStyles.None, out dateAndTimeOfSale))
        //    {
        //        saleResponseWithDataDto.Status = ResponseStatus.Fail;
        //        saleResponseWithDataDto.Message = "Invalid date format. Use MM-dd-yyyy h:mm tt (e.g., 11-04-2025 10:45 pm).";
        //        return saleResponseWithDataDto;
        //    }
        //}
        //else
        //{
        //    dateAndTimeOfSale = DateTime.UtcNow;
        //}


        var newSale = new Sale
        {
            CoffeeId = coffeeResponse.Data.Id,
            DateAndTimeOfSale = dateAndTimeOfSale,
            Total = coffeeResponse.Data.Price
        };

        if (newSale.Total < 0)
        {
            saleResponseWithDataDto.Status = ResponseStatus.Fail;
            saleResponseWithDataDto.Message = "Sale total must be greater than 0.";
            return saleResponseWithDataDto;
        }

        newSale.Coffee = coffeeResponse.Data;
        newSale.CoffeeName = coffeeResponse.Data.Name;

        saleResponse = await _saleRepository.CreateSale(newSale);

        if (saleResponse.Status == ResponseStatus.Fail)
        {
            saleResponseWithDataDto.Status = ResponseStatus.Fail;
            saleResponseWithDataDto.Message = saleResponse.Message;
            return saleResponseWithDataDto;
        }
        else
        {
            saleResponseWithDataDto.Status = ResponseStatus.Success;

            var newSaleDto = new SaleDto
            {
                Id = newSale.Id,
                DateAndTimeOfSale = newSale.DateAndTimeOfSale,
                CoffeeName = newSale.Coffee.Name,
                CoffeeId = newSale.Coffee.Id,
                Total = newSale.Total,
            };

            saleResponseWithDataDto.Data = newSaleDto;
        }

        return saleResponseWithDataDto;
    }

    public async Task<BaseResponse<Sale>> UpdateSale(int id, UpdateSaleDto updateSaleDto)
    {
        var saleResponse = new BaseResponse<Sale>();

        saleResponse = await GetSaleById(id);

        if (saleResponse.Status == ResponseStatus.Fail)
        {
            return saleResponse;
        }

        var existingSale = saleResponse.Data;

        DateTime dateAndTimeOfSale = existingSale.DateAndTimeOfSale;

        //if (!string.IsNullOrWhiteSpace(updateSaleDto.DateAndTimeOfSale))
        //{
        //    var formats = new[] { "MM-dd-yyyy h:mm tt", "M-d-yyyy h:mm tt" };
        //    if (!DateTime.TryParseExact(updateSaleDto.DateAndTimeOfSale, formats, CultureInfo.InvariantCulture, DateTimeStyles.None, out dateAndTimeOfSale))
        //    {
        //        saleResponse.Status = ResponseStatus.Fail;
        //        saleResponse.Message = "Invalid date format. Use MM-dd-yyyy h:mm tt (e.g., 11-04-2025 10:45 pm).";
        //        return saleResponse;
        //    }
        //}
        //else
        //{
        //    dateAndTimeOfSale = existingSale.DateAndTimeOfSale;
        //}

        existingSale.DateAndTimeOfSale = dateAndTimeOfSale;

        if (updateSaleDto.CoffeeId != null)
        {
            var coffeeResponse = await _coffeeRepository.GetCoffeeById(updateSaleDto.CoffeeId.Value);

            if (coffeeResponse.Status == ResponseStatus.Fail)
            {
                saleResponse.Status = ResponseStatus.Fail;
                saleResponse.Message = coffeeResponse.Message;
                return saleResponse;
            }

            existingSale.CoffeeId = coffeeResponse.Data.Id;
            existingSale.CoffeeName = coffeeResponse.Data.Name;
            existingSale.Total = coffeeResponse.Data.Price;
        }

        saleResponse = await _saleRepository.UpdateSale(existingSale);

        return saleResponse;
    }

    public async Task<BaseResponse<Sale>> DeleteSale(int id)
    {
        var response = new BaseResponse<Sale>();

        response = await _saleRepository.GetSaleById(id);

        if (response.Status == ResponseStatus.Fail)
        {
            return response;
        }

        return await _saleRepository.DeleteSale(id);
    }
}
