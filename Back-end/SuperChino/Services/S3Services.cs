using Amazon.S3;
using Amazon.S3.Model;
using System.Globalization;
using System.Runtime.InteropServices;

namespace SuperChino.Services
{
    public class S3Services
    {
        private readonly IAmazonS3 _s3Client;
        private readonly string _bucketName;


        public S3Services(IConfiguration configuration)
        {
            _bucketName = configuration["Secrets:AWS:BucketName"];
            var region = Amazon.RegionEndpoint.GetBySystemName(configuration["Secrets:AWS:Region"]);
            _s3Client = new AmazonS3Client(region);
        }

        public async Task<string> UploadFileAsync(IFormFile file)
        {
            var key = Guid.NewGuid().ToString() + Path.GetExtension(file.Name);

            using (var stream = file.OpenReadStream())
            {
                var request = new PutObjectRequest
                {
                    BucketName = _bucketName,
                    Key = key,
                    InputStream = stream,
                    ContentType = file.ContentType,
                    CannedACL = S3CannedACL.PublicRead

                };
                await _s3Client.PutObjectAsync(request);
            }
            return $"https://{_bucketName}.s3.amazonaws.com/{key}";
        }

    }
}
