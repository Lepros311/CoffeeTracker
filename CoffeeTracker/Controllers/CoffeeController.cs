using CoffeeTracker.Api.Models;
using CoffeeTracker.Api.Responses;
using CoffeeTracker.Api.Services;
using Microsoft.AspNetCore.Mvc;

namespace CoffeeTracker.Api.Controllers
{
    [Route("api/coffees")]
    [ApiController]
    public class CoffeeController : ControllerBase
    {
        private readonly ICoffeeService _coffeeService;

        public CoffeeController(ICoffeeService coffeeService)
        {
            _coffeeService = coffeeService;
        }

        [HttpGet]
        public async Task<ActionResult<List<CoffeeDto>>> GetPagedCoffees([FromQuery] PaginationParams paginationParams)
        {
            var responseWithDtos = await _coffeeService.GetPagedCoffees(paginationParams);

            if (responseWithDtos.Status == ResponseStatus.Fail)
            {
                return BadRequest(responseWithDtos.Message);
            }

            return Ok(responseWithDtos.Data);
        }
    }

}