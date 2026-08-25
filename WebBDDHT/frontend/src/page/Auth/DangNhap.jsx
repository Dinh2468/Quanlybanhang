import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  FiMail,    // Icon thư (cho ô nhập email/tên đăng nhập)
  FiLock,    // Icon ổ khóa (cho ô nhập mật khẩu)
  FiEye,     // Icon mắt mở (hiện mật khẩu)
  FiEyeOff,  // Icon mắt đóng (ẩn mật khẩu)
  FiArrowLeft // Icon mũi tên trái (nút quay lại)
} from 'react-icons/fi';
import toast from 'react-hot-toast';
import API from '../../services/api';
import Footer from '../../components/Footer';
import { GoogleLogin } from '@react-oauth/google';

export default function DangNhap() {
  // Hook điều hướng trang (react-router-dom)
  const navigate = useNavigate();

  // ---- STATE QUẢN LÝ FORM ----
  const [tenDangNhap, setTenDangNhap] = useState('');   // Tên đăng nhập / email
  const [matKhau, setMatKhau] = useState('');             // Mật khẩu
  const [showPassword, setShowPassword] = useState(false); // Ẩn/hiện mật khẩu
  const [rememberMe, setRememberMe] = useState(false);    // Ghi nhớ đăng nhập
  const [isLoading, setIsLoading] = useState(false);       // Trạng thái loading khi gọi API
  const [errors, setErrors] = useState({});                // Lỗi validate từng field

  // ---- HÀM VALIDATE FORM ----
  // Kiểm tra dữ liệu nhập trước khi gửi API
  const validate = () => {
    const newErrors = {};
    if (!tenDangNhap.trim()) {
      newErrors.tenDangNhap = 'Vui lòng nhập Email hoặc Tên đăng nhập.';
    }
    if (!matKhau) {
      newErrors.matKhau = 'Vui lòng nhập mật khẩu.';
    } else if (matKhau.length < 6) {
      newErrors.matKhau = 'Mật khẩu phải có ít nhất 6 ký tự.';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; // true = hợp lệ
  };

  // ---- HÀM XỬ LÝ ĐĂNG NHẬP ----
  // Gọi API POST /api/TaiKhoan/dangnhap
  const handleSubmit = async (e) => {
    e.preventDefault(); // Ngăn form reload trang
    if (!validate()) return; // Dừng nếu validate thất bại

    setIsLoading(true);
    try {
      // Gọi API đăng nhập với body { tenDangNhap, matKhau }
      const res = await API.post('/TaiKhoan/dangnhap', {
        tenDangNhap: tenDangNhap.trim(),
        matKhau,
      });

      // ---- LƯU THÔNG TIN SAU ĐĂNG NHẬP ----
      const data = res.data;

      // API có thể trả về token + thông tin user theo nhiều cấu trúc khác nhau:
      // Cấu trúc 1: { token, vaiTro, hoTen, ... }  → user data ở cấp gốc
      // Cấu trúc 2: { token, user: { vaiTro, ... } }
      // Cấu trúc 3: token dạng string thuần

      if (data.token) {
        localStorage.setItem('token', data.token);
      } else if (typeof data === 'string') {
        localStorage.setItem('token', data);
      }

      // Lấy thông tin user: ưu tiên data.user > data.taiKhoan > chính data (nếu có vaiTro/hoTen)
      const savedUser = data.user || data.taiKhoan || (data.vaiTro || data.hoTen ? data : null);
      if (savedUser) {
        localStorage.setItem('user', JSON.stringify(savedUser));
      }

      // Hiển thị thông báo thành công
      toast.success('Đăng nhập thành công!');

      // Xác định vai trò
      const roleRaw = savedUser?.vaiTro || savedUser?.role || '';
      const roleLower = roleRaw.toLowerCase();
      const isAdminOrStaff =
        roleLower.includes('admin') ||
        roleLower.includes('nhanvien');

      // Admin / Nhân viên → trang quản trị | Khách hàng → trang chủ
      setTimeout(() => {
        navigate(isAdminOrStaff ? '/admin/dashboard' : '/');
      }, 500);
    } catch (err) {
      // Xử lý lỗi từ API (hiển thị message lỗi)
      const msg =
        err.response?.data?.message ||
        err.response?.data?.title ||
        err.response?.data ||
        'Tên đăng nhập hoặc mật khẩu không đúng.';
      toast.error(typeof msg === 'string' ? msg : 'Đăng nhập thất bại.');
    } finally {
      setIsLoading(false); // Tắt loading dù thành công hay thất bại
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    setIsLoading(true);
    try {
      const res = await API.post('/TaiKhoan/google-login', {
        idToken: credentialResponse.credential
      });
      
      const data = res.data;
      if (data.token) {
        localStorage.setItem('token', data.token);
      }
      const savedUser = data.user || data.taiKhoan || (data.vaiTro || data.hoTen ? data : null);
      if (savedUser) {
        localStorage.setItem('user', JSON.stringify(savedUser));
      }
      
      toast.success('Đăng nhập Google thành công!');
      
      const roleRaw = savedUser?.vaiTro || savedUser?.role || '';
      const roleLower = roleRaw.toLowerCase();
      const isAdminOrStaff =
        roleLower.includes('admin') ||
        roleLower.includes('quản trị') ||
        roleLower.includes('nhân viên') ||
        roleLower.includes('nhan vien');

      setTimeout(() => {
        navigate(isAdminOrStaff ? '/admin/dashboard' : '/');
      }, 500);
      
    } catch (error) {
      console.error(error);
      const errorMsg = error.response?.data?.message || 'Lỗi khi đăng nhập bằng Google';
      toast.error(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  // ============================================================
  // GIAO DIỆN (JSX)
  // ============================================================
  return (
    <div className="min-h-screen flex flex-col bg-background text-on-background selection:bg-primary-container selection:text-primary">

      {/* ==================== HEADER ==================== */}
      {/* Thanh trên cùng: Logo bên trái, nút Quay lại bên phải */}
      <header className="w-full bg-[#1E3A8A] border-b border-[#1E3A8A] shadow-md sticky top-0 z-50 h-20 flex items-center">
        <div className="flex justify-between items-center px-4 md:px-10 w-full max-w-7xl mx-auto">

          {/* Logo cửa hàng */}
          <Link to="/" className="flex items-center gap-2 group shrink-0">
            <span className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-2xl shadow-md group-hover:scale-105 transition-transform">
              D
            </span>
            <span className="text-xl font-bold text-white tracking-tight group-hover:text-[#93C5FD] transition-colors">
              Dinh Store
            </span>
          </Link>

          {/* Nút quay lại trang chủ */}
          <Link
            to="/"
            className="flex items-center gap-2 text-white hover:text-[#93C5FD] transition-all text-sm font-semibold group"
          >
            <FiArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            <span>Quay lại Trang chủ</span>
          </Link>
        </div>
      </header>

      {/* ==================== NỘI DUNG CHÍNH ==================== */}
      {/* Chia 2 cột: Trái = banner minh họa, Phải = form đăng nhập */}
      <main className="flex-1 grid grid-cols-1 md:grid-cols-2">

        {/* ========== CỘT TRÁI: BANNER MINH HỌA ========== */}
        {/* Nền gradient thương hiệu đồng bộ */}
        <section className="relative min-h-[400px] md:min-h-0 overflow-hidden flex flex-col items-center justify-center p-8 md:p-16 bg-gradient-to-br from-primary/10 via-primary-container to-secondary/15">

          {/* --- Hình trang trí nền (blur mờ) --- */}
          <div className="absolute inset-0 z-0 opacity-40 pointer-events-none">
            <div className="absolute top-10 left-10 w-32 h-32 rounded-full bg-primary/20 blur-3xl" />
            <div className="absolute bottom-20 right-10 w-60 h-60 rounded-full bg-tertiary/10 blur-3xl" />
          </div>

          {/* --- Tiêu đề và mô tả --- */}
          <div className="relative z-10 text-center md:text-left max-w-lg mb-10">
            {/* Tiêu đề chính - font lớn, in đậm */}
            <h2 className="text-4xl md:text-5xl font-bold text-secondary mb-4 leading-tight italic">
              Khơi nguồn sáng tạo!
            </h2>
            {/* Mô tả phụ */}
            <p className="text-base md:text-lg text-on-secondary-container font-normal leading-relaxed">
              Tham gia đăng ký để nhận ưu đãi 10% cho đơn hàng đầu tiên.
            </p>
          </div>

         
          {/* Các ảnh được bố trí lệch nhau (translate) tạo hiệu ứng động */}
          <div className="relative z-10 w-full max-w-md">
            <div className="grid grid-cols-2 gap-4">

              {/* Ảnh 1: Bút màu pastel (góc trên trái) */}
              <div className="aspect-square rounded-2xl overflow-hidden shadow-md hover:scale-[1.03] transition-transform duration-500">
                <img
                  alt="Bút màu pastel"
                  className="w-full h-full object-cover"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuB0EjNDVfKa4ln4LhDeI4qewoVGjoDPWpzV0svzoti195nhayEgq6wba6ojaxcvnFuII2laAr-uUQH7p50MhmC-VhxXpZnx1xs_2DsRd5aUDPJ_6-q2HvVdIIF0TH1P3Vu2J2y_cO2N_ks09gDOk5HMQyRSn04qaadjQGeoUYeDqKH-lQ4HVgw77Q9hMGc2izRzOoyc51zaMAoBl4J2tonwHuCftwflFAP6hGZ1NPfv_97v-8UFmPUecXqv4fqpqLbksSrZKnivgW8"
                  referrerPolicy="no-referrer"
                />
              </div>

              {/* Ảnh 2: Sổ tay mở (góc trên phải, dịch xuống 24px) */}
              <div className="aspect-square rounded-2xl overflow-hidden shadow-md translate-y-6 hover:scale-[1.03] transition-transform duration-500">
                <img
                  alt="Sổ tay và nhãn dán"
                  className="w-full h-full object-cover"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuD-orwiy78mCVOqgE5DtjATID6a3OafKit4_bfTUbVmduSMSlIjDZMEFA07PNrtEkI12ZcvuhfnvwUUHfg1sOxZDlhAP6kxKbGGtqKBbl47sJmEf0xWXyCnYGJAXrgncZgmUINYGWxXa02ZUtn0WfFMqkdzVoE6oPFaD7d1QI8cGzuCJR_j1kBL7d4Wl9TXRGGZHdDizcegvNICuPvIJg4rDWiom-hhiVcmABXO3qSr0SeoVQzGnfhfHG1c5kisaqLbhvM6ZhvRqO0"
                  referrerPolicy="no-referrer"
                />
              </div>

              {/* Ảnh 3: Băng dính washi (góc dưới trái, dịch lên 16px) */}
              <div className="aspect-square rounded-2xl overflow-hidden shadow-md -translate-y-4 hover:scale-[1.03] transition-transform duration-500">
                <img
                  alt="Băng dính washi"
                  className="w-full h-full object-cover"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuBiMfkM55Ko_Th5TzPScv-UlvcGKmqKl5xi-sRs_5yr8Umpf0wEW8igu6kYToFcZo_ze7XRp5ZzCPGGBf2k4Sf0x9E2rzyVOqlftylLWpe1C9bK-nNtf6O_d_R9uUFlIxIQDMuACnaTpR5DLP0BOuENhLUrP4xL5n3gFTkbmToLh8SAHIhmKAMnb_mt7I2-fQLuNLO4lmEPdx4FlhHzgqS8VSLWBapDLNzVLp4LeoPxDvk99FWEN8Os9-eJ53uhv1SPUgvvATZ6mtg"
                  referrerPolicy="no-referrer"
                />
              </div>

              {/* Ảnh 4: Góc làm việc (góc dưới phải, dịch lên 8px) */}
              <div className="aspect-square rounded-2xl overflow-hidden shadow-md translate-y-2 hover:scale-[1.03] transition-transform duration-500">
                <img
                  alt="Góc làm việc văn phòng phẩm"
                  className="w-full h-full object-cover"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDRZTHhdS8BLYjOQ4mceaL6Pvq-z8329xX-G-5nuTc2Gl8F9Fyj8ASmYb8ezBfBidw-E-Vqc3BfmtWrVhmK2hVCubxFE5r2WtpQc3mM71eSFglWYYcZjvcy1cwx4aTppRKS-KxXMJTIbiiMhKPCTqBxNNcAheV7Hj3qmr3pgtdXak8vf-jOsGWIcRvKoJLSz1H-VJH6ayVnU6SXioG1e1gPaa1WtX8Tdu4h38-YlZlAUz9-hNPCxoWrtLJOc7MhsphwNMTJrhOPIAA"
                  referrerPolicy="no-referrer"
                />
              </div>
            </div>
          </div>
        </section>

        {/* ========== CỘT PHẢI: FORM ĐĂNG NHẬP ========== */}
        <section className="flex flex-col justify-center items-center p-6 md:p-12 bg-background">
          <div className="w-full max-w-[480px]">

            {/* === CARD ĐĂNG NHẬP (nền trắng, bo tròn, đổ bóng) === */}
            <div className="bg-surface rounded-3xl p-8 md:p-10 shadow-xl shadow-outline-variant/10 border border-outline-variant/30">

              {/* --- TAB CHUYỂN ĐỔI: Đăng nhập | Tạo tài khoản --- */}
              {/* Thanh tab có nền xám nhạt, tab active có nền tím đậm chữ trắng */}
              <div className="flex p-1 bg-background border border-outline-variant/30 rounded-full mb-8 relative overflow-hidden">

                {/* Thanh trượt nền (indicator) - di chuyển theo tab active */}
                <div
                  className="absolute inset-y-1 bg-primary rounded-full transition-all duration-300 ease-out"
                  style={{
                    left: '4px',              // Vị trí bên trái (tab Đăng nhập đang active)
                    width: 'calc(50% - 4px)',  // Chiều rộng = nửa thanh tab
                  }}
                />

                {/* Tab "Đăng nhập" - đang active (chữ trắng) */}
                {/* Tab "Đăng nhập" - đang active (chữ trắng) */}
                <button
                  type="button"
                  className="relative z-10 w-1/2 py-2.5 text-sm font-bold rounded-full text-white"
                >
                  Đăng nhập
                </button>

                {/* Tab "Tạo tài khoản" - inactive (chữ màu tối) */}
                <button
                  type="button"
                  onClick={() => navigate('/dangky')}
                  className="relative z-10 w-1/2 py-2.5 text-sm font-bold rounded-full text-on-surface hover:text-primary transition-colors"
                >
                  Tạo tài khoản
                </button>
              </div>

              {/* --- FORM NHẬP LIỆU --- */}
              <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                
                {/* Field: Tên đăng nhập / Email */}
                <div>
                  <label className="block text-sm font-bold text-on-surface mb-2">Email hoặc Tên đăng nhập</label>
                  <div className="relative rounded-xl shadow-sm">
                    {/* Icon bên trái */}
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <FiMail className="h-5 w-5 text-outline" />
                    </div>
                    <input
                      type="text"
                      value={tenDangNhap}
                      onChange={(e) => setTenDangNhap(e.target.value)}
                      className={`block w-full pl-11 pr-4 py-3 border ${errors.tenDangNhap ? 'border-error ring-1 ring-error/20' : 'border-outline-variant'} rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary sm:text-sm bg-surface-container-lowest hover:bg-surface transition-colors`}
                      placeholder="admin@gmail.com"
                    />
                  </div>
                  {/* Message báo lỗi */}
                  {errors.tenDangNhap && (
                    <p className="mt-2 text-xs font-medium text-error">{errors.tenDangNhap}</p>
                  )}
                </div>

                {/* Field: Mật khẩu */}
                <div>
                  <label className="block text-sm font-bold text-on-surface mb-2">Mật khẩu</label>
                  <div className="relative rounded-xl shadow-sm">
                    {/* Icon bên trái */}
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <FiLock className="h-5 w-5 text-outline" />
                    </div>
                    <input
                      type={showPassword ? "text" : "password"}
                      value={matKhau}
                      onChange={(e) => setMatKhau(e.target.value)}
                      className={`block w-full pl-11 pr-12 py-3 border ${errors.matKhau ? 'border-error ring-1 ring-error/20' : 'border-outline-variant'} rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary sm:text-sm bg-surface-container-lowest hover:bg-surface transition-colors`}
                      placeholder="••••••"
                    />
                    {/* Nút Ẩn/Hiện mật khẩu bên phải */}
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-4 flex items-center text-outline hover:text-primary transition-colors focus:outline-none"
                    >
                      {showPassword ? <FiEyeOff className="h-5 w-5" /> : <FiEye className="h-5 w-5" />}
                    </button>
                  </div>
                  {/* Message báo lỗi */}
                  {errors.matKhau && (
                    <p className="mt-2 text-xs font-medium text-error">{errors.matKhau}</p>
                  )}
                </div>

                {/* --- HÀNG TÙY CHỌN: Ghi nhớ | Quên mật khẩu --- */}
                <div className="flex items-center justify-between">
                  {/* Checkbox Ghi nhớ đăng nhập */}
                  <label className="flex items-center gap-2 cursor-pointer group">
                    <div className="relative flex items-center">
                      <input
                        type="checkbox"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        className="peer h-4 w-4 rounded border-outline-variant text-primary focus:ring-primary/20 transition-all cursor-pointer"
                      />
                    </div>
                    <span className="text-xs font-medium text-on-secondary-container group-hover:text-on-background transition-colors">
                      Ghi nhớ đăng nhập
                    </span>
                  </label>

                  {/* Link "Quên mật khẩu?" */}
                  <Link to="/quen-mat-khau" className="text-xs font-bold text-primary hover:text-secondary hover:underline underline-offset-4 focus:outline-none cursor-pointer">
                    Quên mật khẩu?
                  </Link>
                </div>

                {/* Nút ĐĂNG NHẬP chính */}
                <button
                  type="submit"
                  disabled={isLoading} // Vô hiệu hóa khi đang loading
                  className="w-full py-4 px-6 bg-gradient-to-r from-primary to-secondary text-white font-bold text-sm rounded-full shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-60 disabled:scale-100 disabled:cursor-not-allowed cursor-pointer"
                >
                  {isLoading ? (
                    // Hiệu ứng loading: spinner xoay + text
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      Đang xác thực...
                    </span>
                  ) : (
                    'Đăng nhập'
                  )}
                </button>
              </form>

              {/* --- ĐƯỜNG PHÂN CÁCH "HOẶC TIẾP TỤC VỚI" --- */}
              <div className="relative my-7">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-outline-variant/30" />
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="bg-surface px-4 text-[10px] font-bold text-on-secondary-container/60 uppercase tracking-widest">
                    Hoặc tiếp tục với
                  </span>
                </div>
              </div>

              {/* --- NÚT ĐĂNG NHẬP Google --- */}
              <div className="flex flex-col items-center gap-4">
                {/* Nút Google */}
                <div className="w-full flex justify-center hover:scale-[1.02] transition-transform">
                  <GoogleLogin
                    onSuccess={handleGoogleSuccess}
                    onError={() => {
                      toast.error('Đăng nhập Google thất bại');
                    }}
                    useOneTap
                    shape="pill"
                    width="400"
                  />
                </div>
              </div>

            </div>
            {/* === KẾT THÚC CARD ĐĂNG NHẬP === */}

          </div>
        </section>
        {/* ========== KẾT THÚC CỘT PHẢI ========== */}

      </main>

     
      <Footer />

    </div>
  );
}
