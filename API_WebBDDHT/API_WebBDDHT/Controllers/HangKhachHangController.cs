using API_WebBDDHT.Data;
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
    public class HangKhachHangController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IMapper _mapper;

        public HangKhachHangController(AppDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var hangKhachHangs = await _context.HangKhachHangs
                .OrderBy(h => h.DiemToiThieu) // Sắp xếp theo thứ tự điểm tăng dần (Đồng -> Bạc -> Vàng)
                .ToListAsync();

            var result = _mapper.Map<IEnumerable<HangKhachHangDto>>(hangKhachHangs);
            return Ok(result);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var hang = await _context.HangKhachHangs.FindAsync(id);
            if (hang == null)
            {
                return NotFound(new { message = "Không tìm thấy hạng khách hàng này" });
            }

            var result = _mapper.Map<HangKhachHangDto>(hang);
            return Ok(result);
        }

     
        [HttpPost]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Create([FromBody] LuuHangKhachHangDto request)
        {
            if (request == null) return BadRequest(new { message = "Dữ liệu không hợp lệ" });

            // Kiểm tra trùng tên hạng (Ví dụ: Tránh tạo 2 hạng cùng tên "Vàng")
            var tenTrung = await _context.HangKhachHangs.AnyAsync(h => h.TenHang.ToLower() == request.TenHang.ToLower());
            if (tenTrung)
            {
                return BadRequest(new { message = "Tên hạng thành viên này đã tồn tại trên hệ thống" });
            }

            // Kiểm tra trùng số điểm tối thiểu cấu hình
            var diemTrung = await _context.HangKhachHangs.AnyAsync(h => h.DiemToiThieu == request.DiemToiThieu);
            if (diemTrung)
            {
                return BadRequest(new { message = "Mốc điểm tối thiểu này đã được gán cho một hạng khác" });
            }

            var hangMoi = _mapper.Map<HangKhachHang>(request);

            _context.HangKhachHangs.Add(hangMoi);
            await _context.SaveChangesAsync(); // Lưu xuống DB sinh MaHang tự tăng

            // Cập nhật lại hạng cho tất cả khách hàng
            await UpdateCustomerRanksAsync();

            var result = _mapper.Map<HangKhachHangDto>(hangMoi);
            return CreatedAtAction(nameof(GetById), new { id = hangMoi.MaHang }, result);
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Update(int id, [FromBody] LuuHangKhachHangDto request)
        {
            if (request == null) return BadRequest(new { message = "Dữ liệu không hợp lệ" });

            var hang = await _context.HangKhachHangs.FindAsync(id);
            if (hang == null)
            {
                return NotFound(new { message = "Không tìm thấy thông tin hạng cần cập nhật" });
            }

            // Kiểm tra trùng tên với hạng khác
            var tenTrung = await _context.HangKhachHangs.AnyAsync(h => h.MaHang != id && h.TenHang.ToLower() == request.TenHang.ToLower());
            if (tenTrung)
            {
                return BadRequest(new { message = "Tên hạng mới bị trùng với một hạng thành viên khác" });
            }

            // Kiểm tra mốc điểm trùng lặp
            var diemTrung = await _context.HangKhachHangs.AnyAsync(h => h.MaHang != id && h.DiemToiThieu == request.DiemToiThieu);
            if (diemTrung)
            {
                return BadRequest(new { message = "Mốc điểm tối thiểu mới bị trùng lặp cấu hình" });
            }

            // Ánh xạ ghi đè dữ liệu mới vào thực thể cũ đang được context theo dõi
            _mapper.Map(request, hang);

            _context.HangKhachHangs.Update(hang);
            await _context.SaveChangesAsync();

            // Cập nhật lại hạng cho tất cả khách hàng
            await UpdateCustomerRanksAsync();

            return Ok(new { message = "Cập nhật cấu hình hạng thành viên thành công!" });
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Delete(int id)
        {
            var hang = await _context.HangKhachHangs.FindAsync(id);
            if (hang == null)
            {
                return NotFound(new { message = "Không tìm thấy hạng thành viên cần xóa" });
            }

            // HƯỚNG 1: Gỡ ràng buộc MaHang cho các khách hàng đang thuộc hạng này 
            // để không bị lỗi Foreign Key khi xóa
            var khachHangsThuocHang = await _context.KhachHangs.Where(kh => kh.MaHang == id).ToListAsync();
            if (khachHangsThuocHang.Any())
            {
                foreach (var kh in khachHangsThuocHang)
                {
                    kh.MaHang = null;
                }
                await _context.SaveChangesAsync();
            }

            // Tiến hành xóa hạng
            _context.HangKhachHangs.Remove(hang);
            await _context.SaveChangesAsync();

            // Tự động tính toán và xếp lại hạng mới (dựa trên điểm tích lũy) cho tất cả khách hàng
            await UpdateCustomerRanksAsync();

            return Ok(new { message = "Đã xóa hạng khách hàng khỏi hệ thống thành công và cập nhật lại hạng cho các khách hàng liên quan!" });
        }

        private async Task UpdateCustomerRanksAsync()
        {
            // Lấy danh sách hạng sắp xếp theo điểm giảm dần (ưu tiên hạng cao nhất)
            var hangs = await _context.HangKhachHangs.OrderByDescending(h => h.DiemToiThieu).ToListAsync();
            
            // Lấy tất cả khách hàng
            var khachHangs = await _context.KhachHangs.ToListAsync();

            bool hasChanges = false;
            foreach (var kh in khachHangs)
            {
                var hangMoi = hangs.FirstOrDefault(h => kh.DiemTichLuy >= h.DiemToiThieu);
                if (hangMoi != null && kh.MaHang != hangMoi.MaHang)
                {
                    kh.MaHang = hangMoi.MaHang;
                    hasChanges = true;
                }
            }

            if (hasChanges)
            {
                await _context.SaveChangesAsync();
            }
        }
    }
}
