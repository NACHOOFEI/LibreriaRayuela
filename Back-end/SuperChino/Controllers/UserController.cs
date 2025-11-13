using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using LibreriaOnline.Enums;
using LibreriaOnline.Models.User.Dto;
using LibreriaOnline.Services;
using LibreriaOnline.Utils;

namespace LibreriaOnline.Controllers
{
        [Route("api/users")]
        [ApiController]
    public class UserController : Controller
    {
        
        private readonly UserServices _services;

        public UserController(UserServices services)
        {
            _services = services;
        }

        [HttpGet]
        [Authorize(Roles = ROL.ADMIN)]
        [ProducesResponseType(typeof(IEnumerable<UserWithRolesDTO>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(HttpMessage), StatusCodes.Status500InternalServerError)] 
        async public Task<ActionResult<IEnumerable<UserWithRolesDTO>>> GetAll()
        {
            try
            {
                return Ok(await _services.GetUsers());
            }
            catch (Exception ex)
            {
                return StatusCode(
                    StatusCodes.Status500InternalServerError,
                    new HttpMessage(ex.Message)
                );
            }
        }

        
    }
}
