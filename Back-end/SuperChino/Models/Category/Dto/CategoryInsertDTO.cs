using System.ComponentModel.DataAnnotations;

namespace LibreriaOnline.Models.Category.Dto
{
    public class CategoryInsertDTO
    {
        [Required(ErrorMessage = "Requerido")]
        [MaxLength(30, ErrorMessage = "No más de 30 caracteres")]
        public string Name { get; set; } = null!;


        [MaxLength(30, ErrorMessage = "No más de 30 caracteres")]
        public string Description { get; set; } = null!;
    }
}


