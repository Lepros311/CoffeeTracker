using CoffeeTracker.Api.Models;
using CoffeeTracker.Api.Responses;

namespace CoffeeTracker.Api.Services;

public interface ISaleService
{
    Task<PagedResponse<List<SaleDto>>> GetPagedSales(PaginationParams paginationParams);

    Task<BaseResponse<Sale>> GetSaleById(int id);

    Task<BaseResponse<SaleDto>> CreateSale(WriteSaleDto writeSaleDto);

    Task<BaseResponse<Sale>> UpdateSale(int id, WriteSaleDto writeSaleDto);

    Task<BaseResponse<Sale>> DeleteSale(int id);
}
