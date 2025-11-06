using Microsoft.EntityFrameworkCore.Metadata.Internal;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace SuperChino.Models.OrderItem
{
    public class OrderItem
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }

        [Required]
        [ForeignKey(nameof(Product))]
        public int ProductId { get; set; }
        public Product.Product Product { get; set; }

        [Required]
        public int Quantity { get; set; }

        public decimal UnitPrice { get; set; }
        public decimal Subtotal {  get; set; }

        [JsonIgnore]
        [Required]
        [ForeignKey(nameof(Order))]
        public int OrderId { get; set; }
        public Order.Order Order { get; set; }
    }
}
