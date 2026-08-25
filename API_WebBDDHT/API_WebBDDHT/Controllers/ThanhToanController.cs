using System;
using System.Linq;
using System.Threading.Tasks;
using API_WebBDDHT.Data;
using API_WebBDDHT.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;

namespace API_WebBDDHT.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ThanhToanController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IConfiguration _configuration;

        public ThanhToanController(AppDbContext context, IConfiguration configuration)
        {
            _context = context;
            _configuration = configuration;
        }

        [HttpGet("vnpay-return")]
        public async Task<IActionResult> VnPayReturn()
        {
            try
            {
                var queryCollection = Request.Query;
                var vnp_HashSecret = _configuration["VNPay:HashSecret"];
                
                var pay = new VnPayLibrary();
                foreach (var (key, value) in queryCollection)
                {
                    if (!string.IsNullOrEmpty(key) && key.StartsWith("vnp_"))
                    {
                        pay.AddResponseData(key, value.ToString());
                    }
                }

                // vnp_TxnRef có dạng {orderId}_{ticks}
                var txnRef = pay.GetResponseData("vnp_TxnRef");
                var vnp_orderId = Convert.ToInt32(txnRef.Split('_')[0]);
                var vnp_TransactionId = pay.GetResponseData("vnp_TransactionNo");
                var vnp_SecureHash = Request.Query["vnp_SecureHash"].ToString();
                var vnp_ResponseCode = pay.GetResponseData("vnp_ResponseCode");

                var checkSignature = pay.ValidateSignature(vnp_SecureHash, vnp_HashSecret);

                if (!checkSignature)
                {
                    return Redirect("http://localhost:5173/hoantat?status=error&message=InvalidSignature");
                }

                if (vnp_ResponseCode == "00")
                {
                    // Thanh toan thanh cong
                    var donHang = await _context.DonHangs.FindAsync(vnp_orderId);
                    if (donHang != null)
                    {
                        donHang.TrangThaiThanhToan = "Đã thanh toán";
                        await _context.SaveChangesAsync();
                    }
                    return Redirect($"http://localhost:5173/hoantat?status=success&orderId={vnp_orderId}");
                }
                else
                {
                    // Thanh toan that bai hoac bi huy
                    return Redirect($"http://localhost:5173/hoantat?status=failed&orderId={vnp_orderId}");
                }
            }
            catch (Exception ex)
            {
                return Redirect($"http://localhost:5173/hoantat?status=error&message={ex.Message}");
            }
        }

        [HttpGet("momo-return")]
        public async Task<IActionResult> MoMoReturn()
        {
            try
            {
                var query = Request.Query;
                var partnerCode = query["partnerCode"].ToString();
                var orderIdStr = query["orderId"].ToString();
                var requestId = query["requestId"].ToString();
                var amount = query["amount"].ToString();
                var orderInfo = query["orderInfo"].ToString();
                var orderType = query["orderType"].ToString();
                var transId = query["transId"].ToString();
                var resultCode = query["resultCode"].ToString();
                var message = query["message"].ToString();
                var payType = query["payType"].ToString();
                var responseTime = query["responseTime"].ToString();
                var extraData = query["extraData"].ToString();
                var signature = query["signature"].ToString();

                var secretKey = _configuration["MoMo:SecretKey"];
                var accessKey = _configuration["MoMo:AccessKey"];

                var rawHash = "accessKey=" + accessKey +
                              "&amount=" + amount +
                              "&extraData=" + extraData +
                              "&message=" + message +
                              "&orderId=" + orderIdStr +
                              "&orderInfo=" + orderInfo +
                              "&orderType=" + orderType +
                              "&partnerCode=" + partnerCode +
                              "&payType=" + payType +
                              "&requestId=" + requestId +
                              "&responseTime=" + responseTime +
                              "&resultCode=" + resultCode +
                              "&transId=" + transId;

                var expectedSignature = ComputeHmacSha256(rawHash, secretKey);

                if (signature != expectedSignature)
                {
                    return Redirect("http://localhost:5173/hoantat?status=error&message=InvalidSignature");
                }

                // orderIdStr co dang "{realOrderId}_{ticks}"
                var realOrderId = int.Parse(orderIdStr.Split('_')[0]);

                if (resultCode == "0")
                {
                    // Thanh toan thanh cong
                    var donHang = await _context.DonHangs.FindAsync(realOrderId);
                    if (donHang != null)
                    {
                        donHang.TrangThaiThanhToan = "Đã thanh toán";
                        await _context.SaveChangesAsync();
                    }
                    return Redirect($"http://localhost:5173/hoantat?status=success&orderId={realOrderId}");
                }
                else
                {
                    // That bai
                    return Redirect($"http://localhost:5173/hoantat?status=failed&orderId={realOrderId}");
                }
            }
            catch (Exception ex)
            {
                return Redirect($"http://localhost:5173/hoantat?status=error&message={ex.Message}");
            }
        }
        
        [HttpPost("momo-return")] // IPN Endpoint for MoMo
        public async Task<IActionResult> MoMoIpn()
        {
            // Để đơn giản đồ án, callback URL GET ở trên đã xử lý cập nhật trạng thái rồi
            return NoContent();
        }

        private string ComputeHmacSha256(string message, string secretKey)
        {
            var keyBytes = System.Text.Encoding.UTF8.GetBytes(secretKey);
            var messageBytes = System.Text.Encoding.UTF8.GetBytes(message);

            using (var hmacsha256 = new System.Security.Cryptography.HMACSHA256(keyBytes))
            {
                var hashmessage = hmacsha256.ComputeHash(messageBytes);
                var hex = BitConverter.ToString(hashmessage);
                return hex.Replace("-", "").ToLower();
            }
        }
    }
}
