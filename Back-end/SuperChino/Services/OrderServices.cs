using AutoMapper;
using LibreriaOnline.Models.Order;
using LibreriaOnline.Models.Order.Dto;
using LibreriaOnline.Models.OrderItem;
using LibreriaOnline.Repositories;

namespace LibreriaOnline.Services
{
    public class OrderServices
    {
        private readonly IOrderRepository _repo;
        private readonly ICustomerRepository _customerRepository;
        private readonly OrderItemServices _orderItemService;
        private readonly WhatsAppServices _appServices;
 
        private IMapper _mapper;
        public OrderServices(IOrderRepository repo, IMapper mapper, ICustomerRepository customerRepository, OrderItemServices orderItemService, WhatsAppServices appServices)
        {
            _repo = repo;
            _mapper = mapper;
            _customerRepository = customerRepository;
            _orderItemService = orderItemService;
            _appServices=appServices;
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
            var customer = await _customerRepository.GetOne(c => c.Id == orderInsertDTO.CustomerId);
            if (customer == null)
                throw new Exception("El cliente especificado no existe.");

            // Creamos y gaurdamos la orden en este momento para poder conseguir el Id de Order e insertarlo luego en los OrderItem creados dentro de esta.
            var order = new Order
            {
                CustomerId = orderInsertDTO.CustomerId,
                OrderDate = DateTime.UtcNow
            };

            await _repo.CreateOne(order);
            await _repo.Save(); 

            foreach (var itemDto in orderInsertDTO.Items)
            {
                var orderItemDto = await _orderItemService.CreateOne(itemDto, order.Id);
                order.Items.Add(_mapper.Map<OrderItem>(orderItemDto));
            }

            order.Total = order.Items.Sum(i => i.Subtotal);

            await _repo.Save();
            await _appServices.EnviarMensajeDePago(customer.Phone, order.Total);
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
