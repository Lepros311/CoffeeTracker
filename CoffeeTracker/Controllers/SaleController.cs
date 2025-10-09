using CoffeeTracker.Api.Models;
using CoffeeTracker.Api.Responses;
using CoffeeTracker.Api.Services;
using Microsoft.AspNetCore.Mvc;

namespace CoffeeTracker.Api.Controllers
{
    [Route("api/sales")]
    [ApiController]
    public class SaleController : ControllerBase
    {
        private readonly ISaleService _saleService;

        public SaleController(ISaleService saleService)
        {
            _saleService = saleService;
        }

        [HttpGet]
        public async Task<ActionResult<List<SaleDto>>> GetPagedSales([FromQuery] PaginationParams paginationParams)
        {
            var responseWithDtos = await _saleService.GetPagedSales(paginationParams);

            if (responseWithDtos.Status == ResponseStatus.Fail)
            {
                return BadRequest(responseWithDtos.Message);
            }

            return Ok(responseWithDtos.Data);
        }
    }

}