using API_WebBDDHT.DTOs.DonHang;
using API_WebBDDHT.DTOs.Common;
using API_WebBDDHT.Entities;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using API_WebBDDHT.Data;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;

namespace API_WebBDDHT.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class GioHangController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IMapper _mapper;

        public GioHangController(AppDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }
  
        [HttpGet]
        public async Task<IActionResult> GetGioHang([FromQuery] string? cartToken)
        {
            GioHang? gioHang = null;

            // Nếu người dùng ĐÃ ĐĂNG NHẬP (Có JWT Token)
            if (User.Identity?.IsAuthenticated == true)
            {
                var maTkStr = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                if (int.TryParse(maTkStr, out int maTK))
                {
                    var khachHang = await _context.KhachHangs
                        .Include(kh => kh.HangKhachHang)
                        .FirstOrDefaultAsync(kh => kh.MaTK == maTK);
                    if (khachHang != null)
                    {
                        gioHang = await _context.GioHangs
                            .Include(gh => gh.ChiTietGioHangs).ThenInclude(ct => ct.SanPham)
                            .FirstOrDefaultAsync(gh => gh.MaKH == khachHang.MaKH);
                    }
                }
            }
            // Nếu CHƯA ĐĂNG NHẬP -> Quét trực tiếp theo cột CartToken mới tạo dưới DB
            else if (!string.IsNullOrEmpty(cartToken))
            {
                gioHang = await _context.GioHangs
                    .Include(gh => gh.ChiTietGioHangs).ThenInclude(ct => ct.SanPham)
                    .FirstOrDefaultAsync(gh => gh.CartToken == cartToken && gh.MaKH == null);
            }

            if (gioHang == null)
            {
                return Ok(new GioHangDto { DanhSachSanPham = new List<SanPhamLineItemDto>() });
            }

            var result = _mapper.Map<GioHangDto>(gioHang);

            // Tính toán Giảm giá VIP trên tổng giỏ hàng
            if (User.Identity?.IsAuthenticated == true)
            {
                var maTkStr = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                if (int.TryParse(maTkStr, out int maTK))
                {
                    var khachHang = await _context.KhachHangs
                        .Include(kh => kh.HangKhachHang)
                        .FirstOrDefaultAsync(kh => kh.MaTK == maTK);
                    
                    if (khachHang != null && khachHang.HangKhachHang != null)
                    {
                        result.PhanTramVIP = khachHang.HangKhachHang.PhanTramUuDai;
                        result.GiamGiaVIP = result.TongTien * (khachHang.HangKhachHang.PhanTramUuDai / 100m);
                    }
                }
            }
            
            result.TongTienCuoiCung = result.TongTien - result.GiamGiaVIP;

            return Ok(result);
        }

        [HttpPost("them")]
        public async Task<IActionResult> ThemVaoGioHang([FromBody] ThemGioHangDto request)
        {
            if (request == null || request.SoLuong <= 0)
            {
                return BadRequest(new { message = "Số lượng sản phẩm không hợp lệ" });
            }

            // if (request.SoLuong > 1)
            // {
            //     return BadRequest(new { message = "Mỗi khách hàng chỉ được phép mua tối đa 1 sản phẩm cho mỗi loại!" });
            // }

            var sanPham = await _context.SanPhams
                .Include(sp => sp.KhuyenMais)
                .FirstOrDefaultAsync(sp => sp.MaSP == request.MaSP);
            if (sanPham == null) return NotFound(new { message = "Sản phẩm không tồn tại" });
            if (sanPham.SoLuongTon < request.SoLuong)
            {
                return BadRequest(new { message = $"Sản phẩm chỉ còn {sanPham.SoLuongTon} món trong kho" });
            }

            int? maKH = null;

            if (User.Identity?.IsAuthenticated == true)
            {
                var maTkStr = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                if (int.TryParse(maTkStr, out int maTK))
                {
                    var khachHang = await _context.KhachHangs.FirstOrDefaultAsync(kh => kh.MaTK == maTK);
                    if (khachHang != null) maKH = khachHang.MaKH;
                }
            }

            using var transaction = await _context.Database.BeginTransactionAsync();
            try
            {
                GioHang? gioHang = null;

                if (maKH.HasValue)
                {
                    gioHang = await _context.GioHangs.FirstOrDefaultAsync(gh => gh.MaKH == maKH);
                }
                else if (!string.IsNullOrEmpty(request.CartToken))
                {
                    // Quét tìm giỏ hàng vãng lai khớp mã Token lưu dưới DB
                    gioHang = await _context.GioHangs.FirstOrDefaultAsync(gh => gh.CartToken == request.CartToken && gh.MaKH == null);
                }

                // Nếu chưa tồn tại giỏ hàng nào thì tạo mới
                if (gioHang == null)
                {
                    gioHang = new GioHang
                    {
                        MaKH = maKH,
                        CartToken = maKH.HasValue ? null : request.CartToken, // Lưu token nếu là khách vãng lai
                        NgayCapNhat = DateTime.Now,
                        TongTien = 0
                    };
                    _context.GioHangs.Add(gioHang);
                    await _context.SaveChangesAsync();
                }

                var chiTiet = await _context.ChiTietGioHangs
                    .FirstOrDefaultAsync(ct => ct.MaGH == gioHang.MaGH && ct.MaSP == request.MaSP);

                // Lấy giá ưu đãi nếu có
                var activeKM = sanPham.KhuyenMais.Where(km => km.NgayBatDau <= DateTime.Now && km.NgayKetThuc >= DateTime.Now).OrderByDescending(km => km.PhanTramGiam).FirstOrDefault();
                decimal giaHienTai = sanPham.Gia ?? 0;
                if (activeKM != null && activeKM.PhanTramGiam.HasValue)
                {
                    giaHienTai = giaHienTai * (1m - (decimal)activeKM.PhanTramGiam.Value / 100m);
                }

                if (chiTiet != null)
                {
                    if (sanPham.SoLuongTon < (chiTiet.SoLuong + request.SoLuong))
                    {
                        return BadRequest(new { message = "Tổng số lượng vượt quá khả năng cung ứng của kho hàng" });
                    }
                    chiTiet.SoLuong += request.SoLuong;
                    chiTiet.DonGia = giaHienTai;
                    _context.ChiTietGioHangs.Update(chiTiet);
                }
                else
                {
                    chiTiet = new ChiTietGioHang
                    {
                        MaGH = gioHang.MaGH,
                        MaSP = request.MaSP,
                        SoLuong = request.SoLuong,
                        DonGia = giaHienTai
                    };
                    _context.ChiTietGioHangs.Add(chiTiet);
                }
                await _context.SaveChangesAsync();

                var tatCaChiTiet = await _context.ChiTietGioHangs.Where(ct => ct.MaGH == gioHang.MaGH).ToListAsync();
                gioHang.TongTien = tatCaChiTiet.Sum(ct => (ct.SoLuong ?? 0) * (ct.DonGia ?? 0));
                gioHang.NgayCapNhat = DateTime.Now;

                _context.GioHangs.Update(gioHang);
                await _context.SaveChangesAsync();

                await transaction.CommitAsync();

                return Ok(new { message = "Đã thêm vào giỏ hàng thành công!", tongTienGioHang = gioHang.TongTien });
            }
            catch (Exception ex)
            {
                await transaction.RollbackAsync();
                return StatusCode(500, new { message = "Đã xảy ra lỗi hệ thống", detail = ex.Message });
            }
        }

        [HttpPut("capnhat")]
        public async Task<IActionResult> CapNhatSoLuong([FromBody] CapNhatGioHangDto request, [FromQuery] string? cartToken)
        {
            if (request == null || request.SoLuong <= 0)
            {
                return BadRequest(new { message = "Số lượng sản phẩm phải lớn hơn 0" });
            }

            GioHang? gioHang = null;

            if (User.Identity?.IsAuthenticated == true)
            {
                var maTkStr = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                if (int.TryParse(maTkStr, out int maTK))
                {
                    var khachHang = await _context.KhachHangs.FirstOrDefaultAsync(kh => kh.MaTK == maTK);
                    if (khachHang != null)
                    {
                        gioHang = await _context.GioHangs.FirstOrDefaultAsync(gh => gh.MaKH == khachHang.MaKH);
                    }
                }
            }
            else if (!string.IsNullOrEmpty(cartToken))
            {
                gioHang = await _context.GioHangs.FirstOrDefaultAsync(gh => gh.CartToken == cartToken && gh.MaKH == null);
            }

            if (gioHang == null)
            {
                return NotFound(new { message = "Không tìm thấy giỏ hàng tương ứng" });
            }

            var chiTiet = await _context.ChiTietGioHangs
                .FirstOrDefaultAsync(ct => ct.MaGH == gioHang.MaGH && ct.MaSP == request.MaSP);

            if (chiTiet == null)
            {
                return NotFound(new { message = "Sản phẩm không tồn tại trong giỏ hàng" });
            }

            var sanPham = await _context.SanPhams
                .Include(sp => sp.KhuyenMais)
                .FirstOrDefaultAsync(sp => sp.MaSP == request.MaSP);
            if (sanPham == null) return NotFound(new { message = "Sản phẩm không tồn tại" });
            if (sanPham.SoLuongTon < request.SoLuong)
            {
                return BadRequest(new { message = $"Sản phẩm chỉ còn tồn kho {sanPham.SoLuongTon} món" });
            }

            using var transaction = await _context.Database.BeginTransactionAsync();
            try
            {
                var activeKM = sanPham.KhuyenMais.Where(km => km.NgayBatDau <= DateTime.Now && km.NgayKetThuc >= DateTime.Now).OrderByDescending(km => km.PhanTramGiam).FirstOrDefault();
                decimal giaHienTai = sanPham.Gia ?? 0;
                if (activeKM != null && activeKM.PhanTramGiam.HasValue)
                {
                    giaHienTai = giaHienTai * (1m - (decimal)activeKM.PhanTramGiam.Value / 100m);
                }

                chiTiet.SoLuong = request.SoLuong;
                chiTiet.DonGia = giaHienTai;
                _context.ChiTietGioHangs.Update(chiTiet);
                await _context.SaveChangesAsync();

                var tatCaChiTiet = await _context.ChiTietGioHangs.Where(ct => ct.MaGH == gioHang.MaGH).ToListAsync();
                gioHang.TongTien = tatCaChiTiet.Sum(ct => (ct.SoLuong ?? 0) * (ct.DonGia ?? 0));
                gioHang.NgayCapNhat = DateTime.Now;

                _context.GioHangs.Update(gioHang);
                await _context.SaveChangesAsync();

                await transaction.CommitAsync();

                return Ok(new { message = "Cập nhật số lượng giỏ hàng thành công!", tongTienMoi = gioHang.TongTien });
            }
            catch (Exception ex)
            {
                await transaction.RollbackAsync();
                return StatusCode(500, new { message = "Lỗi hệ thống khi cập nhật", detail = ex.Message });
            }
        }

        [HttpDelete("xoa/{maSP}")]
        public async Task<IActionResult> XoaSanPhamKhoiGio(int maSP, [FromQuery] string? cartToken)
        {
            GioHang? gioHang = null;

            if (User.Identity?.IsAuthenticated == true)
            {
                var maTkStr = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                if (int.TryParse(maTkStr, out int maTK))
                {
                    var khachHang = await _context.KhachHangs.FirstOrDefaultAsync(kh => kh.MaTK == maTK);
                    if (khachHang != null)
                    {
                        gioHang = await _context.GioHangs.FirstOrDefaultAsync(gh => gh.MaKH == khachHang.MaKH);
                    }
                }
            }
            else if (!string.IsNullOrEmpty(cartToken))
            {
                gioHang = await _context.GioHangs.FirstOrDefaultAsync(gh => gh.CartToken == cartToken && gh.MaKH == null);
            }

            if (gioHang == null)
            {
                return NotFound(new { message = "Không tìm thấy giỏ hàng hợp lệ" });
            }

            var chiTiet = await _context.ChiTietGioHangs
                .FirstOrDefaultAsync(ct => ct.MaGH == gioHang.MaGH && ct.MaSP == maSP);

            if (chiTiet == null)
            {
                return NotFound(new { message = "Sản phẩm không tồn tại trong giỏ hàng" });
            }

            using var transaction = await _context.Database.BeginTransactionAsync();
            try
            {
                _context.ChiTietGioHangs.Remove(chiTiet);
                await _context.SaveChangesAsync();
                
                var tatCaChiTietConLai = await _context.ChiTietGioHangs.Where(ct => ct.MaGH == gioHang.MaGH).ToListAsync();
                gioHang.TongTien = tatCaChiTietConLai.Sum(ct => (ct.SoLuong ?? 0) * (ct.DonGia ?? 0));
                gioHang.NgayCapNhat = DateTime.Now;

                _context.GioHangs.Update(gioHang);
                await _context.SaveChangesAsync();

                await transaction.CommitAsync();

                return Ok(new { message = "Đã xóa sản phẩm khỏi giỏ hàng thành công!", tongTienMoi = gioHang.TongTien });
            }
            catch (Exception ex)
            {
                await transaction.RollbackAsync();
                return StatusCode(500, new { message = "Lỗi hệ thống khi xóa", detail = ex.Message });
            }
        }
    }
}