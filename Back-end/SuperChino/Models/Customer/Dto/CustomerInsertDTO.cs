using System.ComponentModel.DataAnnotations;

namespace LibreriaOnline.Models.Customer.Dto
{
    public class CustomerInsertDTO
    {
        [MaxLength(50, ErrorMessage = "No más de 50 caracteres.")]
        [MinLength(2, ErrorMessage = "Mínimo 2 caracteres.")]
        public string Name { get; set; }

        [Required(ErrorMessage = "Requerido")]
        public string DNI { get; set; }

        [Phone(ErrorMessage = "El número de teléfono no es válido")]
        public string Phone { get; set; }

        [MaxLength(100, ErrorMessage = "No más de 100 caracteres")]
        public string Adress { get; set; }

        public int UserId { get; set; }

    }
}
