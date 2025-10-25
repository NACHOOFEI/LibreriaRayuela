using System.Globalization;

namespace SuperChino.Services
{
    public interface IEncoderServices
    {
        string Encode(string value);

        bool Verify (string value, string hash);
    }
    public class EncoderServices : IEncoderServices
    {
        public string Encode(string value)
        {
            string salt = BCrypt.Net.BCrypt.GenerateSalt(13);

            return BCrypt.Net.BCrypt.HashPassword(value, salt);
        }

        public bool Verify(string value, string hash)
        {
            return BCrypt.Net.BCrypt.Verify(value,hash);
        }
    }
}
