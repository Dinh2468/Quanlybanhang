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
    public class ThuongHieuController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IMapper _mapper;

        public ThuongHieuController(AppDbContext context, IMapper mapper)
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
            var query = _context.ThuongHieus.AsQueryable();

            if (!string.IsNullOrEmpty(search))
            {
                query = query.Where(t => t.TenTH.Contains(search) || t.QuocGia.Contains(search));
            }
            if (page.HasValue)
            {
                var totalCount = await query.CountAsync();
                var totalPages = (int)Math.Ceiling((double)totalCount / pageSize);

                var thuongHieus = await query
                    .OrderByDescending(x => x.MaTH)
                    .Skip((page.Value - 1) * pageSize)
                    .Take(pageSize)
                    .ToListAsync();

                var items = _mapper.Map<IEnumerable<ThuongHieuDto>>(thuongHieus);

                return Ok(new PagedResult<ThuongHieuDto>
                {
                    TotalCount = totalCount,
                    TotalPages = totalPages,
                    Items = items
                });
            }
            else
            {
                var thuongHieus = await query.ToListAsync();
                var result = _mapper.Map<IEnumerable<ThuongHieuDto>>(thuongHieus);
                return Ok(result);
            }
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var thuongHieu = await _context.ThuongHieus.FindAsync(id);
            if (thuongHieu == null)
            {
                return NotFound(new { message = "Không tìm thấy thương hiệu này" });
            }
            var result = _mapper.Map<ThuongHieuDto>(thuongHieu);
            return Ok(result);

        }

        [HttpPost]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Create([FromBody] LuuThuongHieuDto request)
        {
            if (request == null) return BadRequest(new { message = "Dữ liệu không hợp lệ" });

            // Kiểm tra chống trùng lặp tên thương hiệu văn phòng phẩm (ví dụ: Thiên Long, Campus...)
            var biTrung = await _context.ThuongHieus.AnyAsync(t => t.TenTH.ToLower() == request.TenTH.ToLower());
            if (biTrung)
            {
                return BadRequest(new { message = "Tên thương hiệu này đã tồn tại trên hệ thống" });
            }

            var thuongHieuMoi = _mapper.Map<ThuongHieu>(request);

            _context.ThuongHieus.Add(thuongHieuMoi);
            await _context.SaveChangesAsync(); // Lưu để sinh tự động MaTH

            var result = _mapper.Map<ThuongHieuDto>(thuongHieuMoi);
            return CreatedAtAction(nameof(GetById), new { id = thuongHieuMoi.MaTH }, result);
        }

       
        [HttpPut("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Update(int id, [FromBody] LuuThuongHieuDto request)
        {
            if (request == null) return BadRequest(new { message = "Dữ liệu không hợp lệ" });

            var thuongHieu = await _context.ThuongHieus.FindAsync(id);
            if (thuongHieu == null)
            {
                return NotFound(new { message = "Không tìm thấy thương hiệu cần cập nhật" });
            }

            // Kiểm tra trùng tên thương hiệu khi đổi sang tên mới
            var biTrung = await _context.ThuongHieus.AnyAsync(t => t.MaTH != id && t.TenTH.ToLower() == request.TenTH.ToLower());
            if (biTrung)
            {
                return BadRequest(new { message = "Tên thương hiệu mới đã bị trùng với danh mục khác" });
            }

            // Ánh xạ đè dữ liệu mới trực tiếp lên thực thể cũ đang theo dõi
            _mapper.Map(request, thuongHieu);

            _context.ThuongHieus.Update(thuongHieu);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Cập nhật thông tin thương hiệu thành công!" });
        }
               
        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Delete(int id)
        {
            var thuongHieu = await _context.ThuongHieus.FindAsync(id);
            if (thuongHieu == null)
            {
                return NotFound(new { message = "Không tìm thấy thương hiệu cần xóa" });
            }

            // KIỂM TRA RÀNG BUỘC KHOÁ NGOẠI: Nếu thương hiệu này đang chứa các sản phẩm (như Máy tính Casio), cấm xoá bừa bãi
            var dangChuaSanPham = await _context.SanPhams.AnyAsync(sp => sp.MaTH == id);
            if (dangChuaSanPham)
            {
                return BadRequest(new { message = "Không thể xóa thương hiệu này vì đang có các sản phẩm văn phòng phẩm thuộc thương hiệu này!" });
            }

            _context.ThuongHieus.Remove(thuongHieu);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Đã xóa thương hiệu khỏi hệ thống thành công!" });
        }
    }
}
