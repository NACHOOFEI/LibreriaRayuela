using AutoMapper;
using LibreriaOnline.Enums;
using LibreriaOnline.Models.Rol;
using LibreriaOnline.Models.User;
using LibreriaOnline.Models.User.Dto;
using LibreriaOnline.Repositories;
using LibreriaOnline.Utils;
using System.Net;

namespace LibreriaOnline.Services
{
    public class UserServices
    {
        private readonly IMapper _mapper;
        private readonly IUserRepository _repo;
        private readonly RolServices _rolServices;
        public UserServices(IMapper mapper, IUserRepository repo, RolServices rolServices)
        {
            _mapper = mapper;
            _repo = repo;
            _rolServices = rolServices;
        }

        async public Task<User> GetOnByIdOrException(int id)
        {
            var user =  await _repo.GetOne(x => x.Id == id);

            if(user == null)
            {
                throw new HttpResponseError(
                    HttpStatusCode.NotFound,
                    $"no se encontro el usuario con el id : {id}"
                    );
            }
            return user;
        }

        async public Task<User> GetOnById(int id) => await GetOnByIdOrException(id);

        async public Task<User> CreateOne(RegisterDTO register)
        {
            var user = _mapper.Map<User>(register);

            var rolDefault = await _rolServices.GetOneByName(ROL.USER);

            user.Roles = new List<Rol>() { rolDefault };

            foreach (var role in user.Roles)
            {
                var rolExist = await _rolServices.GetOneByName(role.Name);
            }

            await _repo.CreateOne(user);

            return user;
        }

        async public Task<User> UpdateOne(User user)
        {
            await _repo.UpdateOne(user);
            return user;
        }

        async public Task<User> GetOneByEmail(string email)
        {
            User user;

            if (!string.IsNullOrEmpty(email))
            {
                user = await _repo.GetOneWithRoles( u =>  u.Email == email );
            }
            else
            {
                throw new HttpResponseError(HttpStatusCode.BadRequest, " el email no coincide con la password");
            }
            return user;
        }

        public async Task<IEnumerable<UserWithRolesDTO>> GetUsers()
        {
            var users = await _repo.GetWithRoles();
            return _mapper.Map<IEnumerable<UserWithRolesDTO>>(users);
        }

    }
}
