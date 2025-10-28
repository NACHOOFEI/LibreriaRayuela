using System.ComponentModel.DataAnnotations;

namespace SuperChino.Models.Category.Dto
{
    public class CategoryUpdateDTO
    {
        [MaxLength(30, ErrorMessage = "No más de 30 caracteres")]
        public string Name { get; set; } = null!;


        [MaxLength(30, ErrorMessage = "No más de 30 caracteres")]
        public string Description { get; set; } = null!;
    }
}
