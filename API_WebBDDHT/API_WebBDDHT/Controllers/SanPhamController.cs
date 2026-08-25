using API_WebBDDHT.Data;
using API_WebBDDHT.DTOs;
using API_WebBDDHT.DTOs.SanPham;
using API_WebBDDHT.Entities;
using AutoMapper;
using CloudinaryDotNet;
using CloudinaryDotNet.Actions;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using API_WebBDDHT.Helpers;

namespace API_WebBDDHT.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SanPhamController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IMapper _mapper;
        private readonly IConfiguration _configuration;
        private readonly ICloudinaryHelper _cloudinaryHelper;

        public SanPhamController(AppDbContext context, IMapper mapper, IConfiguration configuration, ICloudinaryHelper cloudinaryHelper)
        {
            _context = context;
            _mapper = mapper;
            _configuration = configuration;
            _cloudinaryHelper = cloudinaryHelper;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll(
            [FromQuery] string? search = null, 
            [FromQuery] int? categoryId = null,
            [FromQuery] int? brandId = null,
            [FromQuery] int page = 1, 
            [FromQuery] int pageSize = 20,
            [FromQuery] bool isAdminApp = false)
        {
            var query = _context.SanPhams
                .Include(sp => sp.LoaiSP)
                .Include(sp => sp.ThuongHieu)
                .Include(sp => sp.KhuyenMais)
                .AsQueryable();

            bool isStaff = User.Identity != null && User.Identity.IsAuthenticated && 
                           (User.IsInRole("Admin") || User.IsInRole("NhanVien"));

            // Nếu gọi từ trang Quản lý (có cờ isAdminApp) nhưng không được xác thực hợp lệ (token hết hạn)
            if (isAdminApp && !isStaff)
            {
                return Unauthorized(new { message = "Phiên đăng nhập đã hết hạn hoặc không có quyền truy cập." });
            }

            // Nếu gọi từ giao diện người mua hàng thì BẮT BUỘC chỉ hiển thị sản phẩm đã duyệt.
            if (!isAdminApp)
            {
                query = query.Where(sp => sp.TrangThaiHienThi == true);
            }

            if (categoryId.HasValue)
            {
                query = query.Where(sp => sp.MaLoai == categoryId.Value);
            }

            if (brandId.HasValue)
            {
                query = query.Where(sp => sp.MaTH == brandId.Value);
            }

            if (!string.IsNullOrEmpty(search))
            {
                query = query.Where(sp => sp.TenSP.Contains(search) || 
                                          (sp.LoaiSP != null && sp.LoaiSP.TenLoai.Contains(search)) || 
                                          (sp.ThuongHieu != null && sp.ThuongHieu.TenTH.Contains(search)));
            }

            var totalCount = await query.CountAsync();
            var totalPages = (int)Math.Ceiling((double)totalCount / pageSize);

            var sanPhams = await query
                .OrderByDescending(x => x.MaSP)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            // Dùng AutoMapper biến đổi nhanh gọn list Entity sang list DTO
            var items = _mapper.Map<IEnumerable<SanPhamDto>>(sanPhams);
            foreach (var dto in items)
            {
                var reviews = await _context.DanhGias
                    .Where(dg => dg.MaSP == dto.MaSP)
                    .Select(dg => dg.SoSao)
                    .ToListAsync();

                dto.ReviewCount = reviews.Count;
                dto.Rating = reviews.Any() ? Math.Round((double)reviews.Average(), 1) : 5.0;
            }

            var result = new PagedResult<SanPhamDto>
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
            var sanPham = await _context.SanPhams
                .Include(sp => sp.LoaiSP)
                .Include(sp => sp.ThuongHieu)
                .Include(sp => sp.KhuyenMais)
                .FirstOrDefaultAsync(sp => sp.MaSP == id);

            if (sanPham == null)
            {
                return NotFound(new { message = "Không tìm thấy sản phẩm văn phòng phẩm này" });
            }

            var result = _mapper.Map<SanPhamDto>(sanPham);
            var reviews = await _context.DanhGias
                .Where(dg => dg.MaSP == id)
                .Select(dg => dg.SoSao)
                .ToListAsync();

            result.ReviewCount = reviews.Count;
            result.Rating = reviews.Any() ? Math.Round((double)reviews.Average(), 1) : 5.0;

            return Ok(result);
        }

        [HttpGet("loai/{maLoai}")]
        public async Task<IActionResult> GetByLoai(int maLoai)
        {
            var sanPhamsQuery = _context.SanPhams
                .Include(sp => sp.LoaiSP)
                .Include(sp => sp.ThuongHieu)
                .Include(sp => sp.KhuyenMais)
                .Where(sp => sp.MaLoai == maLoai)
                .AsQueryable();

            // API này chỉ dùng cho giao diện khách hàng nên luôn ẩn sản phẩm chưa duyệt
            sanPhamsQuery = sanPhamsQuery.Where(sp => sp.TrangThaiHienThi == true);

            var sanPhams = await sanPhamsQuery.ToListAsync();

            var result = _mapper.Map<IEnumerable<SanPhamDto>>(sanPhams);
            foreach (var dto in result)
            {
                var reviews = await _context.DanhGias
                    .Where(dg => dg.MaSP == dto.MaSP)
                    .Select(dg => dg.SoSao)
                    .ToListAsync();

                dto.ReviewCount = reviews.Count;
                dto.Rating = reviews.Any() ? Math.Round((double)reviews.Average(), 1) : 5.0;
            }
            return Ok(result);
        }

        [HttpPost]
        [Authorize(Roles = "Admin,NhanVien")]
        public async Task<IActionResult> Create([FromForm] LuuSanPhamDto request)
        {
            if (request == null) return BadRequest(new { message = "Dữ liệu không hợp lệ" });

            // Kiểm tra các khoá ngoại danh mục, nhà cung cấp, thương hiệu xem có hợp lệ dưới DB không
            if (request.MaLoai.HasValue && !await _context.LoaiSps.AnyAsync(l => l.MaLoaiSP == request.MaLoai))
                return BadRequest(new { message = "Loại sản phẩm được chọn không tồn tại" });
            if (request.MaTH.HasValue && !await _context.ThuongHieus.AnyAsync(t => t.MaTH == request.MaTH))
                return BadRequest(new { message = "Thương hiệu được chọn không tồn tại" });

            var sanPhamMoi = _mapper.Map<SanPham>(request);

            // Phân quyền bật/tắt hiển thị
            if (User.IsInRole("NhanVien"))
            {
                sanPhamMoi.TrangThaiHienThi = false; // Nhân viên tạo mặc định bị ẩn
            }
            else
            {
                sanPhamMoi.TrangThaiHienThi = request.TrangThaiHienThi;
            }

            // Xử lý đẩy hình ảnh lên Cloudinary nếu Frontend có truyền file ảnh sản phẩm
            if (request.FileHinhAnhs != null && request.FileHinhAnhs.Count > 0)
            {
                var uploadedUrls = new List<string>();
                foreach (var file in request.FileHinhAnhs)
                {
                    if (file.Length > 0)
                    {
                        var uploadResult = await _cloudinaryHelper.UploadImageAsync(file, "LV_sanphams");
                        if (uploadResult != null && uploadResult.Error == null)
                        {
                            uploadedUrls.Add(uploadResult.SecureUrl.ToString());
                        }
                    }
                }
                if (uploadedUrls.Any())
                {
                    sanPhamMoi.HinhAnh = string.Join(",", uploadedUrls); // Lưu link tuyệt đối vào DB
                }
            }

            _context.SanPhams.Add(sanPhamMoi);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Thêm mới sản phẩm văn phòng phẩm thành công!", maSP = sanPhamMoi.MaSP });
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "Admin,NhanVien")]
        public async Task<IActionResult> Update(int id, [FromForm] LuuSanPhamDto request)
        {
            if (request == null) return BadRequest(new { message = "Dữ liệu không hợp lệ" });

            var sanPham = await _context.SanPhams.FindAsync(id);
            if (sanPham == null)
            {
                return NotFound(new { message = "Không tìm thấy sản phẩm văn phòng phẩm cần cập nhật" });
            }

            // Kiểm tra tính hợp lệ của các khoá ngoại cập nhật
            if (request.MaLoai.HasValue && !await _context.LoaiSps.AnyAsync(l => l.MaLoaiSP == request.MaLoai))
                return BadRequest(new { message = "Loại sản phẩm không tồn tại" });
            if (request.MaTH.HasValue && !await _context.ThuongHieus.AnyAsync(t => t.MaTH == request.MaTH))
                return BadRequest(new { message = "Thương hiệu không tồn tại" });

            // Lưu lại số lượng tồn hiện tại để không bị AutoMapper ghi đè (khóa tính năng sửa tay)
            int currentSoLuongTon = sanPham.SoLuongTon;
            bool currentTrangThai = sanPham.TrangThaiHienThi;

            // Ánh xạ các trường thông tin chữ đè lên thực thể cũ đang được context theo dõi
            _mapper.Map(request, sanPham);

            // Phục hồi lại số lượng tồn kho (không cho phép sửa bằng form nữa)
            sanPham.SoLuongTon = currentSoLuongTon;

            // Chỉ Admin mới được đổi Trạng thái hiển thị
            if (!User.IsInRole("Admin"))
            {
                sanPham.TrangThaiHienThi = currentTrangThai;
            }

            // Cập nhật ảnh cũ giữ lại
            sanPham.HinhAnh = string.IsNullOrEmpty(request.AnhCuConLai) ? null : request.AnhCuConLai;

            // Xử lý đẩy hình ảnh mới lên Cloudinary (nếu có)
            if (request.FileHinhAnhs != null && request.FileHinhAnhs.Count > 0)
            {
                var uploadedUrls = new List<string>();
                foreach (var file in request.FileHinhAnhs)
                {
                    if (file.Length > 0)
                    {
                        var uploadResult = await _cloudinaryHelper.UploadImageAsync(file, "LV_sanphams");
                        if (uploadResult != null && uploadResult.Error == null)
                        {
                            uploadedUrls.Add(uploadResult.SecureUrl.ToString());
                        }
                    }
                }
                
                if (uploadedUrls.Any())
                {
                    var newImagesString = string.Join(",", uploadedUrls);
                    sanPham.HinhAnh = string.IsNullOrEmpty(sanPham.HinhAnh) 
                        ? newImagesString 
                        : sanPham.HinhAnh + "," + newImagesString;
                }
            }

            _context.SanPhams.Update(sanPham);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Cập nhật thông tin sản phẩm và đồng bộ Cloudinary thành công!" });
        }

        [HttpPatch("{id}/doi-trang-thai")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> DoiTrangThai(int id)
        {
            var sanPham = await _context.SanPhams.FindAsync(id);
            if (sanPham == null) return NotFound(new { message = "Không tìm thấy sản phẩm" });

            sanPham.TrangThaiHienThi = !sanPham.TrangThaiHienThi;
            await _context.SaveChangesAsync();

            return Ok(new { message = sanPham.TrangThaiHienThi ? "Đã duyệt sản phẩm hiển thị lên Web" : "Đã ẩn sản phẩm khỏi Web", TrangThaiHienThi = sanPham.TrangThaiHienThi });
        }


        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Delete(int id)
        {
            var sanPham = await _context.SanPhams.FindAsync(id);
            if (sanPham == null)
            {
                return NotFound(new { message = "Không tìm thấy sản phẩm cần xóa" });
            }

            // KIỂM TRA TOÀN VẸN DỮ LIỆU: Nếu sản phẩm đã nằm trong chi tiết đơn hàng hoặc giỏ hàng, không được xóa bừa bãi
            var nằmTrongĐơnHàng = await _context.ChiTietDonHangs.AnyAsync(ct => ct.MaSP == id);
            var nằmTrongGiỏHàng = await _context.ChiTietGioHangs.AnyAsync(ct => ct.MaSP == id);

            if (nằmTrongĐơnHàng || nằmTrongGiỏHàng)
            {
                return BadRequest(new { message = "Không thể xóa sản phẩm này vì nó đã phát sinh dữ liệu trong lịch sử mua bán/giỏ hàng của hệ thống!" });
            }

            _context.SanPhams.Remove(sanPham);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Đã xóa sản phẩm khỏi hệ thống thành công!" });
        }

        [HttpGet("{id}/lich-su-nhap")]
        public async Task<IActionResult> GetImportHistory(int id)
        {
            var history = await _context.ChiTietNhapHangs
                .Include(ct => ct.NhapHang)
                    .ThenInclude(n => n.NhaCungCap)
                .Where(ct => ct.MaSP == id && ct.NhapHang.TrangThai == "Hoàn thành" && ct.SoLuongConLai > 0)
                .OrderBy(ct => ct.NhapHang.NgayNhap)
                .Select(ct => new {
                    MaNH = ct.MaNH,
                    LoaiPhieu = ct.NhapHang.LoaiPhieu,
                    NgayNhap = ct.NhapHang.NgayNhap,
                    TenNCC = ct.NhapHang.NhaCungCap != null ? ct.NhapHang.NhaCungCap.TenNCC : null,
                    SoLuong = ct.SoLuong,
                    SoLuongConLai = ct.SoLuongConLai,
                    DonGia = ct.DonGia
                })
                .ToListAsync();

            return Ok(history);
        }
    }
}
