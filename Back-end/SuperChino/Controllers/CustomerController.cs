using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using SuperChino.Models.Customer.Dto;
using SuperChino.Services;

namespace SuperChino.Controllers
{
    [Route("api/customers")]
    [ApiController]
    public class CustomerController : ControllerBase
    {
        private readonly CustomerServices _services;
        public CustomerController(CustomerServices services)
        {
            _services = services;
        }

        [HttpGet]
        async public Task<ActionResult<IEnumerable<CustomerDTO>>> GetAll()
        {
            var customers = await _services.GetAll();
            return Ok(customers);
        }

        [HttpGet("{id}")]
        async public Task<ActionResult<CustomerDTO>> GetById(int id)
        {
            var customerDto = await _services.GetById(id);
            return customerDto != null ? Ok(customerDto) : NotFound();
        }

        [HttpPost]
        async public Task<ActionResult<CustomerDTO>> CreateOne([FromBody] CustomerInsertDTO customerInsertDTO)
        {
            var customerDto = await _services.CreateOne(customerInsertDTO);
            return CreatedAtAction(nameof(GetById), new { id = customerDto.Id }, customerDto);
        }

        [HttpPut("{id}")]
        async public Task<ActionResult<CustomerDTO>> UpdateOne(int id, [FromBody] CustomerUpdateDTO customerUpdateDTO)
        {
            var customerDto = await _services.UpdateOne(id, customerUpdateDTO);
            return customerDto != null ? Ok(customerDto) : NotFound();
        }

        [HttpDelete("{id}")]
        async public Task<ActionResult<CustomerDTO>> DeleteOne(int id)
        {
            var customerDto = await _services.DeleteOne(id);
            return customerDto != null ? Ok(customerDto) : NotFound();
        }
    }
}
