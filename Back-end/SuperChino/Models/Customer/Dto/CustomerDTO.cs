using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SuperChino.Models.Customer.Dto
{
    public class CustomerDTO
    {
        public int Id { get; set; }
        public string Name { get; set; } = null!;
        public string DNI { get; set; } = null!;
        public string Email { get; set; } = null!;
        public string? Phone { get; set; }
        public string? Address { get; set; }
        public User.User? User { get; set; }
    }
}
