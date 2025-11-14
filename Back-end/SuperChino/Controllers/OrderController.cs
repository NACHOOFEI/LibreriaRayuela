using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using LibreriaOnline.Enums;
using LibreriaOnline.Models.Order.Dto;
using LibreriaOnline.Services;
using LibreriaOnline.Utils;

namespace LibreriaOnline.Controllers
{
    [Route("api/orders")]
    [ApiController]
    public class OrderController : ControllerBase
    {
        private readonly OrderServices _services;
        public OrderController(OrderServices services)
        {
            _services = services;
        }

        [HttpGet]
        [ProducesResponseType(typeof(IEnumerable<OrderDTO>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(HttpMessage), StatusCodes.Status500InternalServerError)]

        async public Task<ActionResult<IEnumerable<OrderDTO>>> GetAll()
        {
            try
            {
                var orders = await _services.GetAll();
                return Ok(orders);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new HttpMessage(ex.Message));
            }
        }

        [HttpGet("{id}")]
        [ProducesResponseType(typeof(IEnumerable<OrderDTO>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(HttpMessage), StatusCodes.Status404NotFound)]
        [ProducesResponseType(typeof(HttpMessage), StatusCodes.Status500InternalServerError)]
        async public Task<ActionResult<OrderDTO>> GetById(int id)
        {
            try
            {
                var orderDto = await _services.GetById(id);
                return Ok(orderDto);
            }
            catch (HttpResponseError ex)
            {
                return StatusCode(
                  (int)ex.StatusCode,
                    new HttpMessage(ex.Message)
);
            }
            catch (Exception ex)
            {
                return StatusCode(
                     StatusCodes.Status500InternalServerError,
                     new HttpMessage(ex.Message)
);
            }

        }

        [HttpGet("customer/{customerId}")]
        [Authorize]
        [ProducesResponseType(typeof(IEnumerable<OrderDTO>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(HttpMessage), StatusCodes.Status500InternalServerError)]
        async public Task<ActionResult<IEnumerable<OrderDTO>>> GetByCustomerId(int customerId)
        {
            try
            {
                var orders = await _services.GetByCustomerId(customerId);
                return Ok(orders);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new HttpMessage(ex.Message));
            }
        }

        [HttpPost]
        [ProducesResponseType(typeof(OrderDTO), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ValidationErrorResponse), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(void), StatusCodes.Status403Forbidden)]
        async public Task<ActionResult<OrderDTO>> CreateOne([FromBody] OrderInsertDTO orderInsertDTO)
        {
            try
            {
                var orderDto = await _services.CreateOne(orderInsertDTO);
                return CreatedAtAction(nameof(GetById), new { id = orderDto.Id }, orderDto);

            }
            catch (HttpResponseError ex)
            {
                return StatusCode(
                  (int)ex.StatusCode,
                   new HttpMessage(ex.Message)
                 );
            }
            catch (Exception ex)
            {
                return StatusCode(
                   StatusCodes.Status500InternalServerError,
                   new HttpMessage(ex.Message)
               );
            }
        }

        //[HttpPut("{id}")]
        //[Authorize(Roles = ROL.ADMIN)]
        //[ProducesResponseType(typeof(OrderDTO), StatusCodes.Status200OK)]
        //[ProducesResponseType(typeof(ValidationErrorResponse), StatusCodes.Status400BadRequest)]
        //[ProducesResponseType(typeof(void), StatusCodes.Status403Forbidden)]
        //async public Task<ActionResult<OrderDTO>> UpdateOne(int id, [FromBody] OrderUpdateDTO orderUpdateDTO)
        //{
        //    try
        //    {
        //        var orderDto = await _services.UpdateOne(id, orderUpdateDTO);
        //        return Ok(orderDto);


        //    }
        //    catch (HttpResponseError ex)
        //    {
        //        return StatusCode(
        //          (int)ex.StatusCode,
        //           new HttpMessage(ex.Message)
        //         );
        //    }
        //    catch (Exception ex)
        //    {
        //        return StatusCode(
        //           StatusCodes.Status500InternalServerError,
        //           new HttpMessage(ex.Message)
        //       );
        //    }
        //}



        [HttpDelete("{id}")]
        [Authorize(Roles = ROL.ADMIN)]
        [ProducesResponseType(typeof(HttpMessage), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(HttpMessage), StatusCodes.Status404NotFound)]
        [ProducesResponseType(typeof(void), StatusCodes.Status403Forbidden)]
        async public Task<ActionResult<OrderDTO>> DeleteOne(int id)
        {
            try
            {

                var orderDto = await _services.DeleteOne(id);
                return Ok(orderDto);
            }
            catch (HttpResponseError ex)
            {
                return StatusCode(
                    (int)ex.StatusCode,
                    new HttpMessage(ex.Message)
                );
            }
            catch (Exception ex)
            {
                return StatusCode(
                    StatusCodes.Status500InternalServerError,
                    new HttpMessage(ex.Message)
                );
            }
        }

    }
}
