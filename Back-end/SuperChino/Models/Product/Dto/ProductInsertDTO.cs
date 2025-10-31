using System.ComponentModel.DataAnnotations;

namespace SuperChino.Models.Product.Dto
{
    public class ProductInsertDTO
    {
        [Required(ErrorMessage = "Requerido")]
        [MaxLength(30, ErrorMessage = "No más de 30 caracteres")]
        public string Name { get; set; }

        [Required(ErrorMessage = "Requerido")]
        [MaxLength(100, ErrorMessage = "No más de 100 caracteres")]
        public string Description { get; set; }

        [Range(0.01, double.MaxValue, ErrorMessage = "El precio debe ser mayor a 0")]
        public decimal Price { get; set; }

        [Range(0, int.MaxValue, ErrorMessage = "El stock no puede ser negativo")]
        public int Stock { get; set; }

        public IFormFile Image { get; set; }

        [Required(ErrorMessage = "Requerido")]
        public int CategoryId { get; set; }
    }
}
