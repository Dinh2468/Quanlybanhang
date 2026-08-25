using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using API_WebBDDHT.Data;
using Microsoft.EntityFrameworkCore;

namespace API_WebBDDHT.Services
{
    public class DonDepDonHangService : BackgroundService
    {
        private readonly IServiceProvider _serviceProvider;
        private readonly ILogger<DonDepDonHangService> _logger;

        public DonDepDonHangService(IServiceProvider serviceProvider, ILogger<DonDepDonHangService> logger)
        {
            _serviceProvider = serviceProvider;
            _logger = logger;
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            _logger.LogInformation("Dịch vụ dọn dẹp đơn hàng đang khởi động.");

            while (!stoppingToken.IsCancellationRequested)
            {
                try
                {
                    await DonDepDonHangChuaThanhToanAsync();
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Có lỗi xảy ra khi thực thi Dọn dẹp đơn hàng chưa thanh toán.");
                }

                // Chạy định kỳ mỗi 1 giờ
                await Task.Delay(TimeSpan.FromHours(1), stoppingToken);
            }
            
            _logger.LogInformation("Dịch vụ dọn dẹp đơn hàng đã dừng hoạt động.");
        }

        private async Task DonDepDonHangChuaThanhToanAsync()
        {
            using var scope = _serviceProvider.CreateScope();
            var context = scope.ServiceProvider.GetRequiredService<AppDbContext>();

            var cutoffTime = DateTime.Now.AddHours(-24);

            // Tìm các đơn hàng chờ xử lý, chưa thanh toán, qua 24h, và dùng phương thức thanh toán Online (VnPay hoặc MoMo)
            var donHangChuaThanhToan = await context.DonHangs
                .Include(dh => dh.PhuongThucThanhToan)
                .Include(dh => dh.ChiTietDonHangs)
                    .ThenInclude(ct => ct.SanPham)
                .Where(dh => 
                    dh.TrangThai == "Chờ xử lý" && 
                    dh.TrangThaiThanhToan == "Chưa thanh toán" && 
                    dh.NgayDat < cutoffTime && 
                    dh.PhuongThucThanhToan != null && 
                    (dh.PhuongThucThanhToan.TenPhuongThuc.Contains("VnPay") || dh.PhuongThucThanhToan.TenPhuongThuc.Contains("MoMo"))
                )
                .ToListAsync();

            if (!donHangChuaThanhToan.Any())
            {
                return;
            }

            foreach (var donHang in donHangChuaThanhToan)
            {
                _logger.LogInformation($"Tự động hủy đơn hàng {donHang.MaDH} vì chưa thanh toán sau 24 giờ.");
                
                donHang.TrangThai = "Đã hủy";
                donHang.TrangThaiThanhToan = "Đã hủy";

                // Hoàn lại số lượng tồn kho
                foreach (var chiTiet in donHang.ChiTietDonHangs)
                {
                    if (chiTiet.SanPham != null)
                    {
                        chiTiet.SanPham.SoLuongTon += chiTiet.SoLuong;
                        context.SanPhams.Update(chiTiet.SanPham);
                    }
                }

                context.DonHangs.Update(donHang);
            }

            await context.SaveChangesAsync();
            _logger.LogInformation($"Đã hủy thành công {donHangChuaThanhToan.Count} đơn hàng chưa thanh toán.");
        }
    }
}
