using System.Net;

namespace SuperChino.Utils
{
    public class HttpResponseError : Exception
    {
        public HttpStatusCode StatusCode { get; set; }
        public string Message { get; set; } = null!;

        public HttpResponseError(HttpStatusCode statusCode, string message) : base(message)
        {
            StatusCode = statusCode;
            Message = message;
        }
    }
}
