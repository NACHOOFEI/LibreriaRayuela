using System.ComponentModel.DataAnnotations;

namespace SuperChino.Models.Product.Dto
{
    public class ProductUpdateDTO
    {
        [MaxLength(30, ErrorMessage = "No más de 30 caracteres")]
        public string? Name { get; set; }

        [MaxLength(100, ErrorMessage = "No más de 100 caracteres")]
        public string? Description { get; set; }

        [Range(0.01, double.MaxValue, ErrorMessage = "El precio debe ser mayor a 0")]
        public decimal? Price { get; set; }

        [Range(0, int.MaxValue, ErrorMessage = "El stock no puede ser negativo")]
        public int? Stock { get; set; }
        public IFormFile Image { get; set; }

        public string? ImageUrl { get; set; }
        public int? CategoryId { get; set; }
    }
}
