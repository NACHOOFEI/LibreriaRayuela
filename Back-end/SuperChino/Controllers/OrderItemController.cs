using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using SuperChino.Models.OrderItem.Dto;
using SuperChino.Services;

namespace SuperChino.Controllers
{
    [Route("api/orderitems")]
    [ApiController]
    public class OrderItemController : ControllerBase
    {
        private readonly OrderItemServices _services;
        public OrderItemController(OrderItemServices services)
        {
            _services = services;
        }

        [HttpGet]
        async public Task<ActionResult<IEnumerable<OrderItemDTO>>> GetAll()
        {
            var orderItems = await _services.GetAll();
            return Ok(orderItems);
        }

        [HttpGet("{id}")]
        async public Task<ActionResult<OrderItemDTO>> GetById(int id)
        {
            var orderItemDto = await _services.GetById(id);
            return orderItemDto != null ? Ok(orderItemDto) : NotFound();
        }

        [HttpPost]
        async public Task<ActionResult<OrderItemDTO>> CreateOne([FromBody] OrderItemInsertDTO orderItemInsertDTO)
        {
            var orderItemDto = await _services.CreateOne(orderItemInsertDTO);
            return CreatedAtAction(nameof(GetById), new { id = orderItemDto.Id }, orderItemDto);
        }

        [HttpPut("{id}")]
        async public Task<ActionResult<OrderItemDTO>> UpdateOne(int id, [FromBody] OrderItemUpdateDTO orderItemUpdateDTO)
        {
            var orderItemDto = await _services.UpdateOne(id, orderItemUpdateDTO);
            return orderItemDto != null ? Ok(orderItemDto) : NotFound();
        }

        [HttpDelete("{id}")]
        async public Task<ActionResult<OrderItemDTO>> DeleteOne(int id)
        {
            var orderItemDto = await _services.DeleteOne(id);
            return orderItemDto != null ? Ok(orderItemDto) : NotFound();
        }
    }
}
