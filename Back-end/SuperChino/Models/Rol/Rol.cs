using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SuperChino.Models.Rol
{
    public class Rol
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }

        public string Name { get; set; }
    }
    public class RolUser
    {
        public int RolId {  get; set; }
        public int UserId { get; set; }
    }
}
