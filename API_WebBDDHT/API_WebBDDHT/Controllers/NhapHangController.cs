using API_WebBDDHT.Data;
using API_WebBDDHT.DTOs;
using API_WebBDDHT.DTOs.NhapHang;
using API_WebBDDHT.Entities;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace API_WebBDDHT.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class NhapHangController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IMapper _mapper;

        public NhapHangController (AppDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        // ========================================================
        // 1. API: GET /api/PhieuNhapHang - LẤY DANH SÁCH PHIẾU NHẬP
        // ========================================================
        [HttpGet]
        public async Task<IActionResult> GetAll(
            [FromQuery] string? search = null,
            [FromQuery] int? page = null, 
            [FromQuery] int pageSize = 20)
        {
            var query = _context.NhapHangs
                .Include(n => n.NhanVien)
                .Include(n => n.NhaCungCap)
                .AsQueryable();

            if (!string.IsNullOrEmpty(search))
            {
                query = query.Where(n => (n.NhaCungCap != null && n.NhaCungCap.TenNCC.Contains(search)) || 
                                         (n.NhanVien != null && n.NhanVien.HoTen.Contains(search)));
            }

            query = query.OrderByDescending(n => n.NgayNhap).ThenByDescending(n => n.MaNH);

            if (page.HasValue)
            {
                var totalCount = await query.CountAsync();
                var totalPages = (int)Math.Ceiling((double)totalCount / pageSize);

                var phieuNhaps = await query
                    .OrderByDescending(x => x.MaNH)
                    .Skip((page.Value - 1) * pageSize)
                    .Take(pageSize)
                    .ToListAsync();

                var items = _mapper.Map<IEnumerable<PhieuNhapDto>>(phieuNhaps);

                return Ok(new PagedResult<PhieuNhapDto>
                {
                    TotalCount = totalCount,
                    TotalPages = totalPages,
                    Items = items
                });
            }
            else
            {
                var phieuNhaps = await query.ToListAsync();
                var result = _mapper.Map<IEnumerable<PhieuNhapDto>>(phieuNhaps);
                return Ok(result);
            }
        }

        // ========================================================
        // 2. API: GET /api/PhieuNhapHang/{id} - XEM CHI TIẾT PHIẾU
        // ========================================================
        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var phieu = await _context.NhapHangs
                .Include(n => n.NhanVien)
                .Include(n => n.NhaCungCap)
                .Include(n => n.ChiTietNhapHangs)
                    .ThenInclude(ct => ct.SanPham)
                .FirstOrDefaultAsync(n => n.MaNH == id);

            if (phieu == null)
            {
                return NotFound(new { message = "Không tìm thấy phiếu nhập hàng yêu cầu" });
            }

            var result = _mapper.Map<PhieuNhapDto>(phieu);
            return Ok(result);
        }

        // =============================================================
        // 3. API: POST /api/PhieuNhapHang - TẠO PHIẾU NHẬP (TRẠNG THÁI TẠM)
        // =============================================================
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] TaoPhieuNhapDto request)
        {
            if (request == null || !request.ChiTietNhapHangs.Any())
            {
                return BadRequest(new { message = "Danh sách sản phẩm nhập kho không được để trống" });
            }

            // 1. Lấy MaTK định danh từ Token
            var maTkStr = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (!int.TryParse(maTkStr, out int maTK)) return Unauthorized();

            // 2. Kiểm tra tài khoản và VaiTro trong hệ thống
            var taiKhoan = await _context.TaiKhoans
                .Include(tk => tk.NhanVien) // Nạp kèm hồ sơ nhân viên nếu có
                .FirstOrDefaultAsync(tk => tk.MaTK == maTK);

            if (taiKhoan == null || !taiKhoan.TrangThai)
            {
                return BadRequest(new { message = "Tài khoản không tồn tại hoặc đã bị khóa" });
            }

            // 3. Phân quyền: Chỉ Admin hoặc Nhân viên mới được phép vào kho lập phiếu
            string vaiTro = taiKhoan.VaiTro ?? "KhachHang";
            if (!vaiTro.Equals("Admin", StringComparison.OrdinalIgnoreCase) &&
                !vaiTro.Equals("NhanVien", StringComparison.OrdinalIgnoreCase))
            {
                return Forbid(); // Trả về 403 Forbidden nếu là Khách hàng cố tình gọi API
            }

            // Xác định MaNV (Nếu là Admin có thể không có hồ sơ NV thì chấp nhận gán null)
            int? maNVThucHien = taiKhoan.NhanVien?.MaNV;

            // 4. Kiểm tra nhà cung cấp
            if (request.MaNCC.HasValue && !await _context.NhaCungCaps.AnyAsync(n => n.MaNCC == request.MaNCC))
            {
                return BadRequest(new { message = "Nhà cung cấp không tồn tại trên hệ thống" });
            }

            using var transaction = await _context.Database.BeginTransactionAsync();
            try
            {
                // Khởi tạo phiếu nhập cha
                var phieuNhapMoi = new NhapHang
                {
                    MaNV = maNVThucHien, // Gán mã nhân viên hoặc null nếu là Admin tối cao thực hiện
                    MaNCC = request.MaNCC,
                    NgayNhap = DateTime.Now,
                    TrangThai = "Chờ Xác Nhận",
                    LoaiPhieu = request.LoaiPhieu,
                    TongTien = request.ChiTietNhapHangs.Sum(ct => ct.SoLuong * ct.DonGia)
                };

                _context.NhapHangs.Add(phieuNhapMoi);
                await _context.SaveChangesAsync(); // Lưu để sinh tự tăng MaNH

                // Tạo các bản ghi chi tiết phiếu nhập con
                foreach (var item in request.ChiTietNhapHangs)
                {
                    if (!await _context.SanPhams.AnyAsync(sp => sp.MaSP == item.MaSP))
                    {
                        return NotFound(new { message = $"Sản phẩm mã {item.MaSP} không tồn tại trên hệ thống" });
                    }

                    var chiTiet = new ChiTietNhapHang
                    {
                        MaNH = phieuNhapMoi.MaNH,
                        MaSP = item.MaSP,
                        SoLuong = item.SoLuong,
                        DonGia = item.DonGia
                    };
                    _context.ChiTietNhapHangs.Add(chiTiet);
                }

                await _context.SaveChangesAsync();
                await transaction.CommitAsync();

                return Ok(new { message = "Tạo phiếu nhập kho thành công!", maPhieuNhap = phieuNhapMoi.MaNH, tongTien = phieuNhapMoi.TongTien });
            }
            catch (Exception ex)
            {
                await transaction.RollbackAsync();
                return StatusCode(500, new { message = "Gặp sự cố hệ thống khi lập phiếu nhập", detail = ex.Message });
            }
        }

        // ==============================================================================
        // TÍNH NĂNG MỚI: CẬP NHẬT PHIẾU NHẬP 
        // ==============================================================================
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateReceipt(int id, [FromBody] TaoPhieuNhapDto request)
        {
            if (request == null || !request.ChiTietNhapHangs.Any())
            {
                return BadRequest(new { message = "Danh sách sản phẩm nhập kho không được để trống" });
            }

            var phieu = await _context.NhapHangs
                .Include(n => n.ChiTietNhapHangs)
                .FirstOrDefaultAsync(n => n.MaNH == id);

            if (phieu == null) return NotFound(new { message = "Không tìm thấy phiếu nhập kho yêu cầu" });

            if (phieu.TrangThai == "Hoàn thành" || phieu.TrangThai == "Đã hủy")
            {
                return BadRequest(new { message = $"Phiếu nhập đã ở trạng thái [{phieu.TrangThai}], không thể chỉnh sửa!" });
            }

            var maTkStr = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (!int.TryParse(maTkStr, out int maTK)) return Unauthorized();

            var taiKhoan = await _context.TaiKhoans.FirstOrDefaultAsync(tk => tk.MaTK == maTK);
            if (taiKhoan == null || !taiKhoan.TrangThai)
            {
                return BadRequest(new { message = "Tài khoản không hợp lệ" });
            }

            string vaiTro = taiKhoan.VaiTro ?? "KhachHang";
            if (!vaiTro.Equals("Admin", StringComparison.OrdinalIgnoreCase) && !vaiTro.Equals("NhanVien", StringComparison.OrdinalIgnoreCase))
            {
                return Forbid();
            }

            if (request.MaNCC.HasValue && !await _context.NhaCungCaps.AnyAsync(n => n.MaNCC == request.MaNCC))
            {
                return BadRequest(new { message = "Nhà cung cấp không tồn tại trên hệ thống" });
            }

            using var transaction = await _context.Database.BeginTransactionAsync();
            try
            {
                phieu.MaNCC = request.MaNCC;
                phieu.LoaiPhieu = request.LoaiPhieu;
                phieu.TongTien = request.ChiTietNhapHangs.Sum(ct => ct.SoLuong * ct.DonGia);

                _context.ChiTietNhapHangs.RemoveRange(phieu.ChiTietNhapHangs);

                foreach (var item in request.ChiTietNhapHangs)
                {
                    if (!await _context.SanPhams.AnyAsync(sp => sp.MaSP == item.MaSP))
                    {
                        return NotFound(new { message = $"Sản phẩm mã {item.MaSP} không tồn tại trên hệ thống" });
                    }

                    var chiTiet = new ChiTietNhapHang
                    {
                        MaNH = phieu.MaNH,
                        MaSP = item.MaSP,
                        SoLuong = item.SoLuong,
                        DonGia = item.DonGia
                    };
                    _context.ChiTietNhapHangs.Add(chiTiet);
                }

                _context.NhapHangs.Update(phieu);
                await _context.SaveChangesAsync();
                await transaction.CommitAsync();

                return Ok(new { message = "Chỉnh sửa phiếu nhập kho thành công!", maPhieuNhap = phieu.MaNH, tongTien = phieu.TongTien });
            }
            catch (Exception ex)
            {
                await transaction.RollbackAsync();
                return StatusCode(500, new { message = "Gặp sự cố hệ thống khi sửa phiếu nhập", detail = ex.Message });
            }
        }
        
        // ==============================================================================
        // 4. API: PUT /api/PhieuNhapHang/capnhattrangthai/{id} - DUYỆT PHIẾU & CỘNG KHO
        // ==============================================================================
        [HttpPut("capnhattrangthai/{id}")]
        public async Task<IActionResult> UpdateStatus(int id, [FromBody] CapNhatTrangThaiNhapDto request)
        {
            var phieu = await _context.NhapHangs
                .Include(n => n.ChiTietNhapHangs)
                .FirstOrDefaultAsync(n => n.MaNH == id);

            if (phieu == null) return NotFound(new { message = "Không tìm thấy phiếu nhập kho yêu cầu" });

            // Nếu phiếu đã Hoàn thành hoặc đã Hủy từ trước thì không được sửa đổi nữa
            if (phieu.TrangThai == "Hoàn thành" || phieu.TrangThai == "Đã hủy")
            {
                return BadRequest(new { message = $"Phiếu nhập này đã ở trạng thái [{phieu.TrangThai}], không thể thay đổi!" });
            }

            using var transaction = await _context.Database.BeginTransactionAsync();
            try
            {
                string trangThaiMoi = request.TrangThai;

                // NGHIỆP VỤ PHÂN QUYỀN: Nhân viên không được phép duyệt phiếu
                if (trangThaiMoi == "Hoàn thành")
                {
                    var maTkStr = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                    if (!int.TryParse(maTkStr, out int maTK)) return Unauthorized();

                    var taiKhoan = await _context.TaiKhoans.FirstOrDefaultAsync(tk => tk.MaTK == maTK);
                    if (taiKhoan == null || !taiKhoan.TrangThai) return Unauthorized();

                    string vaiTro = taiKhoan.VaiTro ?? "";
                    if (!vaiTro.Equals("Admin", StringComparison.OrdinalIgnoreCase))
                    {
                        return StatusCode(403, new { message = "Chỉ Quản trị viên (Admin) mới có quyền duyệt phiếu và nhập kho!" });
                    }
                }

                // NGHIỆP VỤ QUAN TRỌNG: Nếu chuyển trạng thái sang "Hoàn thành" -> Tiến hành cộng dồn vào tồn kho thực tế
                if (trangThaiMoi == "Hoàn thành")
                {
                    foreach (var item in phieu.ChiTietNhapHangs)
                    {
                        var sanPham = await _context.SanPhams.FindAsync(item.MaSP);
                        if (sanPham != null)
                        {
                            if (phieu.LoaiPhieu == "Điều chỉnh giảm")
                            {
                                if (sanPham.SoLuongTon < item.SoLuong)
                                {
                                    await transaction.RollbackAsync();
                                    return BadRequest(new { message = $"Sản phẩm {sanPham.TenSP} không đủ tồn kho để giảm (Tồn: {sanPham.SoLuongTon}, Yêu cầu giảm: {item.SoLuong})" });
                                }
                                sanPham.SoLuongTon -= item.SoLuong ?? 0;
                                item.SoLuongConLai = 0; // Điều chỉnh giảm thì phiếu này không có tồn kho để trừ sau này

                                // Logic FIFO: Trừ dần các phiếu nhập cũ
                                int remainingToDeduct = item.SoLuong ?? 0;
                                var oldBatches = await _context.ChiTietNhapHangs
                                    .Include(ct => ct.NhapHang)
                                    .Where(ct => ct.MaSP == item.MaSP && ct.SoLuongConLai > 0 && ct.NhapHang.TrangThai == "Hoàn thành")
                                    .OrderBy(ct => ct.NhapHang.NgayNhap)
                                    .ToListAsync();

                                foreach (var batch in oldBatches)
                                {
                                    if (remainingToDeduct <= 0) break;

                                    int deduction = Math.Min(batch.SoLuongConLai ?? 0, remainingToDeduct);
                                    batch.SoLuongConLai -= deduction;
                                    remainingToDeduct -= deduction;
                                }
                            }
                            else
                            {
                                // Nhập hàng hoặc Điều chỉnh tăng
                                sanPham.SoLuongTon += item.SoLuong ?? 0; 
                                item.SoLuongConLai = item.SoLuong; 
                            }
                            _context.SanPhams.Update(sanPham);
                        }
                    }
                }

                phieu.TrangThai = trangThaiMoi;
                _context.NhapHangs.Update(phieu);

                await _context.SaveChangesAsync();
                await transaction.CommitAsync();

                return Ok(new { message = $"Cập nhật trạng thái phiếu nhập sang [{trangThaiMoi}] và đồng bộ kho hàng thành công!" });
            }
            catch (Exception ex)
            {
                await transaction.RollbackAsync();
                return StatusCode(500, new { message = "Lỗi hệ thống khi duyệt phiếu nhập kho", detail = ex.Message });
            }
        }

        // ========================================================
        // 5. API: DELETE /api/PhieuNhapHang/{id} - XÓA PHIẾU TẠM
        // ========================================================
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var phieu = await _context.NhapHangs.FindAsync(id);
            if (phieu == null) return NotFound(new { message = "Không tìm thấy phiếu nhập cần xóa" });

            // CHỈ cho phép xóa phiếu nếu phiếu đó vẫn đang ở trạng thái "Chờ Xác Nhận" hoặc "Chờ nhận hàng" (chưa cộng kho)
            if (phieu.TrangThai != "Chờ Xác Nhận")
            {
                return BadRequest(new { message = "Không thể xóa phiếu nhập kho đã hoàn thành hoặc đã hủy!" });
            }

            // Nhờ cấu hình DeleteBehavior.Cascade đã làm ở DbContext, chi tiết phiếu con sẽ tự động được xóa sạch
            _context.NhapHangs.Remove(phieu);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Đã xóa phiếu nhập kho tạm khỏi hệ thống thành công!" });
        }
    }
}