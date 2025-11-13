using System.Net.Http.Headers;
using System.Text;
using System.Text.Json;

namespace LibreriaOnline.Services
{
    public class WhatsAppServices
    {
        private readonly string _token;
        private readonly string _phoneNumberId;
        private const string ALIAS = "nacho.orfei.mp"; 

        public WhatsAppServices(IConfiguration config)
        {
            _token = config["Secrets:WSP:Token"];
            _phoneNumberId = config["Secrets:WSP:PhoneId"]; 
        }

        public async Task EnviarMensajeWsp(string numeroDestino, string mensaje)
        {
            using var client = new HttpClient();
            client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", _token);

            var body = new
            {
                messaging_product = "whatsapp",
                to = numeroDestino,
                type = "text",
                text = new { body = mensaje }
            };

            var response = await client.PostAsync(
                $"https://graph.facebook.com/v18.0/{_phoneNumberId}/messages",
                new StringContent(JsonSerializer.Serialize(body), Encoding.UTF8, "application/json")
            );

            Console.WriteLine(await response.Content.ReadAsStringAsync());
        }
        public async Task EnviarMensajeDePago(string numeroDestino, decimal monto)
        {
            string mensaje = $"Hola! Gracias por tu compra.\n\n" +
                             $"*Monto:* ${monto}\n" +
                             $"*Alias:* {ALIAS}\n\n" +
                             $"Cuando completes la transferencia enviá el comprobante por acá.\n" +
                             $"Gracias! 🙌";

            await EnviarMensajeWsp(numeroDestino, mensaje);
        }
    }
}
