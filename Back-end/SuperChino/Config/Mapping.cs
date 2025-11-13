using AutoMapper;
using SuperChino.Models.Category;
using SuperChino.Models.Category.Dto;
using SuperChino.Models.Customer;
using SuperChino.Models.Customer.Dto;
using SuperChino.Models.Order;
using SuperChino.Models.Order.Dto;
using SuperChino.Models.OrderItem;
using SuperChino.Models.OrderItem.Dto;
using SuperChino.Models.Product;
using SuperChino.Models.Product.Dto;
using SuperChino.Models.User;
using SuperChino.Models.User.Dto;

namespace SuperChino.Config
{
    public class Mapping : Profile
    {
        public Mapping()
        {
            CreateMap<bool?, bool>().ConvertUsing((src, dest) => src ?? dest);
            CreateMap<int?, int>().ConvertUsing((src, dest) => src ?? dest);
            CreateMap<List<string>?, List<string>>().ConvertUsing((src, dest) => src ?? dest);
            CreateMap<DateOnly?, DateOnly>().ConvertUsing((src, dest) => src ?? dest);



            CreateMap<RegisterDTO, User>();
            CreateMap<User,UserWithRolesDTO>().ForMember(
                dest => dest.Roles,
                opt => opt.MapFrom(src => src.Roles.Select(r => r.Name).ToList()));

            CreateMap<CategoryInsertDTO, Category>();
            CreateMap<Category, CategoryDTO>();
            CreateMap<CategoryUpdateDTO, Category>();

            CreateMap<ProductInsertDTO, Product>();
            CreateMap<Product, ProductDTO>();
            CreateMap<ProductUpdateDTO, Product>()
                .ForAllMembers(opts =>
                    opts.Condition((src, dest, srcMember, destMember, context) =>
                    {
                        // Solo mapea si el valor fuente no es null
                        // y además si no es un decimal 0.00 (cuando se trata del precio)
                        if (srcMember is decimal d && d == 0)
                            return false;

                        return srcMember != null;
                    }));

            CreateMap<CustomerInsertDTO, Customer>();
            CreateMap<Customer, CustomerDTO>();
            CreateMap<CustomerUpdateDTO, Customer>();

            CreateMap<OrderItemInsertDTO, OrderItem>();
            CreateMap<OrderItem, OrderItemDTO>();
            CreateMap<OrderItemUpdateDTO, OrderItem>();

            CreateMap<OrderInsertDTO, Order>();
            CreateMap<Order, OrderDTO>();
            CreateMap<OrderUpdateDTO, Order>();
        }
    }
}
