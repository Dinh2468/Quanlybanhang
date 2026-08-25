using API_WebBDDHT.Data;
using API_WebBDDHT.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using AutoMapper;
using API_WebBDDHT.DTOs.SanPham;

namespace API_WebBDDHT.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class YeuThichController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IMapper _mapper;

        public YeuThichController(AppDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        // Lấy danh sách sản phẩm yêu thích của user hiện tại
        [HttpGet]
        public async Task<IActionResult> GetYeuThich()
        {
            var maTkStr = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(maTkStr)) return Unauthorized("Không tìm thấy thông tin user.");

            int maTk = int.Parse(maTkStr);

            // Truy vấn lấy danh sách sản phẩm yêu thích, bao gồm cả KhuyenMais để hiển thị giá giảm
            var sanPhamYeuThiches = await _context.SanPhamYeuThiches
                .Include(yt => yt.SanPham)
                .ThenInclude(sp => sp.KhuyenMais)
                .Where(yt => yt.MaTK == maTk)
                .Select(yt => yt.SanPham)
                .ToListAsync();

            var result = _mapper.Map<IEnumerable<SanPhamDto>>(sanPhamYeuThiches);

            // Trả về trực tiếp danh sách DTO
            return Ok(result);
        }

        // Lấy danh sách chỉ ID sản phẩm để frontend bôi đỏ trái tim
        [HttpGet("ids")]
        public async Task<IActionResult> GetYeuThichIds()
        {
            var maTkStr = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(maTkStr)) return Ok(new List<int>()); // Nếu chưa đăng nhập, trả về mảng rỗng

            int maTk = int.Parse(maTkStr);

            var ids = await _context.SanPhamYeuThiches
                .Where(yt => yt.MaTK == maTk)
                .Select(yt => yt.MaSP)
                .ToListAsync();

            return Ok(ids);
        }

        // Thêm/Xóa sản phẩm yêu thích (Toggle)
        [HttpPost("{maSP}")]
        public async Task<IActionResult> ToggleYeuThich(int maSP)
        {
            var maTkStr = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(maTkStr)) return Unauthorized("Vui lòng đăng nhập để thực hiện chức năng này.");

            int maTk = int.Parse(maTkStr);

            var existing = await _context.SanPhamYeuThiches
                .FirstOrDefaultAsync(yt => yt.MaTK == maTk && yt.MaSP == maSP);

            if (existing != null)
            {
                // Đã có -> Xóa (Unlike)
                _context.SanPhamYeuThiches.Remove(existing);
                await _context.SaveChangesAsync();
                return Ok(new { message = "Đã bỏ sản phẩm khỏi danh sách yêu thích", isYeuThich = false });
            }
            else
            {
                // Chưa có -> Thêm (Like)
                var sanPham = await _context.SanPhams.FindAsync(maSP);
                if (sanPham == null) return NotFound("Không tìm thấy sản phẩm");

                var newItem = new SanPhamYeuThich
                {
                    MaTK = maTk,
                    MaSP = maSP,
                    NgayThem = DateTime.Now
                };

                _context.SanPhamYeuThiches.Add(newItem);
                await _context.SaveChangesAsync();
                return Ok(new { message = "Đã thêm sản phẩm vào danh sách yêu thích", isYeuThich = true });
            }
        }
    }
}
