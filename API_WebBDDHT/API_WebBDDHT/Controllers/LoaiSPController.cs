using API_WebBDDHT.Data;
using API_WebBDDHT.DTOs;
using API_WebBDDHT.DTOs.DanhMuc;
using API_WebBDDHT.Entities;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API_WebBDDHT.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class LoaiSPController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IMapper _mapper;

        public LoaiSPController(AppDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll(
            [FromQuery] string? search = null,
            [FromQuery] int? page = null, 
            [FromQuery] int pageSize = 20)
        {
            var query = _context.LoaiSps.AsQueryable();

            if (!string.IsNullOrEmpty(search))
            {
                query = query.Where(l => l.TenLoai.Contains(search));
            }
            if (page.HasValue)
            {
                var totalCount = await query.CountAsync();
                var totalPages = (int)Math.Ceiling((double)totalCount / pageSize);

                var loaiSPs = await query
                    .OrderByDescending(x => x.MaLoaiSP)
                    .Skip((page.Value - 1) * pageSize)
                    .Take(pageSize)
                    .ToListAsync();

                var items = _mapper.Map<IEnumerable<LoaiSPDto>>(loaiSPs);

                return Ok(new PagedResult<LoaiSPDto>
                {
                    TotalCount = totalCount,
                    TotalPages = totalPages,
                    Items = items
                });
            }
            else
            {
                var loaiSPs = await query.ToListAsync();
                var result = _mapper.Map<IEnumerable<LoaiSPDto>>(loaiSPs);
                return Ok(result);
            }
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var loaiSP = await _context.LoaiSps.FindAsync(id);
            if (loaiSP == null)
            {
                return NotFound(new { message = "Không tìm thấy loại sản phẩm này" });
            }
            var result = _mapper.Map<LoaiSPDto>(loaiSP);
            return Ok(result);
        }
        [HttpPost]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Create([FromBody] LuuLoaiSPDto request)
        {
            if (request == null) return BadRequest(new { message = "Dữ liệu đầu vào không hợp lệ" });

            // Kiểm tra trùng tên danh mục (ví dụ: đã có danh mục "Bút - Viết" thì không cho tạo trùng)
            var bbiTrung = await _context.LoaiSps.AnyAsync(l => l.TenLoai.ToLower() == request.TenLoai.ToLower());
            if (bbiTrung)
            {
                return BadRequest(new { message = "Tên loại sản phẩm này đã tồn tại trên hệ thống" });
            }

            // Ánh xạ dữ liệu sạch từ DTO sang Entity để chuẩn bị lưu xuống DB
            var loaiSPMoi = _mapper.Map<LoaiSP>(request);

            _context.LoaiSps.Add(loaiSPMoi);
            await _context.SaveChangesAsync(); // Lưu xuống DB để sinh MaLoaiSP tự tăng

            var result = _mapper.Map<LoaiSPDto>(loaiSPMoi);
            return CreatedAtAction(nameof(GetById), new { id = loaiSPMoi.MaLoaiSP }, result);
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Update(int id, [FromBody] LuuLoaiSPDto request)
        {
            if (request == null) return BadRequest(new { message = "Dữ liệu không hợp lệ" });

            var loaiSP = await _context.LoaiSps.FindAsync(id);
            if (loaiSP == null)
            {
                return NotFound(new { message = "Không tìm thấy loại sản phẩm cần cập nhật" });
            }

            // Kiểm tra trùng tên với danh mục khác khi đổi tên mới
            var bbiTrung = await _context.LoaiSps.AnyAsync(l => l.MaLoaiSP != id && l.TenLoai.ToLower() == request.TenLoai.ToLower());
            if (bbiTrung)
            {
                return BadRequest(new { message = "Tên loại sản phẩm mới đã bị trùng với một danh mục khác" });
            }

            // Ánh xạ đè dữ liệu mới vào thực thể cũ đang được tracking
            _mapper.Map(request, loaiSP);

            _context.LoaiSps.Update(loaiSP);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Cập nhật thông tin loại sản phẩm thành công!" });
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Delete(int id)
        {
            var loaiSP = await _context.LoaiSps.FindAsync(id);
            if (loaiSP == null)
            {
                return NotFound(new { message = "Không tìm thấy loại sản phẩm cần xóa" });
            }

            // BẢO VỆ TOÀN VẸN DỮ LIỆU: Nếu danh mục này đang chứa các sản phẩm văn phòng phẩm bên trong, không cho xóa bừa bãi
            var coChuaSanPham = await _context.SanPhams.AnyAsync(sp => sp.MaLoai == id);
            if (coChuaSanPham)
            {
                return BadRequest(new { message = "Không thể xóa danh mục này vì hệ thống đang có các sản phẩm thuộc loại này!" });
            }

            _context.LoaiSps.Remove(loaiSP);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Đã xóa loại sản phẩm khỏi hệ thống thành công!" });
        }
    }
}
