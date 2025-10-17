using AutoMapper;
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
            CreateMap<User,>();
        }
    }
}
