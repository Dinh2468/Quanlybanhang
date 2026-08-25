using API_WebBDDHT.Data;
using API_WebBDDHT.DTOs;
using API_WebBDDHT.DTOs.KhuyenMai;
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
    public class KhuyenMaiController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IMapper _mapper;

        public KhuyenMaiController(AppDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll(
            [FromQuery] string? search = null,
            [FromQuery] int page = 1, 
            [FromQuery] int pageSize = 20)
        {
            var query = _context.KhuyenMais.Include(km => km.SanPhams).AsQueryable();

            if (!string.IsNullOrEmpty(search))
            {
                query = query.Where(km => km.TenKM.Contains(search));
            }

            var totalCount = await query.CountAsync();
            var totalPages = (int)Math.Ceiling((double)totalCount / pageSize);

            var khuyenMais = await query
                .OrderByDescending(x => x.MaKM)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            var items = _mapper.Map<IEnumerable<KhuyenMaiDto>>(khuyenMais);

            var result = new PagedResult<KhuyenMaiDto>
            {
                TotalCount = totalCount,
                TotalPages = totalPages,
                Items = items
            };

            return Ok(result);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var km = await _context.KhuyenMais.Include(k => k.SanPhams).FirstOrDefaultAsync(k => k.MaKM == id);
            if (km == null)
            {
                return NotFound(new { message = "Không tìm thấy chương trình khuyến mãi này" });
            }
            var result = _mapper.Map<KhuyenMaiDto>(km);
            return Ok(result);
        }

        [HttpPost]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Create([FromBody] LuuKhuyenMaiDto request)
        {
            if (request == null) return BadRequest(new { message = "Dữ liệu không hợp lệ" });

            if (request.NgayKetThuc < request.NgayBatDau)
            {
                return BadRequest(new { message = "Ngày kết thúc không được nhỏ hơn ngày bắt đầu" });
            }

            using var transaction = await _context.Database.BeginTransactionAsync();
            try
            {
                var kmMoi = _mapper.Map<KhuyenMai>(request);

                // Nếu có danh sách mã sản phẩm đi kèm, tiến hành nạp vào bảng trung gian
                if (request.MaSanPhams != null && request.MaSanPhams.Any())
                {
                    var sanPhams = await _context.SanPhams
                        .Where(sp => request.MaSanPhams.Contains(sp.MaSP))
                        .ToListAsync();

                    kmMoi.SanPhams = sanPhams;
                }

                _context.KhuyenMais.Add(kmMoi);
                await _context.SaveChangesAsync();
                await transaction.CommitAsync();

                var result = _mapper.Map<KhuyenMaiDto>(kmMoi);
                return CreatedAtAction(nameof(GetById), new { id = kmMoi.MaKM }, result);
            }
            catch (Exception ex)
            {
                await transaction.RollbackAsync();
                return StatusCode(500, new { message = "Lỗi hệ thống khi lưu đợt khuyến mãi", detail = ex.Message });
            }
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Update(int id, [FromBody] LuuKhuyenMaiDto request)
        {
            if (request == null) return BadRequest(new { message = "Dữ liệu không hợp lệ" });
            if (request.NgayKetThuc < request.NgayBatDau)
            {
                return BadRequest(new { message = "Ngày kết thúc không được trước ngày bắt đầu" });
            }

            // Tìm kiếm khuyến mãi kèm theo danh sách sản phẩm hiện tại trong bảng trung gian để đồng bộ đè
            var km = await _context.KhuyenMais
                .Include(k => k.SanPhams)
                .FirstOrDefaultAsync(k => k.MaKM == id);

            if (km == null) return NotFound(new { message = "Không tìm thấy chương trình khuyến mãi cần sửa" });

            using var transaction = await _context.Database.BeginTransactionAsync();
            try
            {
                // Ánh xạ các trường dữ liệu text đè lên thực thể cũ
                _mapper.Map(request, km);

                // Xử lý đồng bộ lại bảng trung gian Nhiều - Nhiều (sp_km)
                km.SanPhams.Clear(); // Xóa các liên kết cũ

                if (request.MaSanPhams != null && request.MaSanPhams.Any())
                {
                    var sanPhamsMoi = await _context.SanPhams
                        .Where(sp => request.MaSanPhams.Contains(sp.MaSP))
                        .ToListAsync();

                    km.SanPhams = sanPhamsMoi; // Nạp lại danh sách liên kết mới
                }

                _context.KhuyenMais.Update(km);
                await _context.SaveChangesAsync();
                await transaction.CommitAsync();

                return Ok(new { message = "Cập nhật chương trình khuyến mãi và đồng bộ sản phẩm thành công!" });
            }
            catch (Exception ex)
            {
                await transaction.RollbackAsync();
                return StatusCode(500, new { message = "Gặp sự cố khi cập nhật dữ liệu", detail = ex.Message });
            }
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Delete(int id)
        {
            var km = await _context.KhuyenMais.FindAsync(id);
            if (km == null) return NotFound(new { message = "Không tìm thấy chương trình khuyến mãi cần xóa" });

            // Do cấu hình Fluent API trong AppDbContext là DeleteBehavior.Cascade đối với thực thể kết nối trung gian sp_km,
            // nên khi xóa KhuyenMai, các dòng liên kết sản phẩm ở bảng trung gian sẽ tự động được dọn sạch mà không gây lỗi khóa ngoại.
            _context.KhuyenMais.Remove(km);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Đã xóa chương trình khuyến mãi thành công!" });
        }
    }
}
