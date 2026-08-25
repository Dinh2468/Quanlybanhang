using API_WebBDDHT.Data;
using API_WebBDDHT.DTOs;
using API_WebBDDHT.DTOs.DonHang;
using API_WebBDDHT.DTOs.Admin;
using API_WebBDDHT.DTOs.Common;
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
    public class DonHangController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IMapper _mapper;
        private readonly API_WebBDDHT.Services.IVnPayService _vnPayService;
        private readonly API_WebBDDHT.Services.IMoMoService _moMoService;
        private readonly API_WebBDDHT.Services.IGiaoHangNhanhService _ghnService;

        public DonHangController(AppDbContext context, IMapper mapper, API_WebBDDHT.Services.IVnPayService vnPayService, API_WebBDDHT.Services.IMoMoService moMoService, API_WebBDDHT.Services.IGiaoHangNhanhService ghnService)
        {
            _context = context;
            _mapper = mapper;
            _vnPayService = vnPayService;
            _moMoService = moMoService;
            _ghnService = ghnService;
        }

        [HttpGet("lichsu")]
        public async Task<IActionResult> GetLichSuDonHang()
        {
            // 1. Lấy MaTK từ Identity Claims trong Token đã giải mã
            var maTkStr = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (!int.TryParse(maTkStr, out int maTK))
            {
                return Unauthorized(new { message = "Xác thực tài khoản thất bại" });
            }

            // 2. Tìm hồ sơ Khách hàng liên kết với tài khoản này
            var khachHang = await _context.KhachHangs.FirstOrDefaultAsync(kh => kh.MaTK == maTK);
            if (khachHang == null)
            {
                return NotFound(new { message = "Không tìm thấy hồ sơ khách hàng hợp lệ" });
            }

            // 3. Truy vấn danh sách đơn hàng của khách hàng này
            var danhSachDonHang = await _context.DonHangs
                .Include(dh => dh.PhuongThucThanhToan) // Include để lấy tên PTTT (COD, MOMO...)
                .Include(dh => dh.ChiTietDonHangs)
                    .ThenInclude(ct => ct.SanPham)
                .Where(dh => dh.MaKH == khachHang.MaKH)
                .OrderByDescending(dh => dh.NgayDat) // Sắp xếp đơn hàng mới đặt lên trên cùng
                .ThenByDescending(dh => dh.MaDH)     // Nếu cùng ngày thì mã đơn lớn hơn (mới hơn) lên trước
                .ToListAsync();

            // 4. Sử dụng AutoMapper biến đổi nhanh danh sách Entity sang DTO gọn sạch
            var result = _mapper.Map<IEnumerable<DonHangLichSuDto>>(danhSachDonHang);
            foreach (var dto in result)
            {
                var productIds = danhSachDonHang
                    .First(dh => dh.MaDH == dto.MaDH)
                    .ChiTietDonHangs
                    .Select(ct => ct.MaSP)
                    .ToList();
                if (!productIds.Any())
                {
                    dto.DaDanhGia = true;
                    continue;
                }
                var reviewsCount = await _context.DanhGias
                    .CountAsync(dg => dg.MaDH == dto.MaDH && dg.MaKH == khachHang.MaKH);
                dto.DaDanhGia = reviewsCount >= productIds.Count;
            }
            return Ok(result);
        }

        [HttpGet("chitiet/{id}")]
        public async Task<IActionResult> GetChiTietDonHang(int id)
        {
            // 1. Lấy MaTK định danh từ Claims Token đã giải mã
            var maTkStr = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (!int.TryParse(maTkStr, out int maTK))
            {
                return Unauthorized(new { message = "Xác thực tài khoản thất bại" });
            }

            // 2. Tìm hồ sơ Khách hàng liên kết với tài khoản
            var khachHang = await _context.KhachHangs.FirstOrDefaultAsync(kh => kh.MaTK == maTK);
            if (khachHang == null)
            {
                return NotFound(new { message = "Không tìm thấy hồ sơ khách hàng hợp lệ" });
            }

            // 3. Truy vấn đơn hàng mục tiêu kèm theo thông tin chi tiết các món hàng bên trong
            var donHang = await _context.DonHangs
                .Include(dh => dh.PhuongThucThanhToan)
                .Include(dh => dh.ChiTietDonHangs)
                    .ThenInclude(ct => ct.SanPham) // Nạp thông tin sản phẩm để lấy TenSP và HinhAnh
                .FirstOrDefaultAsync(dh => dh.MaDH == id);

            if (donHang == null)
            {
                return NotFound(new { message = "Không tìm thấy đơn hàng yêu cầu" });
            }

            // 4. BẢO MẬT: Kiểm tra xem đơn hàng này có phải của chính khách hàng này đặt hay không
            if (donHang.MaKH != khachHang.MaKH)
            {
                return Forbid(); // Trả về HTTP 403 Forbidden - Từ chối quyền truy cập dữ liệu của người khác
            }

            // 5. Sử dụng AutoMapper ánh xạ sang cấu trúc DTO sạch sẽ gửi về Frontend
            var result = _mapper.Map<ChiTietDonHangResponseDto>(donHang);
            // Add MaVanDonGHN if needed for frontend logic
            
            foreach (var item in result.DanhSachSanPham)
            {
                item.DaDanhGia = await _context.DanhGias
                    .AnyAsync(dg => dg.MaDH == id && dg.MaSP == item.MaSP && dg.MaKH == khachHang.MaKH);
            }
            return Ok(result);
        }

        [HttpGet("tracking/{id}")]
        public async Task<IActionResult> GetTracking(int id)
        {
            var donHang = await _context.DonHangs.FindAsync(id);
            if (donHang == null)
            {
                return NotFound(new { message = "Không tìm thấy đơn hàng" });
            }

            if (string.IsNullOrEmpty(donHang.MaVanDonGHN))
            {
                return BadRequest(new { message = "Đơn hàng chưa có mã vận đơn để theo dõi" });
            }

            try
            {
                var trackingJson = await _ghnService.GetOrderTrackingAsync(donHang.MaVanDonGHN);
                return Content(trackingJson, "application/json");
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = ex.Message });
            }
        }

        [HttpPost("push-ghn/{id}")]
        [Authorize(Roles = "Admin,Nhanvien")]
        public async Task<IActionResult> PushToGHN(int id)
        {
            var donHang = await _context.DonHangs
                .Include(dh => dh.ChiTietDonHangs)
                .ThenInclude(ct => ct.SanPham)
                .FirstOrDefaultAsync(dh => dh.MaDH == id);

            if (donHang == null)
            {
                return NotFound(new { message = "Không tìm thấy đơn hàng" });
            }

            if (!string.IsNullOrEmpty(donHang.MaVanDonGHN))
            {
                return BadRequest(new { message = "Đơn hàng này đã có mã vận đơn GHN rồi." });
            }

            if (!donHang.MaQuanHuyen.HasValue || string.IsNullOrEmpty(donHang.MaPhuongXa))
            {
                return BadRequest(new { message = "Đơn hàng thiếu thông tin Quận/Huyện hoặc Phường/Xã nên không thể đẩy tự động lên GHN." });
            }

            try
            {
                var orderCode = await _ghnService.CreateShippingOrderAsync(donHang);
                donHang.MaVanDonGHN = orderCode;
                donHang.TrangThai = "Đang giao"; // Tự động chuyển trạng thái
                await _context.SaveChangesAsync();

                return Ok(new { message = "Đã đẩy đơn lên GHN thành công!", orderCode = orderCode });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = ex.Message });
            }
        }

        [HttpPost]
        [Authorize] 
        public async Task<IActionResult> TaoDonHang([FromBody] DatHangDto request)
        {
            if (request == null || string.IsNullOrEmpty(request.HoTenNguoiNhan) ||
                string.IsNullOrEmpty(request.SDTNguoiNhan) || string.IsNullOrEmpty(request.DiaChiGiaoHang))
            {
                return BadRequest(new { message = "Thông tin giao hàng không được để trống" });
            }

            // 1. Lấy MaTK định danh của thành viên từ Claims Token (Chắc chắn thành công vì có [Authorize])
            var maTkStr = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (!int.TryParse(maTkStr, out int maTK))
            {
                return Unauthorized(new { message = "Xác thực tài khoản thất bại" });
            }

            // 2. Tìm hồ sơ Khách hàng tương ứng
            var khachHang = await _context.KhachHangs
                .Include(kh => kh.HangKhachHang)
                .FirstOrDefaultAsync(kh => kh.MaTK == maTK);
            if (khachHang == null)
            {
                return NotFound(new { message = "Không tìm thấy thông tin khách hàng hợp lệ trên hệ thống" });
            }

            // 3. XÁC ĐỊNH GIỎ HÀNG ĐỂ CHỐT ĐƠN
            // Tình huống A: Giỏ hàng đã được đồng bộ với tài khoản thành viên (MaKH)
            var gioHang = await _context.GioHangs
                .Include(gh => gh.ChiTietGioHangs)
                .FirstOrDefaultAsync(gh => gh.MaKH == khachHang.MaKH);

            // Tình huống B: Nếu giỏ hàng của thành viên trống, nhưng họ vừa đăng nhập xong và gửi kèm CartToken vãng lai từ trước
            if ((gioHang == null || !gioHang.ChiTietGioHangs.Any()) && !string.IsNullOrEmpty(request.CartToken))
            {
                gioHang = await _context.GioHangs
                    .Include(gh => gh.ChiTietGioHangs)
                    .FirstOrDefaultAsync(gh => gh.CartToken == request.CartToken && gh.MaKH == null);
            }

            // Kiểm tra cuối cùng, nếu cả 2 tình huống đều không có hàng thì chặn lại
            if (gioHang == null || !gioHang.ChiTietGioHangs.Any())
            {
                return BadRequest(new { message = "Giỏ hàng của bạn đang trống, không thể tiến hành đặt hàng!" });
            }

            // Sử dụng Transaction để đảm bảo tính toàn vẹn khi trừ kho văn phòng phẩm
            using var transaction = await _context.Database.BeginTransactionAsync();
            try
            {
                // XÁC ĐỊNH SẢN PHẨM SẼ THANH TOÁN
                var itemsToCheckout = gioHang.ChiTietGioHangs.ToList();
                if (request.SelectedMaSPs != null && request.SelectedMaSPs.Any())
                {
                    itemsToCheckout = itemsToCheckout.Where(ct => request.SelectedMaSPs.Contains(ct.MaSP)).ToList();
                }

                if (!itemsToCheckout.Any())
                {
                    return BadRequest(new { message = "Không có sản phẩm nào được chọn để thanh toán." });
                }

                decimal tongTienSanPham = itemsToCheckout.Sum(ct => (ct.SoLuong ?? 0) * (ct.DonGia ?? 0));

                // Áp dụng Giảm giá VIP (Giảm trên tổng đơn)
                if (khachHang.HangKhachHang != null)
                {
                    tongTienSanPham = tongTienSanPham * (1m - (decimal)khachHang.HangKhachHang.PhanTramUuDai / 100m);
                }

                // Áp dụng phí vận chuyển thực tế lấy từ GHN (Frontend truyền lên)
                decimal tongTienDonHang = tongTienSanPham + request.PhiVanChuyen;

                // 4. Khởi tạo Đơn hàng chính thức gắn chặt với Mã khách hàng (MaKH)
                var donHangMoi = new DonHang
                {
                    MaKH = khachHang.MaKH, // Luôn luôn lưu mã thành viên, không để NULL nữa
                    HoTenNguoiNhan = request.HoTenNguoiNhan,
                    SDTNguoiNhan = request.SDTNguoiNhan,
                    DiaChiGiaoHang = request.DiaChiGiaoHang,
                    GhiChu = request.GhiChu,
                    NgayDat = DateTime.Now,
                    TongTien = tongTienDonHang,
                    TrangThai = "Chờ xử lý",
                    MaPTTT = request.MaPTTT,
                    TrangThaiThanhToan = "Chưa thanh toán",
                    MaQuanHuyen = request.MaQuanHuyen,
                    MaPhuongXa = request.MaPhuongXa
                };

                _context.DonHangs.Add(donHangMoi);
                await _context.SaveChangesAsync(); // Sinh mã đơn hàng tự động (MaDH)

                // 5. Chuyển đổi các mặt hàng từ giỏ sang chi tiết hóa đơn
                foreach (var item in itemsToCheckout)
                {
                    var sanPham = await _context.SanPhams.FindAsync(item.MaSP);
                    if (sanPham == null)
                    {
                        return NotFound(new { message = $"Sản phẩm mã {item.MaSP} không tồn tại" });
                    }

                    // Kiểm tra số lượng tồn kho của bút/vở/giấy in một lần nữa trước khi trừ kho
                    if (sanPham.SoLuongTon < item.SoLuong)
                    {
                        return BadRequest(new { message = $"Mặt hàng '{sanPham.TenSP}' trong kho không đủ số lượng để cung ứng" });
                    }

                    // Thực hiện trừ kho sản phẩm thực tế
                    sanPham.SoLuongTon -= item.SoLuong ?? 0;
                    _context.SanPhams.Update(sanPham);

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

                    // Thêm vào bảng ChiTietDonHang
                    var chiTietDonHang = new ChiTietDonHang
                    {
                        MaDH = donHangMoi.MaDH,
                        MaSP = item.MaSP,
                        SoLuong = item.SoLuong ?? 0,
                        DonGia = item.DonGia ?? 0
                    };
                    _context.ChiTietDonHangs.Add(chiTietDonHang);
                }

                // 6. XÓA SẠCH GIỎ HÀNG HOẶC XÓA SẢN PHẨM ĐÃ MUA KHỎI GIỎ HÀNG
                _context.ChiTietGioHangs.RemoveRange(itemsToCheckout);
                
                var remainingItems = gioHang.ChiTietGioHangs.Except(itemsToCheckout).ToList();
                if (!remainingItems.Any())
                {
                    _context.GioHangs.Remove(gioHang); // Giải phóng giỏ hàng cha nếu đã mua hết
                }
                else
                {
                    gioHang.TongTien = remainingItems.Sum(ct => (ct.SoLuong ?? 0) * (ct.DonGia ?? 0));
                    gioHang.NgayCapNhat = DateTime.Now;
                    _context.GioHangs.Update(gioHang);
                }

                await _context.SaveChangesAsync();

                string paymentUrl = "";
                string debugInfo = "MaPTTT nhận được: " + request.MaPTTT;
                var orderInfo = $"Thanh toan don hang {donHangMoi.MaDH}";

                if (request.MaPTTT == 3) // VNPay
                {
                    paymentUrl = _vnPayService.CreatePaymentUrl(HttpContext, donHangMoi.MaDH, tongTienDonHang, orderInfo);
                    debugInfo += " | Chạy vào VNPay block, URL: " + paymentUrl;
                }
                else if (request.MaPTTT == 4) // MoMo
                {
                    paymentUrl = await _moMoService.CreatePaymentUrlAsync(donHangMoi.MaDH, tongTienDonHang, orderInfo);
                    debugInfo += " | Chạy vào MoMo block, URL: " + paymentUrl;
                }
                else 
                {
                    debugInfo += " | KHÔNG LỌT VÀO VNPAY HAY MOMO!";
                }

                await transaction.CommitAsync();

                return Ok(new
                {
                    message = "Đặt hàng thành công!",
                    maDonHang = donHangMoi.MaDH,
                    tongTien = donHangMoi.TongTien,
                    maKhachHang = khachHang.MaKH,
                    paymentUrl = paymentUrl,
                    debug = debugInfo
                });
            }
            catch (Exception ex)
            {
                await transaction.RollbackAsync();
                return StatusCode(500, new { message = "Lỗi hệ thống khi xử lý hóa đơn đặt hàng", detail = ex.InnerException != null ? ex.InnerException.Message : ex.Message });
            }
        }

        [HttpGet]
        [Authorize(Roles = "Admin, NhanVien")] 
        public async Task<IActionResult> GetAllDonHang(
            [FromQuery] string? search = null, 
            [FromQuery] string? status = null, 
            [FromQuery] int page = 1, 
            [FromQuery] int pageSize = 20)
        {
            var query = _context.DonHangs
                .Include(dh => dh.KhachHang)
                .Include(dh => dh.PhuongThucThanhToan)
                .AsQueryable();

            if (!string.IsNullOrEmpty(status) && status != "Tất cả")
            {
                query = query.Where(dh => dh.TrangThai == status);
            }

            if (!string.IsNullOrEmpty(search))
            {
                query = query.Where(dh => dh.MaDH.ToString().Contains(search) || 
                                          dh.HoTenNguoiNhan.Contains(search) || 
                                          dh.SDTNguoiNhan.Contains(search));
            }

            query = query.OrderByDescending(dh => dh.NgayDat)
                         .ThenByDescending(dh => dh.MaDH);

            var totalCount = await query.CountAsync();
            var totalPages = (int)Math.Ceiling((double)totalCount / pageSize);

            var donHangs = await query
                .OrderByDescending(x => x.MaDH)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            var items = _mapper.Map<IEnumerable<AdminDonHangDto>>(donHangs);

            var result = new PagedResult<AdminDonHangDto>
            {
                TotalCount = totalCount,
                TotalPages = totalPages,
                Items = items,
                AdditionalData = new {
                    TotalPending = await _context.DonHangs.CountAsync(dh => dh.TrangThai == "Chờ xử lý"),
                    TotalShipping = await _context.DonHangs.CountAsync(dh => dh.TrangThai == "Đang giao"),
                    TotalSuccess = await _context.DonHangs.CountAsync(dh => dh.TrangThai == "Thành công")
                }
            };

            return Ok(result);
        }

        [HttpGet("khachhang/chitiet/{id}")]
        [Authorize]
        public async Task<IActionResult> GetChiTietDonHangKhachHang(int id)
        {
            var userIdStr = User.FindFirstValue(System.Security.Claims.ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(userIdStr) || !int.TryParse(userIdStr, out int userId))
            {
                return Unauthorized();
            }

            var donHang = await _context.DonHangs
                .Include(dh => dh.PhuongThucThanhToan)
                .FirstOrDefaultAsync(dh => dh.MaDH == id && dh.MaKH == userId);

            if (donHang == null)
            {
                return NotFound(new { message = "Không tìm thấy đơn hàng" });
            }

            return Ok(new
            {
                maDH = donHang.MaDH,
                hoTenNguoiNhan = donHang.HoTenNguoiNhan,
                sdtNguoiNhan = donHang.SDTNguoiNhan,
                diaChiGiaoHang = donHang.DiaChiGiaoHang,
                trangThai = donHang.TrangThai,
                tenPhuongThucThanhToan = donHang.PhuongThucThanhToan?.TenPhuongThuc,
                tongTien = donHang.TongTien,
                trangThaiThanhToan = donHang.TrangThaiThanhToan,
                ngayDat = donHang.NgayDat
            });
        }

        [HttpPut("khachhang/huy/{id}")]
        [Authorize]
        public async Task<IActionResult> HuyDonHang(int id)
        {
            var maTkStr = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
            if (!int.TryParse(maTkStr, out int maTK))
            {
                return Unauthorized(new { message = "Xác thực tài khoản thất bại" });
            }

            var khachHang = await _context.KhachHangs.FirstOrDefaultAsync(kh => kh.MaTK == maTK);
            if (khachHang == null)
            {
                return NotFound(new { message = "Không tìm thấy hồ sơ khách hàng" });
            }

            var donHang = await _context.DonHangs
                .Include(dh => dh.ChiTietDonHangs)
                .FirstOrDefaultAsync(dh => dh.MaDH == id && dh.MaKH == khachHang.MaKH);

            if (donHang == null)
            {
                return NotFound(new { message = "Không tìm thấy đơn hàng" });
            }

            if (donHang.TrangThai != "Chờ xử lý")
            {
                return BadRequest(new { message = "Chỉ có thể hủy đơn hàng ở trạng thái Chờ xử lý" });
            }

            // Cập nhật trạng thái
            donHang.TrangThai = "Đã hủy";

            // Hoàn lại số lượng tồn kho
            foreach (var ct in donHang.ChiTietDonHangs)
            {
                var sp = await _context.SanPhams.FindAsync(ct.MaSP);
                if (sp != null)
                {
                    sp.SoLuongTon += ct.SoLuong;
                    _context.SanPhams.Update(sp);

                    // Logic LIFO: Hoàn lại các phiếu nhập mới nhất (để dễ bán tiếp)
                    int remainingToAdd = ct.SoLuong;
                    var newBatches = await _context.ChiTietNhapHangs
                        .Include(c => c.NhapHang)
                        .Where(c => c.MaSP == ct.MaSP && c.SoLuongConLai < c.SoLuong && c.NhapHang.TrangThai == "Hoàn thành")
                        .OrderByDescending(c => c.NhapHang.NgayNhap)
                        .ToListAsync();

                    foreach (var batch in newBatches)
                    {
                        if (remainingToAdd <= 0) break;

                        int spaceAvailable = (batch.SoLuong ?? 0) - (batch.SoLuongConLai ?? 0);
                        int addition = Math.Min(spaceAvailable, remainingToAdd);
                        batch.SoLuongConLai += addition;
                        remainingToAdd -= addition;
                    }
                }
            }

            await _context.SaveChangesAsync();

            return Ok(new { message = "Hủy đơn hàng thành công" });
        }

        [HttpPut("khachhang/nhanhang/{id}")]
        [Authorize]
        public async Task<IActionResult> KhachHangNhanHang(int id)
        {
            var maTkStr = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
            if (!int.TryParse(maTkStr, out int maTK))
            {
                return Unauthorized(new { message = "Xác thực tài khoản thất bại" });
            }

            var khachHang = await _context.KhachHangs.FirstOrDefaultAsync(kh => kh.MaTK == maTK);
            if (khachHang == null)
            {
                return NotFound(new { message = "Không tìm thấy hồ sơ khách hàng" });
            }

            var donHang = await _context.DonHangs
                .FirstOrDefaultAsync(dh => dh.MaDH == id && dh.MaKH == khachHang.MaKH);

            if (donHang == null)
            {
                return NotFound(new { message = "Không tìm thấy đơn hàng" });
            }

            if (!donHang.TrangThai.Contains("Đang giao"))
            {
                return BadRequest(new { message = "Chỉ có thể xác nhận khi đơn hàng đang giao" });
            }

            if (donHang.TrangThai != "Thành công")
            {
                if (donHang.TongTien.HasValue)
                {
                    int diemCong = (int)(donHang.TongTien.Value / 10000);
                    khachHang.DiemTichLuy += diemCong;
                    
                    var hangs = await _context.HangKhachHangs.OrderByDescending(h => h.DiemToiThieu).ToListAsync();
                    var hangMoi = hangs.FirstOrDefault(h => khachHang.DiemTichLuy >= h.DiemToiThieu);
                    if (hangMoi != null)
                    {
                        khachHang.MaHang = hangMoi.MaHang;
                    }
                }
                
                donHang.TrangThai = "Thành công";
                donHang.TrangThaiThanhToan = "Đã thanh toán";
                
                try
                {
                    _context.DonHangs.Update(donHang);
                    _context.KhachHangs.Update(khachHang);
                    await _context.SaveChangesAsync();
                }
                catch (Exception ex)
                {
                    return StatusCode(500, new { message = "Lỗi hệ thống khi cập nhật", detail = ex.Message });
                }
            }

            return Ok(new { message = "Xác nhận nhận hàng thành công!" });
        }

        [HttpGet("admin/chitiet/{id}")]
        [Authorize(Roles = "Admin, NhanVien")]
        public async Task<IActionResult> GetChiTietDonHangChoAdmin(int id)
        {
            // Truy vấn đơn hàng mục tiêu, nạp đầy đủ thông tin liên kết từ bảng khách hàng, tài khoản, đến sản phẩm bên trong
            var donHang = await _context.DonHangs
                .Include(dh => dh.PhuongThucThanhToan)
                .Include(dh => dh.KhachHang)
                    .ThenInclude(kh => kh.TaiKhoan) // Nạp thêm tài khoản để lấy Email khách hàng đối soát
                .Include(dh => dh.ChiTietDonHangs)
                    .ThenInclude(ct => ct.SanPham)
                .FirstOrDefaultAsync(dh => dh.MaDH == id);

            if (donHang == null)
            {
                return NotFound(new { message = "Không tìm thấy hóa đơn đơn hàng yêu cầu trên hệ thống" });
            }
                  
            var result = _mapper.Map<AdminChiTietDonHangDto>(donHang);

            return Ok(result);
        }

        [HttpPut("capnhattrangthai/{id}")]
        [Authorize(Roles = "Admin, NhanVien")]
        public async Task<IActionResult> CapNhatTrangThai(int id, [FromBody] CapNhatTrangThaiDonHangDto request)
        {
            if (request == null)
            {
                return BadRequest(new { message = "Dữ liệu cập nhật trạng thái không hợp lệ" });
            }

            var donHang = await _context.DonHangs.FindAsync(id);
            if (donHang == null)
            {
                return NotFound(new { message = "Không tìm thấy đơn hàng yêu cầu" });
            }

            // Tiến hành cập nhật nếu dữ liệu truyền lên không rỗng
            if (!string.IsNullOrEmpty(request.TrangThai))
            {
                // Logic Tích lũy điểm và cập nhật hạng khi đơn hàng được "Hoàn thành" hoặc "Thành công"
                bool isSuccessStatus = request.TrangThai == "Hoàn thành" || request.TrangThai == "Thành công";
                bool wasSuccessStatus = donHang.TrangThai == "Hoàn thành" || donHang.TrangThai == "Thành công";

                if (isSuccessStatus && !wasSuccessStatus && donHang.MaKH != null)
                {
                    var khachHang = await _context.KhachHangs.FindAsync(donHang.MaKH);
                    if (khachHang != null && donHang.TongTien.HasValue)
                    {
                        int diemCong = (int)(donHang.TongTien.Value / 10000);
                        khachHang.DiemTichLuy += diemCong;

                        // Cập nhật hạng thành viên
                        var hangs = await _context.HangKhachHangs.OrderByDescending(h => h.DiemToiThieu).ToListAsync();
                        var hangMoi = hangs.FirstOrDefault(h => khachHang.DiemTichLuy >= h.DiemToiThieu);
                        if (hangMoi != null)
                        {
                            khachHang.MaHang = hangMoi.MaHang;
                        }

                        _context.KhachHangs.Update(khachHang);
                    }
                }
                
                // Nếu Admin hủy đơn hàng, tiến hành hoàn lại kho
                if (request.TrangThai == "Đã hủy" && donHang.TrangThai != "Đã hủy")
                {
                    var donHangDetails = await _context.DonHangs
                        .Include(dh => dh.ChiTietDonHangs)
                        .FirstOrDefaultAsync(dh => dh.MaDH == id);
                    
                    if (donHangDetails != null)
                    {
                        foreach (var ct in donHangDetails.ChiTietDonHangs)
                        {
                            var sp = await _context.SanPhams.FindAsync(ct.MaSP);
                            if (sp != null)
                            {
                                sp.SoLuongTon += ct.SoLuong;
                                _context.SanPhams.Update(sp);

                                int remainingToAdd = ct.SoLuong;
                                var newBatches = await _context.ChiTietNhapHangs
                                    .Include(c => c.NhapHang)
                                    .Where(c => c.MaSP == ct.MaSP && c.SoLuongConLai < c.SoLuong && c.NhapHang.TrangThai == "Hoàn thành")
                                    .OrderByDescending(c => c.NhapHang.NgayNhap)
                                    .ToListAsync();

                                foreach (var batch in newBatches)
                                {
                                    if (remainingToAdd <= 0) break;
                                    int spaceAvailable = (batch.SoLuong ?? 0) - (batch.SoLuongConLai ?? 0);
                                    int addition = Math.Min(spaceAvailable, remainingToAdd);
                                    batch.SoLuongConLai += addition;
                                    remainingToAdd -= addition;
                                }
                            }
                        }
                    }
                }

                donHang.TrangThai = request.TrangThai;
                
                if (request.TrangThai == "Đang giao" && !string.IsNullOrEmpty(request.MaVanDonGHN))
                {
                    donHang.MaVanDonGHN = request.MaVanDonGHN;
                }
            }

            if (!string.IsNullOrEmpty(request.TrangThaiThanhToan))
            {
                donHang.TrangThaiThanhToan = request.TrangThaiThanhToan;
            }

            try
            {
                _context.DonHangs.Update(donHang);
                await _context.SaveChangesAsync();

                return Ok(new { message = "Cập nhật trạng thái đơn hàng thành công!", maDH = id });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Lỗi hệ thống khi cập nhật trạng thái hóa đơn", detail = ex.Message });
            }
        }

        [HttpPost("{id}/retry-payment")]
        [Authorize(Roles = "KhachHang")]
        public async Task<IActionResult> RetryPayment(int id)
        {
            try
            {
                var userIdClaim = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier);
                if (userIdClaim == null || !int.TryParse(userIdClaim.Value, out int maTK))
                {
                    return Unauthorized(new { message = "Không xác định được danh tính người dùng" });
                }

                var khachHang = await _context.KhachHangs.FirstOrDefaultAsync(kh => kh.MaTK == maTK);
                if (khachHang == null)
                    return Unauthorized(new { message = "Tài khoản không phải là khách hàng hợp lệ" });

                var donHang = await _context.DonHangs
                    .Include(dh => dh.PhuongThucThanhToan)
                    .FirstOrDefaultAsync(dh => dh.MaDH == id && dh.MaKH == khachHang.MaKH);

                if (donHang == null)
                    return NotFound(new { message = "Không tìm thấy đơn hàng" });

                if (donHang.TrangThai != "Chờ xử lý" || donHang.TrangThaiThanhToan != "Chưa thanh toán")
                    return BadRequest(new { message = "Đơn hàng không ở trạng thái hợp lệ để thanh toán lại" });

                if (donHang.PhuongThucThanhToan == null)
                    return BadRequest(new { message = "Phương thức thanh toán không hợp lệ" });

                string paymentUrl = "";
                string orderInfo = $"Thanh toán lại cho đơn hàng {donHang.MaDH}";

                var tenPhuongThuc = donHang.PhuongThucThanhToan.TenPhuongThuc.ToLower();
                if (tenPhuongThuc.Contains("vnpay"))
                {
                    paymentUrl = _vnPayService.CreatePaymentUrl(HttpContext, donHang.MaDH, donHang.TongTien ?? 0, orderInfo);
                }
                else if (tenPhuongThuc.Contains("momo"))
                {
                    paymentUrl = await _moMoService.CreatePaymentUrlAsync(donHang.MaDH, donHang.TongTien ?? 0, orderInfo);
                }
                else
                {
                    return BadRequest(new { message = "Đơn hàng này không sử dụng thanh toán online" });
                }

                return Ok(new { message = "Tạo link thanh toán thành công", paymentUrl = paymentUrl });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Lỗi khi tạo link thanh toán", detail = ex.Message });
            }
        }
    }
}