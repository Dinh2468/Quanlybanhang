using API_WebBDDHT.Data;
using API_WebBDDHT.DTOs;
using API_WebBDDHT.DTOs.Admin;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using API_WebBDDHT.Entities;
using BCryptNet = BCrypt.Net.BCrypt;

namespace API_WebBDDHT.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize] 
    public class NhanVienController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IMapper _mapper;

        public NhanVienController(AppDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll(
            [FromQuery] string? search = null, 
            [FromQuery] string? role = null,
            [FromQuery] int page = 1, 
            [FromQuery] int pageSize = 20)
        {
            var query = _context.NhanViens
                .Include(nv => nv.TaiKhoan) // Nạp thông tin tài khoản liên kết để lấy Username/Email
                .AsQueryable();
            if (!string.IsNullOrEmpty(role))
            {
                if (role == "Nhân viên" || role == "NhanVien")
                {
                    query = query.Where(nv => nv.TaiKhoan.VaiTro == "Nhân viên" || nv.TaiKhoan.VaiTro == "NhanVien");
                }
                else
                {
                    query = query.Where(nv => nv.TaiKhoan.VaiTro == role);
                }
            }

            if (!string.IsNullOrEmpty(search))
            {
                query = query.Where(nv => nv.HoTen.Contains(search) || 
                                          nv.TaiKhoan.TenDangNhap.Contains(search) || 
                                          nv.TaiKhoan.Email.Contains(search) || 
                                          nv.SDT.Contains(search));
            }

            var totalCount = await query.CountAsync();
            var totalPages = (int)Math.Ceiling((double)totalCount / pageSize);

            var nhanViens = await query
                .OrderByDescending(x => x.MaNV)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            var items = _mapper.Map<IEnumerable<AdminNhanVienDto>>(nhanViens);

            var result = new PagedResult<AdminNhanVienDto>
            {
                TotalCount = totalCount,
                TotalPages = totalPages,
                Items = items
            };

            return Ok(result);
        }

        [HttpGet("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> GetById(int id)
        {
            var nhanVien = await _context.NhanViens
                .Include(nv => nv.TaiKhoan)
                .FirstOrDefaultAsync(n => n.MaNV == id);

            if (nhanVien == null) return NotFound(new { message = "Không tìm thấy nhân viên" });

            var result = _mapper.Map<AdminNhanVienDto>(nhanVien);
            return Ok(result);
        }

        [HttpPost]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Create([FromBody] AdminTaoNhanVienDto dto)
        {
            if (string.IsNullOrEmpty(dto.TenDangNhap) || string.IsNullOrEmpty(dto.MatKhau))
                return BadRequest(new { message = "Tên đăng nhập và mật khẩu là bắt buộc!" });

            if (await _context.TaiKhoans.AnyAsync(t => t.TenDangNhap == dto.TenDangNhap))
                return BadRequest(new { message = "Tên đăng nhập đã tồn tại!" });

            using var transaction = await _context.Database.BeginTransactionAsync();
            try
            {
                var taiKhoan = new TaiKhoan
                {
                    TenDangNhap = dto.TenDangNhap,
                    MatKhau = BCryptNet.HashPassword(dto.MatKhau),
                    Email = dto.Email,
                    VaiTro = dto.VaiTro ?? "Nhân viên",
                    TrangThai = dto.TrangThai == "Đang hoạt động"
                };
                _context.TaiKhoans.Add(taiKhoan);
                await _context.SaveChangesAsync();

                var count = await _context.NhanViens.CountAsync();
                var nhanVien = new NhanVien
                {
                    MaSoNhanVien = $"NV{(count + 1).ToString("D3")}",
                    HoTen = dto.HoTen,
                    SDT = dto.SoDienThoai,
                    DiaChi = dto.DiaChi,
                    GioiTinh = dto.GioiTinh,
                    NgaySinh = dto.NgaySinh,
                    MaTK = taiKhoan.MaTK
                };
                _context.NhanViens.Add(nhanVien);
                await _context.SaveChangesAsync();

                await transaction.CommitAsync();
                return Ok(new { message = "Thêm nhân viên thành công!" });
            }
            catch (Exception ex)
            {
                await transaction.RollbackAsync();
                return StatusCode(500, new { message = "Lỗi khi thêm nhân viên", detail = ex.Message });
            }
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Update(int id, [FromBody] AdminTaoNhanVienDto dto)
        {
            var nhanVien = await _context.NhanViens.Include(n => n.TaiKhoan).FirstOrDefaultAsync(n => n.MaNV == id);
            if (nhanVien == null) return NotFound(new { message = "Không tìm thấy nhân viên" });

            using var transaction = await _context.Database.BeginTransactionAsync();
            try
            {
                nhanVien.HoTen = dto.HoTen;
                nhanVien.SDT = dto.SoDienThoai;
                nhanVien.DiaChi = dto.DiaChi;
                nhanVien.GioiTinh = dto.GioiTinh;
                nhanVien.NgaySinh = dto.NgaySinh;

                if (nhanVien.TaiKhoan != null)
                {
                    nhanVien.TaiKhoan.Email = dto.Email;
                    nhanVien.TaiKhoan.VaiTro = dto.VaiTro ?? "Nhân viên";
                    nhanVien.TaiKhoan.TrangThai = dto.TrangThai == "Đang hoạt động" || dto.TrangThai == "true" || dto.TrangThai == "True";

                    if (!string.IsNullOrEmpty(dto.MatKhau))
                    {
                        nhanVien.TaiKhoan.MatKhau = BCryptNet.HashPassword(dto.MatKhau);
                    }
                }

                await _context.SaveChangesAsync();
                await transaction.CommitAsync();
                return Ok(new { message = "Cập nhật thành công!" });
            }
            catch (Exception ex)
            {
                await transaction.RollbackAsync();
                return StatusCode(500, new { message = "Lỗi cập nhật", detail = ex.Message });
            }
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Delete(int id)
        {
            var nhanVien = await _context.NhanViens.Include(n => n.TaiKhoan).FirstOrDefaultAsync(n => n.MaNV == id);
            if (nhanVien == null) return NotFound(new { message = "Không tìm thấy nhân viên" });

            using var transaction = await _context.Database.BeginTransactionAsync();
            try
            {
                _context.NhanViens.Remove(nhanVien);
                if (nhanVien.TaiKhoan != null)
                {
                    _context.TaiKhoans.Remove(nhanVien.TaiKhoan);
                }
                await _context.SaveChangesAsync();
                await transaction.CommitAsync();
                return Ok(new { message = "Xóa nhân viên thành công!" });
            }
            catch (Exception ex)
            {
                await transaction.RollbackAsync();
                return BadRequest(new { message = "Không thể xóa do ràng buộc dữ liệu", detail = ex.Message });
            }
        }
    }
}
