using SuperChino.Models.OrderItem.Dto;
using System.ComponentModel.DataAnnotations;

namespace SuperChino.Models.Order.Dto
{
    public class OrderUpdateDTO
    {
        [Required]
        [MinLength(1, ErrorMessage = "La orden debe contener al menos un producto.")]
        public ICollection<OrderItemInsertDTO>? Items { get; set; }

        [Range(0, double.MaxValue, ErrorMessage = "El total no puede ser negativo.")]
        public decimal? Total { get; set; }
    }
}
