using AutoMapper;
using SuperChino.Models.Category;
using SuperChino.Models.Category.Dto;
using SuperChino.Models.User;
using SuperChino.Models.User.Dto;

namespace SuperChino.Config
{
    public class Mapping :Profile
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


        }
    }
}
