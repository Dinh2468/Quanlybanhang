import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

import DangNhap from './page/Auth/DangNhap';
import DangKy from './page/Auth/DangKy';
import QuenMatKhau from './page/Auth/QuenMatKhau';

import HomePage from './page/Client/HomePage';
import SanPham from './page/Client/SanPham';
import KhuyenMaiClient from './page/Client/KhuyenMai';
import SanPhamYeuThich from './page/Client/SanPhamYeuThich';
import ChiTietSanPham from './page/Client/ChiTietSanPham';
import GioHang from './page/Client/GioHang';
import ThanhToan from './page/Client/ThanhToan';
import HoanTat from './page/Client/KetQuaDatHang';
import ThongTinCaNhan from './page/Client/ThongTinCaNhan';
import LichSuDonHang from './page/Client/LichSuDonHang';
import DanhGia from './page/Client/DanhGia';
// Admin Pages
import Dashboard from './page/Admin/Dashboard';
import QLSanPham from './page/Admin/SanPham/QL_SanPham';
import CTSanPham from './page/Admin/SanPham/CT_SanPham';
import QLLoaiSP from './page/Admin/QL_LoaiSP';
import QLThuongHieu from './page/Admin/QL_ThuongHieu';
import QLDonHang from './page/Admin/DonHang/QL_DonHang';
import CTDonHang from './page/Admin/DonHang/CT_DonHang';
import QLKhachHang from './page/Admin/KhachHang/QL_KhachHang';
import ChiTietKhachHang from './page/Admin/KhachHang/ChiTietKhachHang';
import QLNhanVien from './page/Admin/NhanVien/QL_NhanVien';
import CTNhanVien from './page/Admin/NhanVien/CT_NhanVien';
import QLNCC from './page/Admin/QL_NCC';
import QLHangThanhVien from './page/Admin/QL_HangThanhVien';
import QLKhuyenMai from './page/Admin/KhuyenMai/QL_KhuyenMai';
import CTKhuyenMai from './page/Admin/KhuyenMai/CT_KhuyenMai';
import QLNhapHang from './page/Admin/NhapHang/QL_NhapHang';
import PhieuNhapHang from './page/Admin/NhapHang/PhieuNhapHang';
import CTNhapHang from './page/Admin/NhapHang/CT_NhapHang';
import BaoCao from './page/Admin/BaoCao';

function App() {
  return (
    <BrowserRouter>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            borderRadius: '12px',
            background: '#333',
            color: '#fff',
            fontSize: '14px',
          },
        }}
      />
      <Routes>
        {/* ===== Client Routes ===== */}
        <Route path="/" element={<HomePage />} />
        <Route path="/sanpham" element={<SanPham />} />
        <Route path="/khuyenmai" element={<KhuyenMaiClient />} />
        <Route path="/yeuthich" element={<SanPhamYeuThich />} />
        <Route path="/sanpham/:id" element={<ChiTietSanPham />} />
        <Route path="/giohang" element={<GioHang />} />
        <Route path="/thanhtoan" element={<ThanhToan />} />
        <Route path="/hoantat" element={<HoanTat />} />
        <Route path="/thongtincanhan" element={<ThongTinCaNhan />} />
        <Route path="/lichsudonhang" element={<LichSuDonHang />} />
        <Route path="/danhgia/:id" element={<DanhGia />} />
        <Route path="/dangnhap" element={<DangNhap />} />
        <Route path="/dangky" element={<DangKy />} />
        <Route path="/quen-mat-khau" element={<QuenMatKhau />} />

        {/* ===== Admin Routes ===== */}
        {/* Chỉ Admin được truy cập */}
        <Route path="/admin/dashboard" element={<Dashboard />} />
        <Route path="/admin/khachhang" element={<QLKhachHang />} />
        <Route path="/admin/khachhang/:id" element={<ChiTietKhachHang />} />
        <Route path="/admin/nhanvien" element={<QLNhanVien />} />
        <Route path="/admin/nhanvien/add" element={<CTNhanVien />} />
        <Route path="/admin/nhanvien/edit/:id" element={<CTNhanVien />} />
        <Route path="/admin/ncc" element={<QLNCC />} />
        <Route path="/admin/hangthanhvien" element={<QLHangThanhVien />} />
        <Route path="/admin/sanpham/add" element={<CTSanPham />} />
        <Route path="/admin/sanpham/edit/:id" element={<CTSanPham />} />
        <Route path="/admin/baocao" element={<BaoCao />} />

        {/* Admin và Nhân viên đều được truy cập */}
        <Route path="/admin/sanpham" element={<QLSanPham />} />
        <Route path="/admin/loaisp" element={<QLLoaiSP />} />
        <Route path="/admin/thuonghieu" element={<QLThuongHieu />} />
        <Route path="/admin/donhang" element={<QLDonHang />} />
        <Route path="/admin/donhang/:id" element={<CTDonHang />} />
        <Route path="/admin/khuyenmai" element={<QLKhuyenMai />} />
        <Route path="/admin/khuyenmai/add" element={<CTKhuyenMai />} />
        <Route path="/admin/khuyenmai/edit/:id" element={<CTKhuyenMai />} />
        
        {/* Quản lý Nhập Hàng */}
        <Route path="/admin/nhaphang" element={<QLNhapHang />} />
        <Route path="/admin/nhaphang/add" element={<PhieuNhapHang />} />
        <Route path="/admin/nhaphang/edit/:id" element={<PhieuNhapHang />} />
        <Route path="/admin/nhaphang/:id" element={<CTNhapHang />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
