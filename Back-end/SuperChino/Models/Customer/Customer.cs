using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace LibreriaOnline.Models.Customer
{
    public class Customer
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }

        [Required]
        public string Name { get; set; } = null!;
        public string DNI { get; set; } = null!;
        public string Phone { get; set; } = null!;
        public string Address { get; set; } = null!;

        [ForeignKey(nameof(User))]
        public int UserId { get; set; } 
        public User.User? User { get; set; }

        // Todavia no creamos la entidad Order, pero si se quiere hacer relación bidireccional se puede agregar la siguiente propiedad:
        // public ICollection<Order> Orders { get; set; } = new List<Order>();


    }
}
