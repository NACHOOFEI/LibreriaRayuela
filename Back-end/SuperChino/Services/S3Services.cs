using Amazon.Runtime;
using Amazon.S3;
using Amazon.S3.Model;

namespace SuperChino.Services
{
    public class S3Services
    {
        private readonly IAmazonS3 _s3Client;
        private readonly string _bucketName;

        public S3Services(IConfiguration configuration)
        {
            var accessKey = configuration["Secrets:AWS:AccessKey"];
            var secretKey = configuration["Secrets:AWS:SecretKey"];
            var regionName = configuration["Secrets:AWS:Region"];
            _bucketName = configuration["Secrets:AWS:BucketName"];

            if (string.IsNullOrEmpty(accessKey) || string.IsNullOrEmpty(secretKey))
            {
                throw new Exception("⚠️ No se encontraron las credenciales de AWS en appsettings.json");
            }

            var credentials = new BasicAWSCredentials(accessKey, secretKey);
            var region = Amazon.RegionEndpoint.GetBySystemName(regionName);

            _s3Client = new AmazonS3Client(credentials, region);
        }

        public async Task<string> UploadFileAsync(IFormFile file)
        {
            var key = Guid.NewGuid().ToString() + Path.GetExtension(file.FileName);

            using var stream = file.OpenReadStream();

            var request = new PutObjectRequest
            {
                BucketName = _bucketName,
                Key = key,
                InputStream = stream,
                ContentType = file.ContentType,
            };

            await _s3Client.PutObjectAsync(request);

            // ✅ Devuelve la URL pública correcta del archivo
            return $"https://{_bucketName}.s3.{Amazon.RegionEndpoint.USEast2.SystemName}.amazonaws.com/{key}";
        }
    }
}
