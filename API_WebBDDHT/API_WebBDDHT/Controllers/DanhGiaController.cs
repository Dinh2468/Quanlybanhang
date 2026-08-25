using API_WebBDDHT.Data;
using API_WebBDDHT.DTOs.SanPham;
using API_WebBDDHT.Entities;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using API_WebBDDHT.Helpers;

namespace API_WebBDDHT.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DanhGiaController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IMapper _mapper;

        public DanhGiaController(AppDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        [HttpGet]
        public async Task<IActionResult> GetDanhGia(int maSP) 
        {
            var sanPhamTonTai =await _context.SanPhams.AnyAsync(sp => sp.MaSP == maSP);
            if(!sanPhamTonTai)
            {
                return NotFound(new { message = "Không tìm thấy sản phẩm này" });
            }
            var dsDanhGia = await _context.DanhGias
                .Include(dg => dg.KhachHang)
                .Where(dg => dg.MaSP == maSP)
                .OrderByDescending(dg => dg.NgayDG) //OrderByDescending để đánh giá mới nhất theo ngày sẽ hiển thị lên đầu
                .ToListAsync();
            var result = _mapper.Map<IEnumerable<DanhGiaDto>>(dsDanhGia);
            return Ok(result);
        }

        [HttpPost("vietdanhgia")]
        [Authorize]
        public async Task<IActionResult> VietDanhGia([FromBody] VietDanhGiaDto request)
        {
            if (request == null)
            {
                return BadRequest(new { message = "Dữ liệu gửi lên không hợp lệ" });
            }

            // 1. Lấy MaTK định danh từ Claims Token đã giải mã
            var maTkStr = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (!int.TryParse(maTkStr, out int maTK))
            {
                return Unauthorized(new { message = "Xác thực tài khoản thất bại" });
            }

            // 2. Tìm hồ sơ Khách hàng tương ứng
            var khachHang = await _context.KhachHangs.FirstOrDefaultAsync(kh => kh.MaTK == maTK);
            if (khachHang == null)
            {
                return NotFound(new { message = "Không tìm thấy hồ sơ khách hàng của bạn trên hệ thống" });
            }

            // 3. KIỂM TRA NGHIỆP VỤ: Đơn hàng có tồn tại, thuộc về khách này và đã giao thành công chưa?
            var donHangHopLe = await _context.DonHangs
                .AnyAsync(dh => dh.MaDH == request.MaDH &&
                                dh.MaKH == khachHang.MaKH &&
                                dh.TrangThai.ToLower() == "thành công"); 

            if (!donHangHopLe)
            {
                return BadRequest(new { message = "Bạn không thể đánh giá sản phẩm này vì đơn hàng không tồn tại hoặc chưa hoàn thành giao nhận!" });
            }

            // 4. KIỂM TRA: Sản phẩm có nằm trong đơn hàng chi tiết đó không?
            var sanPhamTrongDonHang = await _context.ChiTietDonHangs
                .AnyAsync(ct => ct.MaDH == request.MaDH && ct.MaSP == request.MaSP);

            if (!sanPhamTrongDonHang)
            {
                return BadRequest(new { message = "Sản phẩm này không nằm trong hóa đơn đặt mua của bạn!" });
            }

            // 5. KIỂM TRA: Khách hàng đã viết đánh giá cho sản phẩm này thuộc đơn hàng này chưa? (Tránh viết trùng)
            var daDanhGiaChua = await _context.DanhGias
                .AnyAsync(dg => dg.MaDH == request.MaDH && dg.MaSP == request.MaSP && dg.MaKH == khachHang.MaKH);

            if (daDanhGiaChua)
            {
                return BadRequest(new { message = "Bạn đã để lại đánh giá cho sản phẩm này trong đơn hàng này rồi!" });
            }

            try
            {
                // 6. Tạo đối tượng thực thể Đánh giá mới
                var danhGiaMoi = new DanhGia
                {
                    MaKH = khachHang.MaKH,
                    MaSP = request.MaSP,
                    MaDH = request.MaDH,
                    SoSao = request.SoSao,
                    NoiDung = BadWordFilter.MaskBadWords(request.NoiDung),
                    NgayDG = DateTime.Now // Ghi nhận thời gian thực tại hệ thống
                };

                _context.DanhGias.Add(danhGiaMoi);
                await _context.SaveChangesAsync();

                return Ok(new { message = "Gửi bình luận và đánh giá sản phẩm văn phòng phẩm thành công!" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Gặp lỗi hệ thống khi lưu bài đánh giá", detail = ex.Message });
            }
        }

        [HttpDelete("{maDG}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> XoaDanhGia(int maDG)
        {
            var danhGia = await _context.DanhGias.FindAsync(maDG);
            if (danhGia == null)
            {
                return NotFound(new { message = "Không tìm thấy đánh giá này" });
            }

            _context.DanhGias.Remove(danhGia);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Xóa đánh giá thành công" });
        }
    }
}
