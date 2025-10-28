using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using SuperChino.Models.Category.Dto;
using SuperChino.Services;

namespace SuperChino.Controllers
{
    [Route("api/category")]
    [ApiController]
    public class CategoryController : ControllerBase
    {
        private readonly CategoryServices _services;
        public CategoryController(CategoryServices services)
        {
            _services = services;
        }

        [HttpGet]
        async public Task<ActionResult<IEnumerable<CategoryDTO>>> GetAll()
        {
            var categories = await _services.GetAll();
            return Ok(categories);
        }

        [HttpGet("{id}")]
        async public Task<ActionResult<CategoryDTO>> GetById(int id)
        {
            var categoryDto = await _services.GetById(id);
            return categoryDto != null ? Ok(categoryDto) : NotFound();
        }

        [HttpPost]
        async public Task<ActionResult<CategoryDTO>> CreateOne([FromBody] CategoryInsertDTO categoryInsertDTO)
        {
            var categoryDto = await _services.CreateOne(categoryInsertDTO);
            return CreatedAtAction(nameof(GetById), new { id = categoryDto.Id }, categoryDto);
        }

        [HttpPut("{id}")]
        async public Task<ActionResult<CategoryDTO>> UpdateOne(int id, [FromBody] CategoryUpdateDTO categoryUpdateDTO)
        {
            var categoryDto = await _services.UpdateOne(id, categoryUpdateDTO);
            return categoryDto != null ? Ok(categoryDto) : NotFound();
        }

        [HttpDelete("{id}")]
        async public Task<ActionResult<CategoryDTO>> DeleteOne(int id)
        {
            var categoryDto = await _services.DeleteOne(id);
            return categoryDto != null ? Ok(categoryDto) : NotFound();
        }

    }
}
