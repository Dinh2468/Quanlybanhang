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
    public class NhaCungCapController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IMapper _mapper;

        public NhaCungCapController(AppDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        // ==========================================
        // 1. API: GET /api/NhaCungCap - LẤY TOÀN BỘ DANH SÁCH
        // ==========================================
        [HttpGet]
        public async Task<IActionResult> GetAll(
            [FromQuery] string? search = null,
            [FromQuery] int? page = null, 
            [FromQuery] int pageSize = 20)
        {
            var query = _context.NhaCungCaps.AsQueryable();

            if (!string.IsNullOrEmpty(search))
            {
                query = query.Where(n => n.TenNCC.Contains(search) || 
                                         n.SDT.Contains(search) || 
                                         n.Email.Contains(search));
            }
            if (page.HasValue)
            {
                var totalCount = await query.CountAsync();
                var totalPages = (int)Math.Ceiling((double)totalCount / pageSize);

                var nhaCungCaps = await query
                    .OrderByDescending(x => x.MaNCC)
                    .Skip((page.Value - 1) * pageSize)
                    .Take(pageSize)
                    .ToListAsync();

                var items = _mapper.Map<IEnumerable<NhaCungCapDto>>(nhaCungCaps);

                return Ok(new PagedResult<NhaCungCapDto>
                {
                    TotalCount = totalCount,
                    TotalPages = totalPages,
                    Items = items
                });
            }
            else
            {
                var nhaCungCaps = await query.ToListAsync();
                var result = _mapper.Map<IEnumerable<NhaCungCapDto>>(nhaCungCaps);
                return Ok(result);
            }
        }

        // ==========================================
        // 2. API: GET /api/NhaCungCap/{id} - LẤY CHI TIẾT THEO ID
        // ==========================================
        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var ncc = await _context.NhaCungCaps.FindAsync(id);
            if (ncc == null)
            {
                return NotFound(new { message = "Không tìm thấy nhà cung cấp này" });
            }
            var result = _mapper.Map<NhaCungCapDto>(ncc);
            return Ok(result);
        }

        // ==========================================
        // 3. API: POST /api/NhaCungCap - THÊM MỚI (YÊU CẦU LOGIN)
        // ==========================================
        [HttpPost]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Create([FromBody] LuuNhaCungCapDto request)
        {
            if (request == null) return BadRequest(new { message = "Dữ liệu không hợp lệ" });

            // Kiểm tra trùng tên Nhà cung cấp để tránh lặp dữ liệu
            var tenTrung = await _context.NhaCungCaps.AnyAsync(n => n.TenNCC.ToLower() == request.TenNCC.ToLower());
            if (tenTrung)
            {
                return BadRequest(new { message = "Tên nhà cung cấp này đã tồn tại trên hệ thống" });
            }

            var nccMoi = _mapper.Map<NhaCungCap>(request);

            _context.NhaCungCaps.Add(nccMoi);
            await _context.SaveChangesAsync();

            var result = _mapper.Map<NhaCungCapDto>(nccMoi);
            return CreatedAtAction(nameof(GetById), new { id = nccMoi.MaNCC }, result);
        }

        // ==========================================
        // 4. API: PUT /api/NhaCungCap/{id} - CẬP NHẬT (YÊU CẦU LOGIN)
        // ==========================================
        [HttpPut("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Update(int id, [FromBody] LuuNhaCungCapDto request)
        {
            if (request == null) return BadRequest(new { message = "Dữ liệu không hợp lệ" });

            var ncc = await _context.NhaCungCaps.FindAsync(id);
            if (ncc == null)
            {
                return NotFound(new { message = "Không tìm thấy nhà cung cấp cần cập nhật" });
            }

            // Kiểm tra trùng tên với các nhà cung cấp khác
            var tenTrung = await _context.NhaCungCaps.AnyAsync(n => n.MaNCC != id && n.TenNCC.ToLower() == request.TenNCC.ToLower());
            if (tenTrung)
            {
                return BadRequest(new { message = "Tên nhà cung cấp mới đã bị trùng với một nhà cung cấp khác" });
            }

            // Ánh xạ đè dữ liệu từ DTO vào thực thể cũ đang track trong Context
            _mapper.Map(request, ncc);

            _context.NhaCungCaps.Update(ncc);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Cập nhật thông tin nhà cung cấp thành công!" });
        }

        // ==========================================
        // 5. API: DELETE /api/NhaCungCap/{id} - XÓA (YÊU CẦU LOGIN)
        // ==========================================
        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Delete(int id)
        {
            var ncc = await _context.NhaCungCaps.FindAsync(id);
            if (ncc == null)
            {
                return NotFound(new { message = "Không tìm thấy nhà cung cấp cần xóa" });
            }

            // KIỂM TRA RÀNG BUỘC: Nếu nhà cung cấp này đang liên kết với các phiếu nhập hàng, không được xóa bừa bãi
            var dangChuaPhieuNhap = await _context.NhapHangs.AnyAsync(nh => nh.MaNCC == id);
            if (dangChuaPhieuNhap)
            {
                return BadRequest(new { message = "Không thể xóa nhà cung cấp này vì hệ thống đang có các phiếu nhập kho liên kết với họ!" });
            }

            _context.NhaCungCaps.Remove(ncc);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Đã xóa nhà cung cấp khỏi hệ thống thành công!" });
        }
    }
}