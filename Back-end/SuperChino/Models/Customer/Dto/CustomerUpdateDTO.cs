using System.ComponentModel.DataAnnotations;

namespace SuperChino.Models.Customer.Dto
{
    public class CustomerUpdateDTO
    {
        [MaxLength(50, ErrorMessage = "No más de 50 caracteres.")]
        [MinLength(2, ErrorMessage = "Mínimo 2 caracteres.")]
        public string? Name { get; set; }

        public string? DNI { get; set; }

        [EmailAddress(ErrorMessage = "El correo electrónico no es válido")]
        [MaxLength(100, ErrorMessage = "No más de 100 caracteres")]
        public string? Email { get; set; }

        [Phone(ErrorMessage = "El número de teléfono no es válido")]
        public string? Phone { get; set; }

        [MaxLength(100, ErrorMessage = "No más de 100 caracteres")]
        public string? Adress { get; set; }

        public int? UserId { get; set; }

    }
}
