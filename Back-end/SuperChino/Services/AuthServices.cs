using AutoMapper;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.IdentityModel.Tokens;
using SuperChino.Models.Rol;
using SuperChino.Models.User;
using SuperChino.Models.User.Dto;
using SuperChino.Utils;
using System.IdentityModel.Tokens.Jwt;
using System.Net;
using System.Security.Claims;
using System.Text;

namespace SuperChino.Services
{
    public class AuthServices
    {
        private readonly UserServices _userServices;

        private readonly RolServices _rolServices;

        private readonly IEncoderServices _encoderServices;

        private readonly IMapper _mapper;

        private readonly IConfiguration _config;

        private string _secret;


        public AuthServices(UserServices userServices,RolServices rolServices,IEncoderServices encoderServices,IMapper mapper,IConfiguration config)
        {
            _userServices = userServices;
            _rolServices = rolServices;
            _encoderServices = encoderServices;
            _config = config;
            _secret = _config.GetSection("Secrets")?.GetSection("JWT")?.Value?.ToString() ?? null;
            _mapper = mapper;
        }


        async public Task<User> RegisterUser(RegisterDTO register)
        {
            var user = await _userServices.GetOneByEmail(register.Email);

            if (user != null)
            {
                throw new HttpResponseError(HttpStatusCode.BadRequest, "el usuario ya existe");
            }
            if (register.Password != register.ConfirmPassword)
            {
                throw new HttpResponseError(HttpStatusCode.BadRequest, "las contrasenias no coinciden");
            }

            register.Password = _encoderServices.Encode(register.Password);

            var userCreated = await _userServices.CreateOne(register);

            return userCreated;

        }

        async public Task<LoginResposeDTO> Login(LoginDTO login,HttpContext context)
        {
            bool IsEmail = login.Email.Contains("@");
            User user;
            if (IsEmail)
            {
                user = await _userServices.GetOneByEmail(login.Email);
            }
            else
            {
                throw new HttpResponseError(HttpStatusCode.BadRequest, "el email no coincide y contrasenia");
            }
            if (user == null) 
            {
                throw new HttpResponseError(HttpStatusCode.BadRequest, "el email no coincide y contrasenia");
            }

            bool isPassMatch = _encoderServices.Verify(login.Password, user.PasswordHash);

            if (!isPassMatch)
            {
                throw new HttpResponseError(HttpStatusCode.BadRequest, "el email no coincide y contrasenia");
            }
            await SetCookie(user, context);
            var token = GenerateJWT(user);

            return new LoginResposeDTO { Token = token }; 

        }

        async public Task Logout(HttpContext context)
        {
            await context.SignOutAsync(CookieAuthenticationDefaults.AuthenticationScheme);
        }

        async public Task SetCookie(User usuario, HttpContext context)
        {
            var claims = new List<Claim>()
            {
                new Claim("id", usuario.Id.ToString())
            };

            if (usuario.Roles != null)
            {
                foreach (var role in usuario.Roles)
                {
                    var claim = new Claim(ClaimTypes.Role, role.Name);
                    claims.Add(claim);
                }
            }

            var identity = new ClaimsIdentity(claims, CookieAuthenticationDefaults.AuthenticationScheme);
            var principal = new ClaimsPrincipal(identity);

            await context.SignInAsync(
                CookieAuthenticationDefaults.AuthenticationScheme,
                principal,
                new AuthenticationProperties
                {
                    IsPersistent = true,
                    ExpiresUtc = DateTime.UtcNow.AddDays(1),
                }
            );
        }

        public string GenerateJWT(User user)
        {
            var claims = new ClaimsIdentity();

            claims.AddClaim(new Claim("Id", user.Id.ToString()));

            if (user.Roles != null)
            {
                foreach (var role in user.Roles)
                {
                    
                    claims.AddClaim(new Claim(ClaimTypes.Role, role.Name));
                }
            }
            var key = Encoding.UTF8.GetBytes(_secret);
            var symmetrickey = new SymmetricSecurityKey(key);
            var credentials = new SigningCredentials(
                symmetrickey,
                SecurityAlgorithms.HmacSha256Signature
                );
            var tokenDescriptor = new SecurityTokenDescriptor()
            {
                Subject = claims,
                Expires = DateTime.UtcNow.AddHours(1),
                SigningCredentials = credentials
            };
            var tokenHandler = new JwtSecurityTokenHandler();
            var tokenConfig = tokenHandler.CreateToken(tokenDescriptor);
            string token = tokenHandler.WriteToken(tokenConfig);

            return token;
        }

        async public Task<UserWithRolesDTO> AssingRoles(int id , List<int> rolesids)
        {
            var user = await _userServices.GetOnById(id);
            List<Rol> roles = await _rolServices.GetManyById(rolesids);
            user.Roles = roles;
            var update = await _userServices.UpdateOne(user);
            return _mapper.Map<UserWithRolesDTO>(update);
        }

    }
}
