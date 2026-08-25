using API_WebBDDHT.Data;
using API_WebBDDHT.DTOs.Auth;
using API_WebBDDHT.DTOs.TaiKhoan;
using AutoMapper;
using API_WebBDDHT.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using CloudinaryDotNet;
using CloudinaryDotNet.Actions;
using BCryptNet = BCrypt.Net.BCrypt;
using API_WebBDDHT.Helpers;
using API_WebBDDHT.Services;
using API_WebBDDHT.DTOs;


namespace API_WebBDDHT.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TaiKhoanController : ControllerBase
    {
        private readonly AppDbContext _context; // Khai báo biến để truy cập cơ sở dữ liệu
        private readonly IConfiguration _configuration; // Khai báo biến để truy cập cấu hình (chứa chuỗi kết nối)
        private readonly IMapper _mapper; // Khai báo biến để sử dụng AutoMapper
        private readonly ICloudinaryHelper _cloudinaryHelper; // Khai báo biến để sử dụng CloudinaryHelper
        private readonly IEmailService _emailService;
        public TaiKhoanController(AppDbContext context, IConfiguration configuration, IMapper mapper, ICloudinaryHelper cloudinaryHelper, IEmailService emailService)
        {
            _context = context;
            _configuration = configuration;
            _mapper = mapper;
            _cloudinaryHelper = cloudinaryHelper;
            _emailService = emailService;
        }

        [HttpPost("dangnhap")]
        public async Task<IActionResult> DangNhap([FromBody] DangNhapDto request)
        {
            if (request == null || string.IsNullOrEmpty(request.TenDangNhap) || string.IsNullOrEmpty(request.MatKhau))
            {
                return BadRequest(new { message = "Du lieu dau vao khong hop le" });
            }

            // Tìm tài khoản đồng thời Include thông tin KhachHang và NhanVien đi kèm
            var taiKhoan = await _context.TaiKhoans
                .Include(tk => tk.KhachHang)
                .Include(tk => tk.NhanVien)
                .FirstOrDefaultAsync(tk => tk.TenDangNhap == request.TenDangNhap || tk.Email == request.TenDangNhap);

            // Kiểm tra tài khoản tồn tại và khớp mật khẩu (so sánh trực tiếp chuỗi)
            if (taiKhoan == null || ! BCryptNet.Verify(request.MatKhau, taiKhoan.MatKhau))
            {
                return Unauthorized(new { message = "Tên đăng nhập hoặc mật khẩu không đúng" });
            }

            // Kiểm tra trạng thái hoạt động (TrangThai == true)
            if (!taiKhoan.TrangThai)
            {
                return BadRequest(new { message = "Tai khoan hien dang bi khoa" });
            }

            // Xác định vai trò, mã định danh cụ thể (MaKH/MaNV) và họ tên hiển thị lên giao diện React
            string vaiTro = taiKhoan.VaiTro ?? "KhachHang";
            int? maNguoiDung = null;
            string hoTen = "Nguoi dung";

            if (vaiTro.Equals("KhachHang", StringComparison.OrdinalIgnoreCase) && taiKhoan.KhachHang != null)
            {
                maNguoiDung = taiKhoan.KhachHang.MaKH;
                hoTen = taiKhoan.KhachHang.HoTen;
            }
            else if (taiKhoan.NhanVien != null) // Trường hợp Admin hoặc NhanVien
            {
                maNguoiDung = taiKhoan.NhanVien.MaNV;
                hoTen = taiKhoan.NhanVien.HoTen;
            }

            // Tạo chuỗi mã hóa JWT Token
            string token = GenerateJwtToken(taiKhoan, vaiTro, maNguoiDung);

            // Trả về dữ liệu thành công cho Frontend React lưu vào localStorage/Redux
            var result = new DangNhapResultDto
            (
                Token: token,
                TenDangNhap: taiKhoan.TenDangNhap,
                Email: taiKhoan.Email,
                VaiTro: vaiTro,
                MaTK: taiKhoan.MaTK,
                MaNguoiDung: maNguoiDung,
                HoTen: hoTen,
                Avatar: taiKhoan.Avatar
            );

            return Ok(result);
        }

        [HttpPost("google-login")]
        public async Task<IActionResult> GoogleLogin([FromBody] GoogleLoginDto request)
        {
            if (request == null || string.IsNullOrEmpty(request.IdToken))
            {
                return BadRequest(new { message = "Token không hợp lệ" });
            }

            try
            {
                using var client = new HttpClient();
                var response = await client.GetAsync($"https://oauth2.googleapis.com/tokeninfo?id_token={request.IdToken}");
                
                if (!response.IsSuccessStatusCode) 
                {
                    return BadRequest(new { message = "Xác thực Google thất bại" });
                }

                var json = await response.Content.ReadAsStringAsync();
                using var jsonDoc = System.Text.Json.JsonDocument.Parse(json);
                var payload = jsonDoc.RootElement;

                var email = payload.GetProperty("email").GetString();
                var name = payload.TryGetProperty("name", out var nameElement) ? nameElement.GetString() : "Khách hàng";
                var picture = payload.TryGetProperty("picture", out var picElement) ? picElement.GetString() : null;

                if (string.IsNullOrEmpty(email)) 
                {
                    return BadRequest(new { message = "Không thể lấy email từ tài khoản Google" });
                }

                var taiKhoan = await _context.TaiKhoans
                    .Include(tk => tk.KhachHang)
                    .Include(tk => tk.NhanVien)
                    .FirstOrDefaultAsync(tk => tk.Email == email);

                if (taiKhoan == null)
                {
                    using var transaction = await _context.Database.BeginTransactionAsync();
                    try 
                    {
                        taiKhoan = new TaiKhoan
                        {
                            TenDangNhap = email,
                            Email = email,
                            MatKhau = BCryptNet.HashPassword(Guid.NewGuid().ToString()), 
                            VaiTro = "KhachHang",
                            TrangThai = true,
                            Avatar = picture
                        };
                        _context.TaiKhoans.Add(taiKhoan);
                        await _context.SaveChangesAsync();

                        var khachHang = new KhachHang
                        {
                            MaTK = taiKhoan.MaTK,
                            HoTen = name,
                            DiemTichLuy = 0,
                            MaHang = 1
                        };
                        _context.KhachHangs.Add(khachHang);
                        await _context.SaveChangesAsync();
                        await transaction.CommitAsync();

                        taiKhoan.KhachHang = khachHang; 
                    }
                    catch(Exception ex) 
                    {
                        await transaction.RollbackAsync();
                        return StatusCode(500, new { message = "Lỗi khi tự động đăng ký tài khoản", detail = ex.Message });
                    }
                }
                else if (!taiKhoan.TrangThai)
                {
                    return BadRequest(new { message = "Tài khoản hiện đang bị khóa" });
                }

                string vaiTro = taiKhoan.VaiTro ?? "KhachHang";
                int? maNguoiDung = null;
                string hoTen = "Người dùng";

                if (vaiTro.Equals("KhachHang", StringComparison.OrdinalIgnoreCase) && taiKhoan.KhachHang != null)
                {
                    maNguoiDung = taiKhoan.KhachHang.MaKH;
                    hoTen = taiKhoan.KhachHang.HoTen;
                }
                else if (taiKhoan.NhanVien != null)
                {
                    maNguoiDung = taiKhoan.NhanVien.MaNV;
                    hoTen = taiKhoan.NhanVien.HoTen;
                }

                string token = GenerateJwtToken(taiKhoan, vaiTro, maNguoiDung);

                var result = new DangNhapResultDto
                (
                    Token: token,
                    TenDangNhap: taiKhoan.TenDangNhap,
                    Email: taiKhoan.Email,
                    VaiTro: vaiTro,
                    MaTK: taiKhoan.MaTK,
                    MaNguoiDung: maNguoiDung,
                    HoTen: hoTen,
                    Avatar: taiKhoan.Avatar
                );

                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Đã xảy ra lỗi khi đăng nhập bằng Google", detail = ex.Message });
            }
        }

        // Hàm sinh chuỗi JWT Token bảo mật
        private string GenerateJwtToken(TaiKhoan taiKhoan, string vaiTro, int? maNguoiDung)
        {
            var jwtSettings = _configuration.GetSection("Jwt");
            var keyStr = jwtSettings["Key"];

            if (string.IsNullOrEmpty(keyStr))
            {
                // Khóa dự phòng mặc định nếu file appsettings.json chưa cấu hình
                keyStr = "CaiNayLaKeyBiMatSieuCapBaoMat123456!";
            }

            var key = Encoding.UTF8.GetBytes(keyStr);

            // Tạo các Claim lưu trong Token
            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.NameIdentifier, taiKhoan.MaTK.ToString()),
                new Claim(ClaimTypes.Name, taiKhoan.TenDangNhap),
                new Claim(ClaimTypes.Role, vaiTro)
            };

            // Nếu có mã liên kết (MaKH/MaNV), đính kèm vào Token để sau này API khác dễ lấy ra xử lý
            if (maNguoiDung.HasValue)
            {
                claims.Add(new Claim("MaNguoiDung", maNguoiDung.Value.ToString()));
            }

            var durationInMinutes = jwtSettings["DurationInMinutes"] != null
                ? double.Parse(jwtSettings["DurationInMinutes"]!)
                : 180; // Mặc định hết hạn sau 3 tiếng

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(claims),
                Expires = DateTime.UtcNow.AddMinutes(durationInMinutes),
                Issuer = jwtSettings["Issuer"] ?? "http://localhost:5000",
                Audience = jwtSettings["Audience"] ?? "http://localhost:3000",
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
            };

            var tokenHandler = new JwtSecurityTokenHandler();
            var token = tokenHandler.CreateToken(tokenDescriptor);

            return tokenHandler.WriteToken(token);
        }

        [HttpPost("dangky")]
        public async Task<IActionResult> DangKy([FromBody] DangKyDto request)
        {
            if (request == null || string.IsNullOrEmpty(request.TenDangNhap) || string.IsNullOrEmpty(request.Email) || string.IsNullOrEmpty(request.MatKhau) || string.IsNullOrEmpty(request.HoTen))
            {
                return BadRequest(new { message = "Du lieu dau vao khong hop le" });
            }
            // 1. Kiểm tra xem tên đăng nhập đã tồn tại chưa
            var tenDangNhapTonTai = await _context.TaiKhoans.AnyAsync(tk => tk.TenDangNhap!.ToLower() == request.TenDangNhap.ToLower());
            if (tenDangNhapTonTai)
            {
                return BadRequest(new { message = "Tên đăng nhập đã tồn tại" });
            }

            // 2. Kiểm tra xem email đã tồn tại chưa
            var emailTonTai = await _context.TaiKhoans.AnyAsync(tk => tk.Email!.ToLower() == request.Email.ToLower());
            if (emailTonTai)
            {
                return BadRequest(new { message = "Email đã tồn tại" });
            }

            using var transaction = await _context.Database.BeginTransactionAsync();// Sử dụng Transaction để đảm bảo tính toàn vẹn dữ liệu khi thêm vào nhiều bảng
            try
            {
                var taiKhoanMoi = _mapper.Map<TaiKhoan>(request);

                taiKhoanMoi.TenDangNhap = request.TenDangNhap;
                taiKhoanMoi.Email = request.Email;
                taiKhoanMoi.MatKhau = BCryptNet.HashPassword(request.MatKhau);// Mã hóa mật khẩu trước khi lưu vào cơ sở dữ liệu
                taiKhoanMoi.VaiTro = "KhachHang";
                taiKhoanMoi.TrangThai = true;
                _context.TaiKhoans.Add(taiKhoanMoi);
                await _context.SaveChangesAsync();

                var khachHangMoi = _mapper.Map<KhachHang>(request);
                khachHangMoi.MaTK = taiKhoanMoi.MaTK;
                khachHangMoi.DiemTichLuy = 0;
                khachHangMoi.MaHang = 1;
                _context.KhachHangs.Add(khachHangMoi);
                await _context.SaveChangesAsync();

                await transaction.CommitAsync();
                return Ok(new { message = "Đăng ký tài khoản văn phòng phẩm thành công!" });
            }
            catch (Exception ex)
            {
                await transaction.RollbackAsync();
                return StatusCode(500, new { message = "Đã xảy ra lỗi trong quá trình xử lý", detail = ex.Message });
            }
        }

        [HttpGet("thongtin")]
        [Authorize] // Bắt buộc phải truyền JWT Token hợp lệ mới gọi được API này
        public async Task<IActionResult> GetThongTin()
        {
            // 1. Lấy MaTK (NameIdentifier) đã được Middleware giải mã tự động từ Token
            var maTkStr = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(maTkStr) || !int.TryParse(maTkStr, out int maTK))
            {
                return Unauthorized(new { message = "Token không hợp lệ hoặc đã hết hạn" });
            }

            // 2. Truy vấn Database lấy thông tin tài khoản kèm chi tiết vai trò khách hàng/nhân viên
            var taiKhoan = await _context.TaiKhoans
                .Include(tk => tk.KhachHang)
                    .ThenInclude(kh => kh.HangKhachHang) // Lấy thông tin hạng thành viên nếu là khách hàng
                .Include(tk => tk.NhanVien)
                .FirstOrDefaultAsync(tk => tk.MaTK == maTK);

            if (taiKhoan == null)
            {
                return NotFound(new { message = "Không tìm thấy thông tin tài khoản" });
            }

            string vaiTro = taiKhoan.VaiTro ?? "KhachHang";
            //
            if (vaiTro.Equals("KhachHang", StringComparison.OrdinalIgnoreCase) && taiKhoan.NhanVien == null)
            {
                var resultDto = new ThongTinTaiKhoanDto
                (
                    MaTK: taiKhoan.MaTK,
                    TenDangNhap: taiKhoan.TenDangNhap,
                    VaiTro: vaiTro,
                    HoTen: taiKhoan.KhachHang?.HoTen ?? "Người dùng",
                    SoDienThoai: taiKhoan.KhachHang?.SDT,
                    DiaChi: taiKhoan.KhachHang?.DiaChi,
                    Email: taiKhoan.Email,
                    DiemTichLuy: taiKhoan.KhachHang?.DiemTichLuy.ToString(),
                    TenHangThanhVien: taiKhoan.KhachHang?.HangKhachHang?.TenHang,
                    Avatar: taiKhoan.Avatar
                );
                return Ok(resultDto);
            }

            var resultNhanVien = new ThongTinTaiKhoanDto
            (
                MaTK: taiKhoan.MaTK,
                TenDangNhap: taiKhoan.TenDangNhap,
                VaiTro: vaiTro,
                HoTen: taiKhoan.NhanVien?.HoTen,
                SoDienThoai: taiKhoan.NhanVien?.SDT,
                DiaChi: taiKhoan.NhanVien?.DiaChi,
                Email: taiKhoan.Email,
                DiemTichLuy: null,
                TenHangThanhVien: null,
                Avatar: taiKhoan.Avatar

            );

            return Ok(resultNhanVien);
        }

        [HttpPut("doimatkhau")]
        [Authorize]
        public async Task<IActionResult> DoiMatKhau([FromBody] DoiMatKhauDto request)
        {
            var maTkStr = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(maTkStr) || !int.TryParse(maTkStr, out int maTK))
            {
                return Unauthorized(new { message = "Token không hợp lệ hoặc đã hết hạn" });
            }

            var taiKhoan = await _context.TaiKhoans.FindAsync(maTK);
            if (taiKhoan == null)
            {
                return NotFound(new { message = "Không tìm thấy tài khoản" });
            }

            if (!BCryptNet.Verify(request.MatKhauCu, taiKhoan.MatKhau))
            {
                return BadRequest(new { message = "Mật khẩu cũ không chính xác" });
            }

            taiKhoan.MatKhau = BCryptNet.HashPassword(request.MatKhauMoi);

            try
            {
                _context.TaiKhoans.Update(taiKhoan);
                await _context.SaveChangesAsync();
                return Ok(new { message = "Đổi mật khẩu thành công" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Đã xảy ra lỗi khi đổi mật khẩu", detail = ex.Message });
            }
        }

        [HttpPut("capnhatthongtin")]
        [Authorize] // Bắt buộc phải đăng nhập (đã dán Token ở ổ khóa) mới dùng được
        public async Task<IActionResult> CapNhatThongTin([FromForm] CapNhapThongTinDto request)
        {
            // 1. Lấy MaTK định danh từ Token
            var maTkStr = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(maTkStr) || !int.TryParse(maTkStr, out int maTK))
            {
                return Unauthorized(new { message = "Token không hợp lệ hoặc đã hết hạn" });
            }

            var taiKhoan = await _context.TaiKhoans
                .Include(tk => tk.KhachHang)
                .Include(tk => tk.NhanVien)
                .FirstOrDefaultAsync(tk => tk.MaTK == maTK);

            if (taiKhoan == null) return NotFound(new { message = "Không tìm thấy tài khoản" });

            using var transaction = await _context.Database.BeginTransactionAsync();
            try
            {
                // 2. Kiểm tra và cập nhật thông tin Email
                if (!string.IsNullOrEmpty(request.Email) && request.Email != taiKhoan.Email)
                {
                    var emailTrung = await _context.TaiKhoans
                        .AnyAsync(tk => tk.MaTK != maTK && tk.Email!.ToLower() == request.Email.ToLower());
                    if (emailTrung) return BadRequest(new { message = "Email này đã được sử dụng bởi tài khoản khác" });

                    taiKhoan.Email = request.Email;
                }
                // 3. Kiểm tra và xử lý upload ảnh avatar nếu có
                if (request.FileAvatar != null && request.FileAvatar.Length > 0)
                {
                    // Cấu hình biến đổi ảnh cho avatar (ảnh vuông 500x500 crop tập trung vào khuôn mặt)
                    var transformation = new Transformation().Width(500).Height(500).Crop("fill").Gravity("face");

                    // Gọi helper tải ảnh lên thư mục "LV_avatars"
                    var uploadResult = await _cloudinaryHelper.UploadImageAsync(request.FileAvatar, "LV_avatars", transformation);

                    if (uploadResult == null || uploadResult.Error != null)
                    {
                        return BadRequest(new { message = "Lỗi khi upload ảnh lên Cloudinary", detail = uploadResult?.Error?.Message });
                    }

                    // Lưu URL bảo mật vào database
                    taiKhoan.Avatar = uploadResult.SecureUrl.ToString();
                }

                // 4. Phân loại vai trò để cập nhật hồ sơ chi tiết (HoTen, SDT, DiaChi)
                string vaiTro = taiKhoan.VaiTro ?? "KhachHang";
                if (vaiTro.Equals("KhachHang", StringComparison.OrdinalIgnoreCase))
                {
                    if (taiKhoan.KhachHang == null) return BadRequest(new { message = "Không tìm thấy hồ sơ khách hàng" });

                    taiKhoan.KhachHang.HoTen = request.HoTen;
                    taiKhoan.KhachHang.SDT = request.SoDienThoai;
                    taiKhoan.KhachHang.DiaChi = request.DiaChi;
                }
                else
                {
                    if (taiKhoan.NhanVien == null) return BadRequest(new { message = "Không tìm thấy hồ sơ nhân viên" });

                    taiKhoan.NhanVien.HoTen = request.HoTen;
                    taiKhoan.NhanVien.SDT = request.SoDienThoai;
                    taiKhoan.NhanVien.DiaChi = request.DiaChi;
                }

                await _context.SaveChangesAsync();
                await transaction.CommitAsync();

                return Ok(new
                {
                    message = "Cập nhật thông tin cá nhân và lưu ảnh lên Cloudinary thành công!",
                    avatarUrl = taiKhoan.Avatar // Trả link ảnh tuyệt đối về cho React hiển thị trực tiếp bằng thẻ <img src={avatarUrl} />
                });
            }
            catch (Exception ex)
            {
                await transaction.RollbackAsync();
                return StatusCode(500, new { message = "Đã xảy ra lỗi trong quá trình xử lý", detail = ex.Message });
            }
        }

        [HttpPost("quenmatkhau")]
        public async Task<IActionResult> QuenMatKhau([FromBody] QuenMatKhauDto request)
        {
            if (string.IsNullOrEmpty(request.Email))
                return BadRequest(new { message = "Email không được để trống" });

            var taiKhoan = await _context.TaiKhoans.FirstOrDefaultAsync(t => t.Email == request.Email);
            if (taiKhoan == null)
                return NotFound(new { message = "Email không tồn tại trong hệ thống" });

            // Generate 6-digit OTP
            var random = new Random();
            string otp = random.Next(100000, 999999).ToString();

            // Save to DB
            taiKhoan.ResetToken = otp;
            taiKhoan.ResetTokenExpiry = DateTime.Now.AddMinutes(5); // valid for 5 mins
            
            await _context.SaveChangesAsync();

            // Send email
            string subject = "Mã xác nhận khôi phục mật khẩu";
            string body = $"<h3>Xin chào,</h3><p>Mã xác nhận (OTP) để khôi phục mật khẩu của bạn là: <strong>{otp}</strong></p><p>Mã này sẽ hết hạn trong vòng 5 phút.</p>";
            
            try
            {
                await _emailService.SendEmailAsync(taiKhoan.Email, subject, body);
                return Ok(new { message = "Mã xác nhận đã được gửi đến email của bạn" });
            }
            catch (Exception)
            {
                return StatusCode(500, new { message = "Không thể gửi email. Vui lòng kiểm tra lại cấu hình SMTP." });
            }
        }

        [HttpPost("datlaimatkhau")]
        public async Task<IActionResult> DatLaiMatKhau([FromBody] DatLaiMatKhauDto request)
        {
            if (string.IsNullOrEmpty(request.Email) || string.IsNullOrEmpty(request.Otp) || string.IsNullOrEmpty(request.MatKhauMoi))
                return BadRequest(new { message = "Vui lòng nhập đầy đủ thông tin" });

            var taiKhoan = await _context.TaiKhoans.FirstOrDefaultAsync(t => t.Email == request.Email);
            
            if (taiKhoan == null)
                return NotFound(new { message = "Email không tồn tại" });

            if (taiKhoan.ResetToken != request.Otp)
                return BadRequest(new { message = "Mã xác nhận không chính xác" });

            if (taiKhoan.ResetTokenExpiry < DateTime.Now)
                return BadRequest(new { message = "Mã xác nhận đã hết hạn" });

            // Hash new password
            taiKhoan.MatKhau = BCryptNet.HashPassword(request.MatKhauMoi);
            
            // Clear token
            taiKhoan.ResetToken = null;
            taiKhoan.ResetTokenExpiry = null;

            await _context.SaveChangesAsync();

            return Ok(new { message = "Đặt lại mật khẩu thành công" });
        }

    }
}