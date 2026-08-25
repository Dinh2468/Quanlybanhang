using API_WebBDDHT.Entities;
using static API_WebBDDHT.Controllers.TaiKhoanController;
using AutoMapper;
using API_WebBDDHT.DTOs.Auth;
using API_WebBDDHT.DTOs.TaiKhoan;
using API_WebBDDHT.DTOs.SanPham;
using API_WebBDDHT.DTOs.DonHang;
using API_WebBDDHT.DTOs.Common;
using API_WebBDDHT.DTOs.DanhMuc;
using API_WebBDDHT.DTOs.Admin;
using API_WebBDDHT.DTOs.ThanhToan;
using API_WebBDDHT.DTOs.NhapHang;
using API_WebBDDHT.DTOs.KhuyenMai;

namespace API_WebBDDHT.Mappings
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            // Map từ DangKyDto sang TaiKhoan
            CreateMap<DangKyDto, TaiKhoan>()
                .ForMember(dest => dest.MatKhau, opt => opt.Ignore()); // Mật khẩu sẽ được hash riêng nên tạm thời ignore
            // Map từ DangKyDto sang KhachHang
            CreateMap<DangKyDto, KhachHang>()
                .ForMember(dest => dest.SDT, opt => opt.MapFrom(src => src.SoDienThoai));

            // Map từ KhachHang sang ThongTinTaiKhoanDto
            CreateMap<KhachHang, ThongTinTaiKhoanDto>()
                .ConstructUsing(src => new ThongTinTaiKhoanDto(
                    src.MaTK ?? 0,
                    src.TaiKhoan != null ? src.TaiKhoan.TenDangNhap : "",
                    src.TaiKhoan != null ? src.TaiKhoan.VaiTro ?? "KhachHang" : "KhachHang",
                    src.HoTen,
                    src.SDT,
                    src.DiaChi,
                    src.TaiKhoan != null ? src.TaiKhoan.Email : "",
                    src.DiemTichLuy.ToString(), // Vì trong DTO đang để kiểu string?
                    src.HangKhachHang != null ? src.HangKhachHang.TenHang : "Đồng",
                    src.TaiKhoan != null ? src.TaiKhoan.Avatar : ""
                ))
                // Ignore các thuộc tính gán sau vì đã được nạp trực tiếp qua Constructor ở trên
                .ForAllMembers(opt => opt.Ignore());
            // Map từ CapNhapThongTinDto sang KhachHang
            CreateMap<CapNhapThongTinDto, KhachHang>()
                .ForMember(dest => dest.HoTen, opt => opt.MapFrom(src => src.HoTen))
                .ForMember(dest => dest.SDT, opt => opt.MapFrom(src => src.SoDienThoai))
                .ForMember(dest => dest.DiaChi, opt => opt.MapFrom(src => src.DiaChi));
            // Map từ SanPham sang SanPhamDto 
            CreateMap<SanPham, SanPhamDto>().ConstructUsing(src => new SanPhamDto(
                    src.MaSP,
                    src.TenSP,
                    src.MoTa,
                    src.Gia,
                    src.SoLuongTon,
                    src.HinhAnh,
                    src.MaLoai,
                    src.LoaiSP != null ? src.LoaiSP.TenLoai : "",
                    src.MaTH,
                    src.ThuongHieu != null ? src.ThuongHieu.TenTH : ""
                ))
                // Ignore các thuộc tính gán sau vì đã được nạp trực tiếp qua Constructor ở trên có tác dụng tránh lỗi null reference khi nạp dữ liệu từ DB
                .AfterMap((src, dest) => {
                    var activeKM = src.KhuyenMais != null ? src.KhuyenMais.Where(km => km.NgayBatDau <= DateTime.Now && km.NgayKetThuc >= DateTime.Now).OrderByDescending(km => km.PhanTramGiam).FirstOrDefault() : null;
                    dest.PhanTramGiam = activeKM != null ? activeKM.PhanTramGiam : null;
                    dest.GiaGiam = activeKM != null && activeKM.PhanTramGiam.HasValue ? src.Gia * (1m - (decimal)activeKM.PhanTramGiam.Value / 100m) : src.Gia;
                    dest.TrangThaiHienThi = src.TrangThaiHienThi;
                })
                .ForAllMembers(opt => opt.Ignore());
            // Map từ LuuSanPhamDto sang SanPham
            CreateMap<LuuSanPhamDto, SanPham>()
                .ForMember(dest => dest.HinhAnh, opt => opt.Ignore());
            // Map từ LoaiSP sang LoaiSPDto
            CreateMap<LoaiSP, LoaiSPDto>()
                .ForMember(dest => dest.MaLoai, opt => opt.MapFrom(src => src.MaLoaiSP));
            // Map từ LuuLoaiSPDto sang LoaiSP
            CreateMap<LuuLoaiSPDto, LoaiSP>();
            // Map từ ThuongHieu sang ThuongHieuDto
            CreateMap<ThuongHieu, ThuongHieuDto>();
            // Map từ LuuThuongHieuDto sang ThuongHieu
            CreateMap<LuuThuongHieuDto, ThuongHieu>();
            // Map từ ChiTietGioHang sang SanPhamLineItemDto (thay thế ChiTietGioHangDto trùng lặp)
            CreateMap<ChiTietGioHang, SanPhamLineItemDto>()
                .ForMember(dest => dest.TenSP, opt => opt.MapFrom(src => src.SanPham != null ? src.SanPham.TenSP : ""))
                .ForMember(dest => dest.HinhAnh, opt => opt.MapFrom(src => src.SanPham != null ? src.SanPham.HinhAnh : ""));
            // Map từ GioHang sang GioHangDto, trong đó DanhSachSanPham được map từ ChiTietGioHangs
            CreateMap<GioHang, GioHangDto>()
                .ForMember(dest => dest.DanhSachSanPham, opt => opt.MapFrom(src => src.ChiTietGioHangs));
            // Map từ DonHang sang DonHangLichSuDto, lấy thêm thông tin món đầu tiên
            CreateMap<DonHang, DonHangLichSuDto>()
                .ForMember(dest => dest.TenPhuongThucThanhToan, opt => opt.MapFrom(src => src.PhuongThucThanhToan != null ? src.PhuongThucThanhToan.TenPhuongThuc : "Chưa xác định"))
                .ForMember(dest => dest.TenSanPhamDauTien, opt => opt.MapFrom(src => src.ChiTietDonHangs.FirstOrDefault() != null && src.ChiTietDonHangs.FirstOrDefault().SanPham != null ? src.ChiTietDonHangs.FirstOrDefault().SanPham.TenSP : ""))
                .ForMember(dest => dest.HinhAnhSanPhamDauTien, opt => opt.MapFrom(src => src.ChiTietDonHangs.FirstOrDefault() != null && src.ChiTietDonHangs.FirstOrDefault().SanPham != null ? src.ChiTietDonHangs.FirstOrDefault().SanPham.HinhAnh : ""))
                .ForMember(dest => dest.SoLuongSanPhamDauTien, opt => opt.MapFrom(src => src.ChiTietDonHangs.FirstOrDefault() != null ? src.ChiTietDonHangs.FirstOrDefault().SoLuong : 0))
                .ForMember(dest => dest.TongSoLoaiSanPham, opt => opt.MapFrom(src => src.ChiTietDonHangs.Count));
            // Map từ PhuongThucThanhToan sang PhuongThucThanhToanDto
            CreateMap<PhuongThucThanhToan, PhuongThucThanhToanDto>();
            // Map từ ChiTietDonHang sang ChiTietDonHangDto, trong đó TenSP và HinhAnh được map từ SanPham  
            CreateMap<ChiTietDonHang, ChiTietDonHangDto>()
                .ForMember(dest => dest.TenSP, opt => opt.MapFrom(src => src.SanPham != null ? src.SanPham.TenSP : ""))
                .ForMember(dest => dest.HinhAnh, opt => opt.MapFrom(src => src.SanPham != null ? src.SanPham.HinhAnh : ""));
            // Map từ DonHang sang ChiTietDonHangResponseDto, trong đó TenPhuongThucThanhToan được map từ PhuongThucThanhToan.TenPhuongThuc và DanhSachSanPham được map từ ChiTietDonHangs
            CreateMap<DonHang, ChiTietDonHangResponseDto>()
                .ForMember(dest => dest.TenPhuongThucThanhToan, opt => opt.MapFrom(src => src.PhuongThucThanhToan != null ? src.PhuongThucThanhToan.TenPhuongThuc : "Chưa xác định"))
                .ForMember(dest => dest.DanhSachSanPham, opt => opt.MapFrom(src => src.ChiTietDonHangs));
            // Map từ DanhGia sang DanhGiaDto
            CreateMap<DanhGia, DanhGiaDto>()
                .ForMember(dest => dest.TenKhachHang, opt => opt.MapFrom(src => src.KhachHang != null ? src.KhachHang.HoTen : "Người dùng ẩn danh"));
            //  Map từ NhaCungCap sang NhaCungCapDto
            CreateMap<NhaCungCap, NhaCungCapDto>();
            // Map từ LuuNhaCungCapDto sang NhaCungCap
            CreateMap<LuuNhaCungCapDto, NhaCungCap>();
            // Map từ DonHang sang AdminDonHangDto
            CreateMap<DonHang, AdminDonHangDto>()
                .ForMember(dest => dest.TenKhachHang, opt => opt.MapFrom(src => src.KhachHang != null ? src.KhachHang.HoTen : "Khách vãng lai đặt trước"))
                .ForMember(dest => dest.TenPhuongThucThanhToan, opt => opt.MapFrom(src => src.PhuongThucThanhToan != null ? src.PhuongThucThanhToan.TenPhuongThuc : "Chưa xác định"));
            // Map từ KhachHang sang AdminKhachHangDto            
            CreateMap<KhachHang, AdminKhachHangDto>()
                .ForMember(dest => dest.TenDangNhap, opt => opt.MapFrom(src => src.TaiKhoan != null ? src.TaiKhoan.TenDangNhap : null))
                .ForMember(dest => dest.Email, opt => opt.MapFrom(src => src.TaiKhoan != null ? src.TaiKhoan.Email : null))
                .ForMember(dest => dest.TenHangThanhVien, opt => opt.MapFrom(src => src.HangKhachHang != null ? src.HangKhachHang.TenHang : null))
                .ForMember(dest => dest.TrangThai, opt => opt.MapFrom(src => src.TaiKhoan != null ? src.TaiKhoan.TrangThai : false));
            // Map từ NhanVien sang AdminNhanVienDto
            CreateMap<NhanVien, AdminNhanVienDto>()
                .ForMember(dest => dest.TenDangNhap, opt => opt.MapFrom(src => src.TaiKhoan != null ? src.TaiKhoan.TenDangNhap : null))
                .ForMember(dest => dest.Email, opt => opt.MapFrom(src => src.TaiKhoan != null ? src.TaiKhoan.Email : null))
                .ForMember(dest => dest.VaiTro, opt => opt.MapFrom(src => src.TaiKhoan != null ? src.TaiKhoan.VaiTro : null))
                .ForMember(dest => dest.TrangThai, opt => opt.MapFrom(src => (src.TaiKhoan != null && src.TaiKhoan.TrangThai) ? "Đang hoạt động" : "Bị khóa"))
                .ForMember(dest => dest.Avatar, opt => opt.MapFrom(src => src.TaiKhoan != null ? src.TaiKhoan.Avatar : null));
            // Map từ HangKhachHang sang HangKhachHangDto
            CreateMap<HangKhachHang, HangKhachHangDto>();
            // Map từ LuuHangKhachHangDto sang HangKhachHang
            CreateMap<LuuHangKhachHangDto, HangKhachHang>();
            // Map từ KhuyenMai sang KhuyenMaiDto
            CreateMap<KhuyenMai, KhuyenMaiDto>()
                .ForMember(dest => dest.SanPhams, opt => opt.MapFrom(src => src.SanPhams != null ? src.SanPhams.Select(sp => sp.MaSP).ToList() : new List<int>()));
            // Map từ LuuKhuyenMaiDto sang KhuyenMai
            CreateMap<LuuKhuyenMaiDto, KhuyenMai>()
                .ForMember(dest => dest.SanPhams, opt => opt.Ignore());
            // Map từ ChiTietNhapHang sang SanPhamLineItemDto (thay thế ChiTietPhieuNhapDto trùng lặp)
            CreateMap<ChiTietNhapHang, SanPhamLineItemDto>()
                .ForMember(dest => dest.TenSP, opt => opt.MapFrom(src => src.SanPham != null ? src.SanPham.TenSP : ""))
                .ForMember(dest => dest.HinhAnh, opt => opt.MapFrom(src => src.SanPham != null ? src.SanPham.HinhAnh : ""));
            // Map từ NhapHang sang PhieuNhapDto
            CreateMap<NhapHang, PhieuNhapDto>()
                .ForMember(dest => dest.TenNhanVien, opt => opt.MapFrom(src => src.NhanVien != null ? src.NhanVien.HoTen : "Không xác định"))
                .ForMember(dest => dest.TenNCC, opt => opt.MapFrom(src => src.NhaCungCap != null ? src.NhaCungCap.TenNCC : "Không xác định"))
                .ForMember(dest => dest.DanhSachSanPham, opt => opt.MapFrom(src => src.ChiTietNhapHangs));
            // Map từ ChiTietDonHang sang SanPhamLineItemDto (thay thế AdminChiTietItemDto trùng lặp, dùng cho Admin)
            CreateMap<ChiTietDonHang, SanPhamLineItemDto>()
                .ForMember(dest => dest.TenSP, opt => opt.MapFrom(src => src.SanPham != null ? src.SanPham.TenSP : ""))
                .ForMember(dest => dest.HinhAnh, opt => opt.MapFrom(src => src.SanPham != null ? src.SanPham.HinhAnh : ""));
            // Map từ DonHang sang AdminChiTietDonHangDto
            CreateMap<DonHang, AdminChiTietDonHangDto>()
                .ForMember(dest => dest.TenKhachHang, opt => opt.MapFrom(src => src.KhachHang != null ? src.KhachHang.HoTen : "Khách ẩn danh"))
                .ForMember(dest => dest.EmailKhachHang, opt => opt.MapFrom(src => (src.KhachHang != null && src.KhachHang.TaiKhoan != null) ? src.KhachHang.TaiKhoan.Email : ""))
                .ForMember(dest => dest.TenPhuongThucThanhToan, opt => opt.MapFrom(src => src.PhuongThucThanhToan != null ? src.PhuongThucThanhToan.TenPhuongThuc : "Chưa rõ"))
                .ForMember(dest => dest.ChiTietDonHangs, opt => opt.MapFrom(src => src.ChiTietDonHangs));
        }
    }
}
