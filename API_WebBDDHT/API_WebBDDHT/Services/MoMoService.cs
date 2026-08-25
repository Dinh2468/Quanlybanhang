using System;
using System.Net.Http;
using System.Security.Cryptography;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;
using Microsoft.Extensions.Configuration;

namespace API_WebBDDHT.Services
{
    /// <summary>
    /// Giao diện dịch vụ thanh toán MoMo.
    /// </summary>
    public interface IMoMoService
    {
        /// <summary>
        /// Tạo URL thanh toán MoMo cho một đơn hàng.
        /// </summary>
        /// <param name="orderId">Mã đơn hàng nội bộ.</param>
        /// <param name="amount">Số tiền (đơn vị VND).</param>
        /// <param name="orderInfo">Mô tả đơn hàng.</param>
        /// <returns>URL để chuyển hướng người dùng tới trang thanh toán MoMo.</returns>
        Task<string> CreatePaymentUrlAsync(int orderId, decimal amount, string orderInfo);
    }

    /// <summary>
    /// Triển khai dịch vụ thanh toán MoMo.
    /// </summary>
    public class MoMoService : IMoMoService
    {
        private readonly IConfiguration _configuration;
        private readonly HttpClient _httpClient;

        /// <summary>
        /// Khởi tạo MoMoService với cấu hình và HttpClient.
        /// </summary>
        /// <param name="configuration">Cấu hình ứng dụng, chứa các khóa MoMo.</param>
        /// <param name="httpClient">HttpClient dùng để gọi API MoMo.</param>
        public MoMoService(IConfiguration configuration, HttpClient httpClient)
        {
            _configuration = configuration;
            _httpClient = httpClient;
        }

        /// <summary>
        /// Tạo URL thanh toán MoMo cho một giao dịch.
        /// </summary>
        /// <param name="orderId">Mã đơn hàng nội bộ.</param>
        /// <param name="amount">Số tiền (đơn vị VND).</param>
        /// <param name="orderInfo">Mô tả đơn hàng (được hiển thị trong MoMo).</param>
        /// <returns>URL thanh toán MoMo để chuyển hướng người dùng.</returns>
        public async Task<string> CreatePaymentUrlAsync(int orderId, decimal amount, string orderInfo)
        {
            // Lấy các cấu hình cần thiết từ appsettings
            var partnerCode = _configuration["MoMo:PartnerCode"];
            var accessKey = _configuration["MoMo:AccessKey"];
            var secretKey = _configuration["MoMo:SecretKey"];
            var returnUrl = _configuration["MoMo:ReturnUrl"];
            var ipnUrl = _configuration["MoMo:IpnUrl"];
            var paymentUrl = _configuration["MoMo:PaymentUrl"];

            // Tạo mã đơn hàng duy nhất (orderId + timestamp)
            var orderIdStr = orderId.ToString() + "_" + DateTime.Now.Ticks.ToString();
            var requestId = Guid.NewGuid().ToString();
            var amountStr = amount.ToString("0"); // MoMo yêu cầu không có phần thập phân
            var extraData = "";

            // Tạo chuỗi hash thô theo yêu cầu của MoMo
            var rawHash = "accessKey=" + accessKey +
                          "&amount=" + amountStr +
                          "&extraData=" + extraData +
                          "&ipnUrl=" + ipnUrl +
                          "&orderId=" + orderIdStr +
                          "&orderInfo=" + orderInfo +
                          "&partnerCode=" + partnerCode +
                          "&redirectUrl=" + returnUrl +
                          "&requestId=" + requestId +
                          "&requestType=captureWallet";

            // Ký và tạo chữ ký HMAC SHA256
            var signature = ComputeHmacSha256(rawHash, secretKey);

            // Xây dựng payload gửi tới MoMo
            var message = new
            {
                partnerCode = partnerCode,
                partnerName = "Test",
                storeId = "MomoTestStore",
                requestId = requestId,
                amount = amountStr,
                orderId = orderIdStr,
                orderInfo = orderInfo,
                redirectUrl = returnUrl,
                ipnUrl = ipnUrl,
                lang = "vi",
                extraData = extraData,
                requestType = "captureWallet",
                signature = signature
            };

            var content = new StringContent(JsonSerializer.Serialize(message), Encoding.UTF8, "application/json");

            // Gửi yêu cầu POST tới MoMo
            var response = await _httpClient.PostAsync(paymentUrl, content);
            var responseString = await response.Content.ReadAsStringAsync();
            
            // Phân tích phản hồi JSON để lấy URL thanh toán
            var responseData = JsonSerializer.Deserialize<JsonElement>(responseString);
            if (responseData.TryGetProperty("payUrl", out JsonElement payUrlObj))
            {
                return payUrlObj.GetString();
            }
            
            // Nếu MoMo không trả về payUrl, ném lỗi chi tiết
            throw new Exception("Lỗi tạo URL thanh toán MoMo: " + responseString);
        }

        /// <summary>
        /// Hàm băm HMAC SHA256 để tạo chữ ký bảo mật.
        /// </summary>
        /// <param name="message">Thông điệp cần băm.</param>
        /// <param name="secretKey">Khóa bí mật.</param>
        /// <returns>Chuỗi hex đã được băm.</returns>
        private string ComputeHmacSha256(string message, string secretKey)
        {
            var keyBytes = Encoding.UTF8.GetBytes(secretKey);
            var messageBytes = Encoding.UTF8.GetBytes(message);

            using (var hmacsha256 = new HMACSHA256(keyBytes))
            {
                var hashmessage = hmacsha256.ComputeHash(messageBytes);
                var hex = BitConverter.ToString(hashmessage);
                return hex.Replace("-", "").ToLower();
            }
        }
    }
}
