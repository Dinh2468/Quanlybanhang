using API_WebBDDHT.Data;
using API_WebBDDHT.DTOs;
using API_WebBDDHT.DTOs.Admin;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API_WebBDDHT.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize] 
    public class KhachHangController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IMapper _mapper;

        public KhachHangController(AppDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll(
            [FromQuery] string? search = null,
            [FromQuery] string? hangThanhVien = null,
            [FromQuery] int page = 1, 
            [FromQuery] int pageSize = 20)
        {
            var query = _context.KhachHangs
                .Include(kh => kh.TaiKhoan)       // Nạp thông tin tài khoản liên kết để lấy Username/Email
                .Include(kh => kh.HangKhachHang)  // Nạp thông tin hạng thành viên (Đồng, Bạc, Vàng)
                .AsQueryable();

            if (!string.IsNullOrEmpty(search))
            {
                query = query.Where(kh => kh.HoTen.Contains(search) || 
                                          kh.TaiKhoan.TenDangNhap.Contains(search) || 
                                          kh.TaiKhoan.Email.Contains(search) || 
                                          kh.SDT.Contains(search));
            }

            if (!string.IsNullOrEmpty(hangThanhVien))
            {
                query = query.Where(kh => kh.HangKhachHang != null && kh.HangKhachHang.TenHang == hangThanhVien);
            }

            var totalCount = await query.CountAsync();
            var totalPages = (int)Math.Ceiling((double)totalCount / pageSize);

            var khachHangs = await query
                .OrderByDescending(x => x.MaKH)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            var items = _mapper.Map<IEnumerable<AdminKhachHangDto>>(khachHangs);

            var result = new PagedResult<AdminKhachHangDto>
            {
                TotalCount = totalCount,
                TotalPages = totalPages,
                Items = items
            };

            return Ok(result);
        }

        [HttpGet("admin/chitiet/{id}")]
        [Authorize(Roles = "Admin, NhanVien")]
        public async Task<IActionResult> GetChiTiet(int id)
        {
            var khachHang = await _context.KhachHangs
                .Include(kh => kh.TaiKhoan)
                .Include(kh => kh.HangKhachHang)
                .FirstOrDefaultAsync(kh => kh.MaKH == id);

            if (khachHang == null) return NotFound(new { message = "Không tìm thấy khách hàng" });

            var donHangs = await _context.DonHangs
                .Include(dh => dh.PhuongThucThanhToan)
                .Where(dh => dh.MaKH == id)
                .ToListAsync();

            var result = new AdminChiTietKhachHangDto
            {
                MaKH = khachHang.MaKH,
                HoTen = khachHang.HoTen,
                SDT = khachHang.SDT,
                DiaChi = khachHang.DiaChi,
                MaTK = khachHang.MaTK,
                TenDangNhap = khachHang.TaiKhoan?.TenDangNhap,
                Email = khachHang.TaiKhoan?.Email,
                DiemTichLuy = khachHang.DiemTichLuy,
                MaHang = khachHang.MaHang,
                TenHangThanhVien = khachHang.HangKhachHang?.TenHang,
                Avatar = khachHang.TaiKhoan?.Avatar,
                LichSuDonHangs = donHangs.Select(dh => new AdminDonHangDto
                {
                    MaDH = dh.MaDH,
                    MaKH = dh.MaKH,
                    HoTenNguoiNhan = dh.HoTenNguoiNhan,
                    SDTNguoiNhan = dh.SDTNguoiNhan,
                    NgayDat = dh.NgayDat,
                    TrangThai = dh.TrangThai,
                    TongTien = dh.TongTien,
                    DiaChiGiaoHang = dh.DiaChiGiaoHang,
                    TenPhuongThucThanhToan = dh.PhuongThucThanhToan?.TenPhuongThuc,
                    TrangThaiThanhToan = dh.TrangThaiThanhToan,
                    MaGiaoDichNgoai = dh.MaGiaoDichNgoai
                }).OrderByDescending(dh => dh.MaDH).ToList()
            };

            return Ok(result);
        }

        [HttpPut("admin/toggle-lock/{id}")]
        [Authorize(Roles = "Admin, NhanVien")]
        public async Task<IActionResult> ToggleLock(int id)
        {
            var khachHang = await _context.KhachHangs
                .Include(kh => kh.TaiKhoan)
                .FirstOrDefaultAsync(kh => kh.MaKH == id);

            if (khachHang == null || khachHang.TaiKhoan == null)
            {
                return NotFound(new { message = "Không tìm thấy khách hàng hoặc tài khoản" });
            }

            // Đảo ngược trạng thái hoạt động
            khachHang.TaiKhoan.TrangThai = !khachHang.TaiKhoan.TrangThai;
            
            await _context.SaveChangesAsync();

            return Ok(new { message = khachHang.TaiKhoan.TrangThai ? "Đã mở khóa tài khoản thành công" : "Đã khóa tài khoản thành công" });
        }
    }
}
