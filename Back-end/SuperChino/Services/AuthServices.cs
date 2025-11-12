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
        private readonly string _secret;

        public AuthServices(UserServices userServices, RolServices rolServices, IEncoderServices encoderServices, IMapper mapper, IConfiguration config)
        {
            _userServices = userServices;
            _rolServices = rolServices;
            _encoderServices = encoderServices;
            _mapper = mapper;
            _config = config;
            _secret = _config.GetSection("Secrets")?["JWT"] ?? throw new Exception("JWT Secret not configured");
        }

        public async Task<User> RegisterUser(RegisterDTO register)
        {
            var user = await _userServices.GetOneByEmail(register.Email);

            if (user != null)
                throw new HttpResponseError(HttpStatusCode.BadRequest, "El usuario ya existe");

            if (register.Password != register.ConfirmPassword)
                throw new HttpResponseError(HttpStatusCode.BadRequest, "Las contraseñas no coinciden");

            register.Password = _encoderServices.Encode(register.Password);

            var userCreated = await _userServices.CreateOne(register);
            return userCreated;
        }

        public async Task<LoginResposeDTO> Login(LoginDTO login, HttpContext context)
        {
            if (!login.Email.Contains("@"))
                throw new HttpResponseError(HttpStatusCode.BadRequest, "Formato de email inválido");

            var user = await _userServices.GetOneByEmail(login.Email);
            if (user == null)
                throw new HttpResponseError(HttpStatusCode.BadRequest, "Email o contraseña incorrectos");

            var isPassMatch = _encoderServices.Verify(login.Password, user.Password);
            if (!isPassMatch)
                throw new HttpResponseError(HttpStatusCode.BadRequest, "Email o contraseña incorrectos");

            // 🔐 Generar token JWT
            var token = GenerateJWT(user);

            // Opcional: cookie para sesiones
            await SetCookie(user, context);

            return new LoginResposeDTO
            {
                Token = token,
                User = _mapper.Map<UserWithRolesDTO>(user)
            };
        }

        public async Task Logout(HttpContext context)
        {
            await context.SignOutAsync(CookieAuthenticationDefaults.AuthenticationScheme);
        }

        public async Task SetCookie(User usuario, HttpContext context)
        {
            var claims = new List<Claim>
            {
                new Claim("Id", usuario.Id.ToString())
            };

            if (usuario.Roles != null)
            {
                foreach (var role in usuario.Roles)
                    claims.Add(new Claim(ClaimTypes.Role, role.Name));
            }

            var identity = new ClaimsIdentity(claims, CookieAuthenticationDefaults.AuthenticationScheme);
            var principal = new ClaimsPrincipal(identity);

            await context.SignInAsync(
                CookieAuthenticationDefaults.AuthenticationScheme,
                principal,
                new AuthenticationProperties
                {
                    IsPersistent = true,
                    ExpiresUtc = DateTime.UtcNow.AddDays(1)
                }
            );
        }

        public string GenerateJWT(User user)
        {
            var claims = new List<Claim>
            {
                new Claim("Id", user.Id.ToString())
            };

            // ⚙️ El claim de rol **correcto** para que funcione con [Authorize(Roles = "Admin")]
            if (user.Roles != null)
            {
                foreach (var role in user.Roles)
                {
                    claims.Add(new Claim(ClaimTypes.Role, role.Name)); // ← este es el fix real
                }
            }

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_secret));
            var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(claims),
                Expires = DateTime.UtcNow.AddHours(1),
                SigningCredentials = credentials
            };

            var tokenHandler = new JwtSecurityTokenHandler();
            var token = tokenHandler.CreateToken(tokenDescriptor);

            // 🔍 DEBUG opcional
            Console.WriteLine("🔍 [JWT DEBUG] Claims del token generado:");
            foreach (var c in claims)
                Console.WriteLine($" - {c.Type}: {c.Value}");

            return tokenHandler.WriteToken(token);
        }

        public async Task<UserWithRolesDTO> AssingRoles(int id, List<int> rolesIds)
        {
            var user = await _userServices.GetOnById(id);
            var roles = await _rolServices.GetManyById(rolesIds);
            user.Roles = roles;

            var update = await _userServices.UpdateOne(user);
            return _mapper.Map<UserWithRolesDTO>(update);
        }
    }
}
