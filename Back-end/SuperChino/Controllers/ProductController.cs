using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using SuperChino.Models.Product.Dto;
using SuperChino.Services;

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
        async public Task<ActionResult<IEnumerable<ProductDTO>>> GetAll()
        {
            var products = await _services.GetAll();
            return Ok(products);
        }

        [HttpGet("{id}")]
        async public Task<ActionResult<ProductDTO>> GetById(int id)
        {
            var productDto = await _services.GetById(id);
            return productDto != null ? Ok(productDto) : NotFound();
        }

        [HttpPost]
        async public Task<ActionResult<ProductDTO>> CreateOne([FromBody] ProductInsertDTO productInsertDTO)
        {
            var productDto = await _services.CreateOne(productInsertDTO);
            return CreatedAtAction(nameof(GetById), new { id = productDto.Id }, productDto);
        }

        [HttpPut("{id}")]
        async public Task<ActionResult<ProductDTO>> UpdateOne(int id, [FromBody] ProductUpdateDTO productUpdateDTO)
        {
            var productDto = await _services.UpdateOne(id, productUpdateDTO);
            return productDto != null ? Ok(productDto) : NotFound();
        }

        [HttpDelete("{id}")]
        async public Task<ActionResult<ProductDTO>> DeleteOne(int id)
        {
            var productDto = await _services.DeleteOne(id);
            return productDto != null ? Ok(productDto) : NotFound();
        }

    }
}
