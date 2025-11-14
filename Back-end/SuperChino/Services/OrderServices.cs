using AutoMapper;
using LibreriaOnline.Models.Order;
using LibreriaOnline.Models.Order.Dto;
using LibreriaOnline.Models.OrderItem;
using LibreriaOnline.Models.Product.Dto;
using LibreriaOnline.Repositories;

namespace LibreriaOnline.Services
{
    public class OrderServices
    {
        private readonly IOrderRepository _repo;
        private readonly ICustomerRepository _customerRepository;
        private readonly OrderItemServices _orderItemService;
        private readonly WhatsAppServices _appServices;
        private readonly ProductServices _productServices;
        private IMapper _mapper;
        public OrderServices(IOrderRepository repo, IMapper mapper, ICustomerRepository customerRepository, OrderItemServices orderItemService, WhatsAppServices appServices, ProductServices productServices)
        {
            _repo = repo;
            _mapper = mapper;
            _customerRepository = customerRepository;
            _orderItemService = orderItemService;
            _appServices=appServices;
            _productServices=productServices;
        }

        public async Task<IEnumerable<OrderDTO>> GetAll()
        {
            var orders = await _repo.GetAll();
            return orders.Select(c => _mapper.Map<OrderDTO>(c));
        }
        public async Task<OrderDTO> GetById(int id)
        {
            var order = await _repo.GetOne(c => c.Id == id);
            if (order != null)
            {
                var orderDto = _mapper.Map<OrderDTO>(order);
                return orderDto;
            }
            return null;
        }


        public async Task<OrderDTO> CreateOne(OrderInsertDTO orderInsertDTO)
        {
            // 1️⃣ Verificar que exista el cliente
            var customer = await _customerRepository.GetOne(c => c.Id == orderInsertDTO.CustomerId);
            if (customer == null)
                throw new Exception("El cliente especificado no existe.");

            // 2️⃣ Traer todos los productos de una sola vez
            var productIds = orderInsertDTO.Items.Select(i => i.ProductId).ToList();
            var products = await _productServices.GetByIds(productIds);
            var productDict = products.ToDictionary(p => p.Id, p => p);

            // 3️⃣ Crear la orden
            var order = new Order
            {
                CustomerId = orderInsertDTO.CustomerId,
                OrderDate = DateTime.UtcNow,
                Items = new List<OrderItem>()
            };

            // 4️⃣ Crear los items y restar stock directamente
            foreach (var itemDto in orderInsertDTO.Items)
            {
                if (!productDict.TryGetValue(itemDto.ProductId, out var product))
                    throw new Exception($"Producto con id {itemDto.ProductId} no encontrado");

                if (product.Stock < itemDto.Quantity)
                    throw new Exception($"No hay stock suficiente para {product.Name}");

                // Restar stock
                product.Stock -= itemDto.Quantity;

                var orderItem = new OrderItem
                {
                    ProductId = itemDto.ProductId,
                    Quantity = itemDto.Quantity,
                    Subtotal = itemDto.Quantity * product.Price
                };

                order.Items.Add(orderItem);
            }

            // 5️⃣ Calcular total
            order.Total = order.Items.Sum(i => i.Subtotal);

            // 6️⃣ Guardar todo en el mismo contexto
            await _repo.CreateOne(order);

            // Guardar cambios de stock también
            foreach (var product in products)
            {
                await _productServices.UpdateOne(product.Id, new ProductUpdateDTO { Stock = product.Stock });
            }

            await _repo.Save();

            // 7️⃣ Enviar mensaje de pago
            await _appServices.EnviarMensajeDePago(customer.Phone, order.Total);

            // 8️⃣ Retornar DTO
            return _mapper.Map<OrderDTO>(order);
        }


        public async Task<OrderDTO> DeleteOne(int id)
        {
            var order = await _repo.GetOne(c => c.Id == id);
            if (order != null)
            {
                _repo.DeleteOne(order);
                await _repo.Save();

                var orderDto = _mapper.Map<OrderDTO>(order);
                return orderDto;
            }
            return null;
        }

        //public async Task<OrderDTO> UpdateOne(int id, OrderUpdateDTO orderUpdateDTO)
        //{ 
        //    var order = await _repo.GetOne(o => o.Id == id);
        //    if (order == null)
        //    {
        //        throw new Exception("La orden no existe.");
        //    }
        //    // Acá se borran todos los items y se vuelven a cargar (no se si es lo mejor)
        //    order.Items.Clear();

        //    foreach (var itemDto in orderUpdateDTO.Items)
        //    {
        //        var orderItem = await _orderItemService.CreateOne(itemDto);
        //        order.Items.Add(_mapper.Map<OrderItem>(orderItem));
        //    }

        //    order.Total = order.Items.Sum(i => i.Subtotal);
            
        //    //Si tenemos que actualizar la fecha
        //    //order.OrderDate = DateTime.UtcNow;

        //    await _repo.Save();

        //    return _mapper.Map<OrderDTO>(order);
        //}
    }
}
