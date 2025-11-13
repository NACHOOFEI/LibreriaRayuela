using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using LibreriaOnline.Enums;
using LibreriaOnline.Models.Category.Dto;
using LibreriaOnline.Models.Product.Dto;
using LibreriaOnline.Services;
using LibreriaOnline.Utils;

namespace LibreriaOnline.Controllers
{
    [Route("api/categories")]
    [ApiController]
    public class CategoryController : ControllerBase
    {
        private readonly CategoryServices _services;
        public CategoryController(CategoryServices services)
        {
            _services = services;
        }

        [HttpGet]
        [ProducesResponseType(typeof(IEnumerable<CategoryDTO>),StatusCodes.Status200OK)]
        async public Task<ActionResult<IEnumerable<CategoryDTO>>> GetAll()
        {
            try
            {
            var categories = await _services.GetAll();
            return Ok(categories);

            }catch(Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new HttpMessage(ex.Message));
            }
        }

        [HttpGet("{id}")]
        [ProducesResponseType(typeof(CategoryDTO), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(HttpMessage), StatusCodes.Status404NotFound)]
        [ProducesResponseType(typeof(HttpMessage), StatusCodes.Status500InternalServerError)]
        async public Task<ActionResult<CategoryDTO>> GetById(int id)
        {
            try
            {
            var categoryDto = await _services.GetById(id);
                return Ok(categoryDto); 

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

        [HttpPost]
        [Authorize(Roles = ROL.ADMIN)]
        [ProducesResponseType(typeof(CategoryDTO), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ValidationErrorResponse), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(void), StatusCodes.Status403Forbidden)]
        async public Task<ActionResult<CategoryDTO>> CreateOne([FromBody] CategoryInsertDTO categoryInsertDTO)
        {
            try
            {

            var categoryDto = await _services.CreateOne(categoryInsertDTO);
            return CreatedAtAction(nameof(GetById), new { id = categoryDto.Id }, categoryDto);

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

        [HttpPut("{id}")]
        [ProducesResponseType(typeof(CategoryDTO), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ValidationErrorResponse), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(void), StatusCodes.Status403Forbidden)]
        async public Task<ActionResult<CategoryDTO>> UpdateOne(int id, [FromBody] CategoryUpdateDTO categoryUpdateDTO)
        {
            try
            {

                var categoryDto = await _services.UpdateOne(id, categoryUpdateDTO);
                return Ok(categoryDto);

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
        async public Task<ActionResult<CategoryDTO>> DeleteOne(int id)
        {
            try
            {

            var categoryDto = await _services.DeleteOne(id);
                return Ok(categoryDto);
 

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
