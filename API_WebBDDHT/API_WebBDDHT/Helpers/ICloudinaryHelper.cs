using CloudinaryDotNet;
using CloudinaryDotNet.Actions;
using Microsoft.AspNetCore.Http;

namespace API_WebBDDHT.Helpers
{
    public interface ICloudinaryHelper
    {
        /// <summary>
        /// Tải hình ảnh lên Cloudinary
        /// </summary>
        /// <param name="file">File ảnh nhận từ client</param>
        /// <param name="folderName">Tên thư mục lưu trữ trên Cloudinary (vd: "LV_avatars", "LV_sanphams")</param>
        /// <param name="transformation">Cấu hình biến đổi ảnh như crop, resize (Tùy chọn)</param>
        /// <returns>Kết quả trả về từ Cloudinary gồm SecureUrl và lỗi nếu có</returns>
        Task<ImageUploadResult> UploadImageAsync(IFormFile file, string folderName, Transformation transformation = null);
    }
}
