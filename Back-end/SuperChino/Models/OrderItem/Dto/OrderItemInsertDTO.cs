using System.ComponentModel.DataAnnotations;

namespace SuperChino.Models.OrderItem.Dto
{
    public class OrderItemInsertDTO
    {
        [Required]
        public int ProductId { get; set; }

        [Required]
        [Range(0, int.MaxValue, ErrorMessage = "La cantidad no puede ser negativa")]
        public int Quantity { get; set; }

        public int? OrderId { get; set; }
    }
}
