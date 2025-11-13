namespace LibreriaOnline.Models.User.Dto
{
    public class LoginResposeDTO
    {
        public string Token { get; set; } = null!;

        public UserWithRolesDTO User { get; set; } = null!;
    }
}
