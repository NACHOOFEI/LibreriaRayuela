using LibreriaOnline.Models.OrderItem.Dto;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace LibreriaOnline.Models.Order.Dto
{
    public class OrderInsertDTO
    {

        [Required]
        public int CustomerId { get; set; }

        [Required]
        [MinLength(1, ErrorMessage = "La orden debe contener al menos un producto.")]
        public ICollection<OrderItemInsertDTO> Items { get; set; } = new List<OrderItemInsertDTO>();

        [Range(0, double.MaxValue, ErrorMessage = "El total no puede ser negativo.")]
        public decimal Total { get; set; }
    }
}
