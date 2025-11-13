using System.Collections.Specialized;
using System.ComponentModel.DataAnnotations;
using System.Globalization;

namespace LibreriaOnline.Models.User.Dto
{
    public class LoginDTO
    {
        [Required]
        public string Email { get; set; } = null!;
        [Required]
        public string Password { get; set; } = null!;
    }
}
