using System;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;

namespace API_WebBDDHT.Services
{
    /// <summary>
    /// Giao diện dịch vụ thanh toán VnPay.
    /// </summary>
    public interface IVnPayService
    {
        /// <summary>
        /// Tạo URL thanh toán VnPay cho một đơn hàng.
        /// </summary>
        /// <param name="context">HttpContext để lấy địa chỉ IP khách hàng.</param>
        /// <param name="orderId">Mã đơn hàng nội bộ.</param>
        /// <param name="amount">Số tiền (đơn vị VND).</param>
        /// <param name="orderInfo">Mô tả đơn hàng.</param>
        /// <returns>URL thanh toán VnPay để chuyển hướng người dùng.</returns>
        string CreatePaymentUrl(HttpContext context, int orderId, decimal amount, string orderInfo);
    }

    /// <summary>
    /// Triển khai dịch vụ thanh toán VnPay.
    /// </summary>
    public class VnPayService : IVnPayService
    {
        private readonly IConfiguration _configuration;

        public VnPayService(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        /// <summary>
        /// Tạo URL thanh toán VnPay cho một giao dịch.
        /// </summary>
        /// <param name="context">HttpContext để lấy địa chỉ IP.</param>
        /// <param name="orderId">Mã đơn hàng nội bộ.</param>
        /// <param name="amount">Số tiền (VND).</param>
        /// <param name="orderInfo">Mô tả đơn hàng.</param>
        /// <returns>URL thanh toán VnPay.</returns>
        public string CreatePaymentUrl(HttpContext context, int orderId, decimal amount, string orderInfo)
        {
            var timeZoneById = TimeZoneInfo.FindSystemTimeZoneById("SE Asia Standard Time");
            var timeNow = TimeZoneInfo.ConvertTimeFromUtc(DateTime.UtcNow, timeZoneById);

            var pay = new VnPayLibrary();

            pay.AddRequestData("vnp_Version", _configuration["VNPay:Version"]);
            pay.AddRequestData("vnp_Command", _configuration["VNPay:Command"]);
            pay.AddRequestData("vnp_TmnCode", _configuration["VNPay:TmnCode"]);
            pay.AddRequestData("vnp_Amount", ((long)(amount * 100)).ToString()); 
            pay.AddRequestData("vnp_CreateDate", timeNow.ToString("yyyyMMddHHmmss"));
            pay.AddRequestData("vnp_CurrCode", _configuration["VNPay:CurrCode"]);
            // Dùng IP thật hoặc ::1
            var ipAddress = context.Connection.RemoteIpAddress?.ToString();
            if (string.IsNullOrEmpty(ipAddress) || ipAddress == "::1") ipAddress = "127.0.0.1";
            pay.AddRequestData("vnp_IpAddr", ipAddress);
            
            pay.AddRequestData("vnp_Locale", _configuration["VNPay:Locale"]);
            pay.AddRequestData("vnp_OrderInfo", orderInfo);
            pay.AddRequestData("vnp_OrderType", "other");
            
            // ÉP BUỘC Trả về Backend API để verify chữ ký thay vì trả thẳng về Frontend
            pay.AddRequestData("vnp_ReturnUrl", "https://localhost:7224/api/ThanhToan/vnpay-return");
            
            // Dùng Ticks để đảm bảo TxnRef luôn duy nhất trên Sandbox
            pay.AddRequestData("vnp_TxnRef", orderId.ToString() + "_" + DateTime.Now.Ticks.ToString());

            var paymentUrl = pay.CreateRequestUrl(_configuration["VNPay:BaseUrl"], _configuration["VNPay:HashSecret"]);

            return paymentUrl;
        }
    }
}
