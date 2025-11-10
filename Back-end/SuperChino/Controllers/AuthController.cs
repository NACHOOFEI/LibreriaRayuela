using Azure.Core;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SuperChino.Enums;
using SuperChino.Models.User;
using SuperChino.Models.User.Dto;
using SuperChino.Services;
using SuperChino.Utils;
using static System.Runtime.InteropServices.JavaScript.JSType;
using HttpMessage = SuperChino.Utils.HttpMessage;

namespace SuperChino.Controllers
{
    [Route("api/auth")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly AuthServices _authServices;

        public AuthController(AuthServices authServices)
        {
            _authServices = authServices;
        }

        [HttpPost("register")]
        async public Task<ActionResult<User>> Register([FromBody] RegisterDTO register)
        {
            try
            {
                return Ok(await _authServices.RegisterUser(register));
            }
            catch (HttpResponseError error)
            {
                return StatusCode((int)error.StatusCode, new HttpMessage(error.Message));
            }
            catch (Exception error)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new HttpMessage(error.Message));
            }

        }


        [HttpPost("login")]
        async public Task<ActionResult<LoginResposeDTO>> LoginController([FromBody] LoginDTO login)
        {
            try
            {
                var res = await _authServices.Login(login, HttpContext);
                return Ok(res);
            }
            catch (HttpResponseError ex)
            {
                return StatusCode((int)ex.StatusCode, new HttpMessage(ex.Message));
            }
            catch (Exception error)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new HttpMessage(error.Message));
            }
        }

        [HttpPost("logout")]
        [Authorize]
        async public Task<ActionResult> Logout()
        {
            try
            {
                await _authServices.Logout(HttpContext);
                return Ok();
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new HttpMessage(ex.Message));
            }
        }

        [HttpPut("{id}/roles")]
        [Authorize(Roles = ROL.ADMIN)]
        async public Task<ActionResult<UserWithRolesDTO>> AssingRoles(int id, [FromBody] List<int> rolesIds)
        {
            try
            {
                return Ok(await _authServices.AssingRoles(id, rolesIds));
            }
            catch (HttpResponseError ex)
            {
                return StatusCode((int)ex.StatusCode, new HttpMessage(ex.Message));
            }
            catch (Exception error)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new HttpMessage(error.Message));
            }
        }


    }
}
