using API_WebBDDHT.Data;
using API_WebBDDHT.DTOs.Admin;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API_WebBDDHT.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(Roles = "Admin, NhanVien")]
    public class ThongKeController : ControllerBase
    {
        private readonly AppDbContext _context;

        public ThongKeController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet("tongquan")]
        public async Task<IActionResult> GetTongQuan()
        {
            // Doanh thu chỉ tính đơn hàng thành công, hoàn thành, đã giao
            var completedOrders = await _context.DonHangs
                .Where(o => o.TrangThai == "Thành công" || o.TrangThai == "Hoàn thành" || o.TrangThai == "Đã giao")
                .ToListAsync();

            decimal revenue = completedOrders.Sum(o => o.TongTien ?? 0);
            int ordersCount = completedOrders.Count;
            int productsCount = await _context.SanPhams.CountAsync();
            int customersCount = await _context.KhachHangs.CountAsync();

            var recentOrders = await _context.DonHangs
                .Include(d => d.PhuongThucThanhToan)
                .OrderByDescending(d => d.NgayDat)
                .Take(5)
                .Select(dh => new AdminDonHangDto
                {
                    MaDH = dh.MaDH,
                    MaKH = dh.MaKH,
                    HoTenNguoiNhan = dh.HoTenNguoiNhan,
                    SDTNguoiNhan = dh.SDTNguoiNhan,
                    NgayDat = dh.NgayDat,
                    TrangThai = dh.TrangThai,
                    TongTien = dh.TongTien,
                    DiaChiGiaoHang = dh.DiaChiGiaoHang,
                    TenPhuongThucThanhToan = dh.PhuongThucThanhToan.TenPhuongThuc,
                    TrangThaiThanhToan = dh.TrangThaiThanhToan,
                    MaGiaoDichNgoai = dh.MaGiaoDichNgoai
                })
                .ToListAsync();

            return Ok(new ThongKeTongQuanDto
            {
                Revenue = revenue,
                OrdersCount = ordersCount,
                ProductsCount = productsCount,
                CustomersCount = customersCount,
                RecentOrders = recentOrders
            });
        }

        [HttpGet("doanhthu")]
        public async Task<IActionResult> GetDoanhThu(
            [FromQuery] string range = "7days", 
            [FromQuery] int? month = null, 
            [FromQuery] int? year = null, 
            [FromQuery] DateTime? startDate = null, 
            [FromQuery] DateTime? endDate = null)
        {
            var today = DateTime.Now.Date;
            var completedOrders = await _context.DonHangs
                .Where(o => o.TrangThai == "Thành công" || o.TrangThai == "Hoàn thành" || o.TrangThai == "Đã giao")
                .ToListAsync();

            var completedImports = await _context.NhapHangs
                .Where(n => n.TrangThai == "Hoàn thành")
                .ToListAsync();

            var chartData = new List<ThongKeDoanhThuDto>();

            if (range == "7days")
            {
                for (int i = 6; i >= 0; i--)
                {
                    var date = today.AddDays(-i);
                    decimal doanhThu = completedOrders.Where(o => o.NgayDat.HasValue && o.NgayDat.Value.Date == date).Sum(o => o.TongTien ?? 0);
                    int soDonHang = completedOrders.Count(o => o.NgayDat.HasValue && o.NgayDat.Value.Date == date);
                    decimal von = completedImports.Where(n => n.NgayNhap.HasValue && n.NgayNhap.Value.Date == date).Sum(n => n.TongTien ?? 0);
                    chartData.Add(new ThongKeDoanhThuDto { Label = $"{date.Day}/{date.Month}", DoanhThu = doanhThu, Von = von, LoiNhuan = doanhThu - von, SoDonHang = soDonHang });
                }
            }
            else if (range == "1month")
            {
                int currentMonth = today.Month;
                int currentYear = today.Year;
                int daysInMonth = DateTime.DaysInMonth(currentYear, currentMonth);

                for (int i = 1; i <= daysInMonth; i++)
                {
                    decimal doanhThu = completedOrders.Where(o => o.NgayDat.HasValue && o.NgayDat.Value.Year == currentYear && o.NgayDat.Value.Month == currentMonth && o.NgayDat.Value.Day == i).Sum(o => o.TongTien ?? 0);
                    int soDonHang = completedOrders.Count(o => o.NgayDat.HasValue && o.NgayDat.Value.Year == currentYear && o.NgayDat.Value.Month == currentMonth && o.NgayDat.Value.Day == i);
                    decimal von = completedImports.Where(n => n.NgayNhap.HasValue && n.NgayNhap.Value.Year == currentYear && n.NgayNhap.Value.Month == currentMonth && n.NgayNhap.Value.Day == i).Sum(n => n.TongTien ?? 0);
                    chartData.Add(new ThongKeDoanhThuDto { Label = i.ToString(), DoanhThu = doanhThu, Von = von, LoiNhuan = doanhThu - von, SoDonHang = soDonHang });
                }
            }
            else if (range == "this_week")
            {
                int diff = (7 + (today.DayOfWeek - DayOfWeek.Monday)) % 7;
                var startOfWeek = today.AddDays(-1 * diff).Date;
                var names = new[] { "T2", "T3", "T4", "T5", "T6", "T7", "CN" };
                for (int i = 0; i < 7; i++)
                {
                    var date = startOfWeek.AddDays(i);
                    decimal doanhThu = completedOrders.Where(o => o.NgayDat.HasValue && o.NgayDat.Value.Date == date).Sum(o => o.TongTien ?? 0);
                    int soDonHang = completedOrders.Count(o => o.NgayDat.HasValue && o.NgayDat.Value.Date == date);
                    decimal von = completedImports.Where(n => n.NgayNhap.HasValue && n.NgayNhap.Value.Date == date).Sum(n => n.TongTien ?? 0);
                    chartData.Add(new ThongKeDoanhThuDto { Label = names[i], DoanhThu = doanhThu, Von = von, LoiNhuan = doanhThu - von, SoDonHang = soDonHang });
                }
            }
            else if (range == "by_month")
            {
                int targetMonth = month ?? today.Month;
                int targetYear = year ?? today.Year;
                int daysInMonth = DateTime.DaysInMonth(targetYear, targetMonth);

                for (int i = 1; i <= daysInMonth; i++)
                {
                    decimal doanhThu = completedOrders.Where(o => o.NgayDat.HasValue && o.NgayDat.Value.Year == targetYear && o.NgayDat.Value.Month == targetMonth && o.NgayDat.Value.Day == i).Sum(o => o.TongTien ?? 0);
                    int soDonHang = completedOrders.Count(o => o.NgayDat.HasValue && o.NgayDat.Value.Year == targetYear && o.NgayDat.Value.Month == targetMonth && o.NgayDat.Value.Day == i);
                    decimal von = completedImports.Where(n => n.NgayNhap.HasValue && n.NgayNhap.Value.Year == targetYear && n.NgayNhap.Value.Month == targetMonth && n.NgayNhap.Value.Day == i).Sum(n => n.TongTien ?? 0);
                    chartData.Add(new ThongKeDoanhThuDto { Label = $"{i}/{targetMonth}", DoanhThu = doanhThu, Von = von, LoiNhuan = doanhThu - von, SoDonHang = soDonHang });
                }
            }
            else if (range == "by_year")
            {
                int targetYear = year ?? today.Year;
                for (int i = 1; i <= 12; i++)
                {
                    decimal doanhThu = completedOrders.Where(o => o.NgayDat.HasValue && o.NgayDat.Value.Year == targetYear && o.NgayDat.Value.Month == i).Sum(o => o.TongTien ?? 0);
                    int soDonHang = completedOrders.Count(o => o.NgayDat.HasValue && o.NgayDat.Value.Year == targetYear && o.NgayDat.Value.Month == i);
                    decimal von = completedImports.Where(n => n.NgayNhap.HasValue && n.NgayNhap.Value.Year == targetYear && n.NgayNhap.Value.Month == i).Sum(n => n.TongTien ?? 0);
                    chartData.Add(new ThongKeDoanhThuDto { Label = $"T{i}", DoanhThu = doanhThu, Von = von, LoiNhuan = doanhThu - von, SoDonHang = soDonHang });
                }
            }
            else if (range == "custom" && startDate.HasValue && endDate.HasValue)
            {
                var start = startDate.Value.Date;
                var end = endDate.Value.Date;
                if (end < start) { var temp = start; start = end; end = temp; }
                
                int maxDays = 31;
                if ((end - start).TotalDays > maxDays)
                {
                    start = end.AddDays(-maxDays);
                }

                for (var date = start; date <= end; date = date.AddDays(1))
                {
                    decimal doanhThu = completedOrders.Where(o => o.NgayDat.HasValue && o.NgayDat.Value.Date == date).Sum(o => o.TongTien ?? 0);
                    int soDonHang = completedOrders.Count(o => o.NgayDat.HasValue && o.NgayDat.Value.Date == date);
                    decimal von = completedImports.Where(n => n.NgayNhap.HasValue && n.NgayNhap.Value.Date == date).Sum(n => n.TongTien ?? 0);
                    chartData.Add(new ThongKeDoanhThuDto { Label = $"{date.Day}/{date.Month}", DoanhThu = doanhThu, Von = von, LoiNhuan = doanhThu - von, SoDonHang = soDonHang });
                }
            }

            return Ok(chartData);
        }

        [HttpGet("danhmuc")]
        public async Task<IActionResult> GetDanhMuc()
        {
            var defaultColors = new[] { "#ec4899", "#eab308", "#22c55e", "#3b82f6", "#a855f7", "#f97316", "#14b8a6" };
            
            var categories = await _context.LoaiSps.ToListAsync();
            var products = await _context.SanPhams.ToListAsync();

            var totalProducts = products.Count;
            if (totalProducts == 0) return Ok(new List<ThongKeDanhMucDto>());

            var result = new List<ThongKeDanhMucDto>();
            int idx = 0;

            foreach (var cat in categories)
            {
                int count = products.Count(p => p.MaLoai == cat.MaLoaiSP);
                if (count > 0)
                {
                    result.Add(new ThongKeDanhMucDto
                    {
                        Name = cat.TenLoai,
                        Count = count,
                        Percentage = (int)Math.Round((double)count / totalProducts * 100),
                        Color = defaultColors[idx % defaultColors.Length]
                    });
                    idx++;
                }
            }

            return Ok(result);
        }

        [HttpGet("banchay")]
        public async Task<IActionResult> GetBanChay(
            [FromQuery] string range = "this_week", 
            [FromQuery] int? month = null, 
            [FromQuery] int? year = null, 
            [FromQuery] DateTime? startDate = null, 
            [FromQuery] DateTime? endDate = null)
        {
            var query = _context.ChiTietDonHangs
                .Include(ct => ct.DonHang)
                .Include(ct => ct.SanPham)
                .Where(ct => ct.DonHang.TrangThai == "Thành công" || ct.DonHang.TrangThai == "Hoàn thành" || ct.DonHang.TrangThai == "Đã giao")
                .AsQueryable();

            var today = DateTime.Now.Date;

            if (range == "this_week")
            {
                int diff = (7 + (today.DayOfWeek - DayOfWeek.Monday)) % 7;
                var startOfWeek = today.AddDays(-1 * diff).Date;
                var endOfWeek = startOfWeek.AddDays(6).Date;
                query = query.Where(ct => ct.DonHang.NgayDat >= startOfWeek && ct.DonHang.NgayDat <= endOfWeek);
            }
            else if (range == "by_month")
            {
                int targetMonth = month ?? today.Month;
                int targetYear = year ?? today.Year;
                query = query.Where(ct => ct.DonHang.NgayDat.HasValue && ct.DonHang.NgayDat.Value.Month == targetMonth && ct.DonHang.NgayDat.Value.Year == targetYear);
            }
            else if (range == "by_year")
            {
                int targetYear = year ?? today.Year;
                query = query.Where(ct => ct.DonHang.NgayDat.HasValue && ct.DonHang.NgayDat.Value.Year == targetYear);
            }
            else if (range == "custom" && startDate.HasValue && endDate.HasValue)
            {
                var start = startDate.Value.Date;
                var end = endDate.Value.Date;
                if (end < start) { var temp = start; start = end; end = temp; }
                
                // Add 1 day to end to include the entire end date (if it's a date without time)
                var endOfDay = end.AddDays(1).AddTicks(-1);
                query = query.Where(ct => ct.DonHang.NgayDat >= start && ct.DonHang.NgayDat <= endOfDay);
            }

            var topProducts = await query
                .GroupBy(ct => new { ct.MaSP, ct.SanPham.TenSP, ct.SanPham.HinhAnh, ct.SanPham.Gia, ct.SanPham.SoLuongTon })
                .Select(g => new
                {
                    MaSP = g.Key.MaSP,
                    TenSP = g.Key.TenSP,
                    HinhAnh = g.Key.HinhAnh,
                    Gia = g.Key.Gia,
                    SoLuongTon = g.Key.SoLuongTon,
                    SoLuongBan = g.Sum(x => x.SoLuong)
                })
                .OrderByDescending(p => p.SoLuongBan)
                .Take(5)
                .ToListAsync();

            return Ok(topProducts);
        }

        [HttpGet("saphet")]
        public async Task<IActionResult> GetSapHet([FromQuery] int threshold = 10)
        {
            var lowStock = await _context.SanPhams
                .Include(p => p.LoaiSP)
                .Where(p => p.SoLuongTon < threshold)
                .Select(p => new
                {
                    MaSP = p.MaSP,
                    TenSP = p.TenSP,
                    HinhAnh = p.HinhAnh,
                    Gia = p.Gia,
                    SoLuongTon = p.SoLuongTon,
                    TenLoai = p.LoaiSP != null ? p.LoaiSP.TenLoai : "Khác"
                })
                .OrderBy(p => p.SoLuongTon)
                .ToListAsync();

            return Ok(lowStock);
        }

        [HttpGet("bancham")]
        public async Task<IActionResult> GetSanPhamItDuocBan()
        {
            var bottomProducts = await _context.SanPhams
                .GroupJoin(
                    _context.ChiTietDonHangs,
                    sp => sp.MaSP,
                    ct => ct.MaSP,
                     (sp, chiTietGroup) => new
                     {
                         MaSP = sp.MaSP,
                         TenSP = sp.TenSP,
                         HinhAnh = sp.HinhAnh,
                         Gia = sp.Gia,
                         SoLuongTon = sp.SoLuongTon,
                         SoLuongBan = chiTietGroup.Sum(ct => (int?) ct.SoLuong) ?? 0
                     })
                .OrderBy(p => p.SoLuongBan)
                .Take(5)
                .ToListAsync();
            return Ok(bottomProducts);
        }
    }
}
