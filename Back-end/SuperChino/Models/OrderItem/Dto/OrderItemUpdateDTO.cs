using System.ComponentModel.DataAnnotations;

namespace LibreriaOnline.Models.OrderItem.Dto
{
    public class OrderItemUpdateDTO
    {
        [Range(0, int.MaxValue, ErrorMessage = "La cantidad no puede ser negativa")]
        public int? Quantity { get; set; }
    }
}
