using CloudinaryDotNet;
using CloudinaryDotNet.Actions;

namespace API_WebBDDHT.Helpers
{
    public class CloudinaryHelper : ICloudinaryHelper
    {
        private readonly Cloudinary _cloudinary;
        public CloudinaryHelper(IConfiguration configuration)
        {
            // Đọc cấu hình từ appsettings.json
            var cloudName = configuration["CloudinarySettings:CloudName"];
            var apiKey = configuration["CloudinarySettings:ApiKey"];
            var apiSecret = configuration["CloudinarySettings:ApiSecret"];
            // Khởi tạo tài khoản Cloudinary
            var account = new Account(cloudName, apiKey, apiSecret);
            _cloudinary = new Cloudinary(account);
        }
        public async Task<ImageUploadResult> UploadImageAsync(IFormFile file, string folderName, Transformation transformation = null)
        {
            if (file == null || file.Length == 0)
            {
                return null;
            }
            // Khởi tạo luồng đọc file dữ liệu từ client
            using var stream = file.OpenReadStream();
            var uploadParams = new ImageUploadParams()
            {
                File = new FileDescription(file.FileName, stream),
                Folder = folderName,
                Transformation = transformation
            };
            // Thực hiện tải ảnh lên Cloudinary bất đồng bộ
            return await _cloudinary.UploadAsync(uploadParams);
        }
    }
}
