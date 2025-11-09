using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using SuperChino.Enums;
using SuperChino.Models.Product.Dto;
using SuperChino.Services;
using SuperChino.Utils;

namespace SuperChino.Controllers
{
    [Route("api/products")]
    [ApiController]
    public class ProductController : ControllerBase
    {
        private readonly ProductServices _services;
        public ProductController(ProductServices services)
        {
            _services = services;
        }

        [HttpGet]
        [ProducesResponseType(typeof(IEnumerable<ProductDTO>),StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(HttpMessage), StatusCodes.Status500InternalServerError)]

        async public Task<ActionResult<IEnumerable<ProductDTO>>> GetAll()
        {
            try
            {
            var products = await _services.GetAll();
            return Ok(products);
            }
            catch (Exception ex) 
            { 
             return StatusCode(StatusCodes.Status500InternalServerError,new HttpMessage(ex.Message));
            }
        }

        [HttpGet("{id}")]
        [ProducesResponseType(typeof(IEnumerable<ProductDTO>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(HttpMessage), StatusCodes.Status404NotFound)]
        [ProducesResponseType(typeof(HttpMessage), StatusCodes.Status500InternalServerError)]
        async public Task<ActionResult<ProductDTO>> GetById(int id)
        {
            try
            {
                var productDto = await _services.GetById(id);
                return Ok(productDto);
            }
            catch(HttpResponseError ex)
            {
                return StatusCode(
                  (int)ex.StatusCode,
                    new HttpMessage(ex.Message)
);
            }
            catch(Exception ex)
            {
                return StatusCode(
                     StatusCodes.Status500InternalServerError,
                     new HttpMessage(ex.Message)
);
            }

        }

        [HttpPost]
        [Authorize(Roles = ROL.ADMIN)]
        [ProducesResponseType(typeof(ProductDTO), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ValidationErrorResponse), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(void), StatusCodes.Status403Forbidden)]
        async public Task<ActionResult<ProductDTO>> CreateOne([FromForm  ] ProductInsertDTO productInsertDTO)
        {
            try
            {
            var productDto = await _services.CreateOne(productInsertDTO);
            return CreatedAtAction(nameof(GetById), new { id = productDto.Id }, productDto);

            }
            catch (HttpResponseError ex)
            {
                return StatusCode(
                  (int)ex.StatusCode,
                   new HttpMessage(ex.Message)
                 );
            } catch (Exception ex)
            {
                return StatusCode(
                   StatusCodes.Status500InternalServerError,
                   new HttpMessage(ex.Message)
               );
            }
        }

        [HttpPut("{id}")]
        [Authorize(Roles = ROL.ADMIN)]
        [ProducesResponseType(typeof(ProductDTO), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ValidationErrorResponse), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(void), StatusCodes.Status403Forbidden)]
        async public Task<ActionResult<ProductDTO>> UpdateOne(int id, [FromBody] ProductUpdateDTO productUpdateDTO)
        {
            try
            {
                var productDto = await _services.UpdateOne(id, productUpdateDTO);
                return Ok(productDto); 
           

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

        

        [HttpDelete("{id}")]
        [Authorize(Roles = ROL.ADMIN)]
        [ProducesResponseType(typeof(HttpMessage), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(HttpMessage), StatusCodes.Status404NotFound)]
        [ProducesResponseType(typeof(void), StatusCodes.Status403Forbidden)]
        async public Task<ActionResult<ProductDTO>> DeleteOne(int id)
        {
            try
            {
            
                var productDto = await _services.DeleteOne(id);
                return Ok(productDto); 
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

        [HttpPatch("{id}/restar-stock")]
        [Authorize(Roles = ROL.ADMIN)]
        [ProducesResponseType(typeof(HttpMessage), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(HttpMessage), StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> RestarStock(int id, [FromBody] ProductUpdateStockDTO dto)
        {
            try
            {
                await _services.RestarStock(id, dto.Quantity);
                return Ok(new HttpMessage("Stock actualizado correctamente."));
            }
            catch (Exception ex)
            {
                return BadRequest(new HttpMessage(ex.Message));
            }
        }

        [HttpPatch("{id}/sumar-stock")]
        [Authorize(Roles = ROL.ADMIN)]
        [ProducesResponseType(typeof(HttpMessage), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(HttpMessage), StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> SumarStock(int id, [FromBody] ProductUpdateStockDTO dto)
        {
            try
            {
                await _services.SumarStock(id, dto.Quantity);
                return Ok(new HttpMessage("Stock actualizado correctamente."));
            }
            catch (Exception ex)
            {
                return BadRequest(new HttpMessage(ex.Message));
            }
        }

    }
}
