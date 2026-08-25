import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  FiUser,     // Icon người (cho ô Họ tên, Tên đăng nhập)
  FiLock,     // Icon ổ khóa (cho ô Mật khẩu)
  FiEye,      // Icon mắt mở (hiện mật khẩu)
  FiEyeOff,   // Icon mắt đóng (ẩn mật khẩu)
  FiArrowLeft,// Icon mũi tên trái (nút quay lại)
  FiMail,     // Icon thư (cho ô Email)
  FiPhone,    // Icon điện thoại (cho ô SĐT)
  FiMapPin,   // Icon pin bản đồ (cho ô Địa chỉ)
  FiCheck     // Icon check (cho checkbox)
} from 'react-icons/fi';
import toast from 'react-hot-toast';
import API from '../../services/api';
import Footer from '../../components/Footer';

// ============================================================
// TRANG ĐĂNG KÝ - DangKy.jsx
// Layout: Chia màn hình 2 phần (split-screen) giống trang đăng nhập
//   - Bên trái: Banner minh họa với ảnh lớn + tiêu đề
//   - Bên phải: Card form đăng ký (trắng, bo tròn)
// API: POST /api/TaiKhoan/dangky
// Body: { hoTen, soDienThoai, diaChi, email, tenDangNhap, matKhau }
// ============================================================

export default function DangKy() {
  // Hook điều hướng trang
  const navigate = useNavigate();

  // ---- STATE QUẢN LÝ FORM ----
  const [form, setForm] = useState({
    hoTen: '',           // Họ và tên
    soDienThoai: '',     // Số điện thoại
    diaChi: '',          // Địa chỉ
    email: '',           // Email
    tenDangNhap: '',     // Tên đăng nhập
    matKhau: '',         // Mật khẩu
    xacNhanMatKhau: '',  // Xác nhận mật khẩu (chỉ validate ở frontend)
  });
  const [showPassword, setShowPassword] = useState(false); // Ẩn/hiện mật khẩu
  const [agreeTerms, setAgreeTerms] = useState(false);     // Đồng ý điều khoản
  const [isLoading, setIsLoading] = useState(false);       // Trạng thái loading
  const [errors, setErrors] = useState({});                // Lỗi validate từng field

  // ---- HÀM CẬP NHẬT FIELD ----
  // Tạo hàm onChange cho từng field, tự động xóa lỗi khi user gõ lại
  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: '' }));
  };

  // ---- HÀM VALIDATE FORM ----
  const validate = () => {
    const newErrors = {};
    if (!form.hoTen.trim()) newErrors.hoTen = 'Vui lòng nhập họ tên.';
    if (!form.email.trim()) newErrors.email = 'Vui lòng nhập email.';
    if (!form.tenDangNhap.trim()) newErrors.tenDangNhap = 'Vui lòng nhập tên đăng nhập.';
    if (!form.matKhau) {
      newErrors.matKhau = 'Vui lòng nhập mật khẩu.';
    } else if (form.matKhau.length < 6) {
      newErrors.matKhau = 'Mật khẩu phải có ít nhất 6 ký tự.';
    }
    if (form.matKhau !== form.xacNhanMatKhau) {
      newErrors.xacNhanMatKhau = 'Mật khẩu xác nhận không khớp.';
    }
    if (form.soDienThoai && !/^0(3|5|7|8|9)\d{8}$/.test(form.soDienThoai)) {
      newErrors.soDienThoai = 'Số điện thoại không hợp lệ (bắt đầu bằng 03,05,07,08,09 và đủ 10 số).';
    }
    if (!agreeTerms) {
      newErrors.agreeTerms = 'Bạn phải đồng ý với điều khoản dịch vụ.';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ---- HÀM XỬ LÝ ĐĂNG KÝ ----
  // Gọi API POST /api/TaiKhoan/dangky
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);
    try {
      await API.post('/TaiKhoan/dangky', {
        hoTen: form.hoTen.trim(),
        soDienThoai: form.soDienThoai.trim(),
        diaChi: form.diaChi.trim(),
        email: form.email.trim(),
        tenDangNhap: form.tenDangNhap.trim(),
        matKhau: form.matKhau,
      });

      toast.success('Đăng ký thành công! Vui lòng đăng nhập.');
      setTimeout(() => navigate('/dangnhap'), 800);
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        err.response?.data?.title ||
        err.response?.data ||
        'Đăng ký thất bại. Vui lòng thử lại.';
      toast.error(typeof msg === 'string' ? msg : 'Đăng ký thất bại.');
    } finally {
      setIsLoading(false);
    }
  };

  // ---- HÀM TẠO CLASS CHO INPUT ----
  // Input có viền đỏ khi lỗi, viền xanh dương khi focus
  const inputClass = (field) =>
    `w-full pl-12 pr-4 py-3.5 bg-surface border-2 rounded-2xl outline-none transition-all text-sm placeholder:text-on-secondary-container/50 ${
      errors[field]
        ? 'border-red-300 focus:border-red-400 focus:ring-4 focus:ring-red-100'
        : 'border-outline-variant/50 focus:border-primary focus:ring-4 focus:ring-primary/15'
    }`;

  // ============================================================
  // GIAO DIỆN (JSX)
  // ============================================================
  return (
    <div className="min-h-screen flex flex-col bg-background text-on-background selection:bg-primary-container selection:text-primary">

      {/* ==================== HEADER ==================== */}
      {/* Giống hệt trang đăng nhập: Logo trái, nút Quay lại phải */}
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
      {/* Chia 2 cột: Trái = banner, Phải = form đăng ký */}
      <main className="flex-1 grid grid-cols-1 md:grid-cols-2">

        {/* ========== CỘT TRÁI: BANNER MINH HỌA ========== */}
        {/* Nền gradient thương hiệu đồng bộ */}
        <section className="relative min-h-[400px] md:min-h-0 overflow-hidden flex flex-col items-center justify-center p-8 md:p-16 bg-gradient-to-br from-primary/10 via-primary-container to-secondary/15">

          {/* --- Hình trang trí nền (blur mờ) --- */}
          <div className="absolute inset-0 z-0 opacity-40 pointer-events-none">
            <div className="absolute top-10 right-10 w-40 h-40 rounded-full bg-primary/20 blur-3xl" />
            <div className="absolute bottom-20 left-10 w-60 h-60 rounded-full bg-tertiary/10 blur-3xl" />
          </div>

          {/* --- Ảnh minh họa lớn (1 ảnh duy nhất, khác trang đăng nhập 4 ảnh) --- */}
          <div className="relative z-10 w-full max-w-md mb-10">
            <div className="rounded-3xl overflow-hidden shadow-xl hover:scale-[1.02] transition-transform duration-500">
              <img
                alt="Aesthetic Stationery - Sổ tay và bút màu"
                className="w-full aspect-[4/3] object-cover"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBSQVAbTGj0V8JPJ2eNu9d-gO7FivTWmJpnNoIrXn9vCphQTIi9laweSZYw2ApUF9ZVtEk8v0eeoEXuqDlkfdHgeiGT51KpkCvv3h95CD5wpmOBMGiATE6uNVVchrNjFTXbwBqaBdo6vECr32H9L7cUwlVl3q6tL-mBlrNUNv9txlr0Fu6h-EpxSCpbTwAuzVOuh9o5I783qQTDUl-jaHNSWOnmF1SJi9zhL1I4daqQI5fjlmol5tTTBcKFkq8V74kbUNtuTunKGCI"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>

          {/* --- Tiêu đề và mô tả --- */}
          <div className="relative z-10 text-center md:text-left max-w-lg">
            <h2 className="text-4xl md:text-5xl font-bold text-secondary mb-4 leading-tight italic">
              Khơi nguồn sáng tạo!
            </h2>
            <p className="text-base md:text-lg text-on-secondary-container font-normal leading-relaxed">
              Tham gia đăng ký để nhận ưu đãi 10% cho đơn hàng đầu tiên.
            </p>
          </div>
        </section>

        {/* ========== CỘT PHẢI: FORM ĐĂNG KÝ ========== */}
        <section className="flex flex-col justify-center items-center p-6 md:p-12 bg-background">
          <div className="w-full max-w-[480px]">

            {/* === CARD ĐĂNG KÝ (nền trắng, bo tròn, đổ bóng) === */}
            <div className="bg-surface rounded-3xl p-8 md:p-10 shadow-xl shadow-outline-variant/10 border border-outline-variant/30">

              {/* --- TAB CHUYỂN ĐỔI: Đăng nhập | Tạo tài khoản --- */}
              {/* Tab "Tạo tài khoản" đang active (indicator ở bên phải) */}
              <div className="flex p-1 bg-background border border-outline-variant/30 rounded-full mb-8 relative overflow-hidden">

                {/* Thanh trượt nền - ở bên phải vì tab "Tạo tài khoản" active */}
                <div
                  className="absolute inset-y-1 bg-primary rounded-full transition-all duration-300 ease-out"
                  style={{
                    left: 'calc(50%)',           // Vị trí bên phải
                    width: 'calc(50% - 4px)',    // Chiều rộng = nửa thanh
                  }}
                />

                {/* Tab "Đăng nhập" - chưa active (click chuyển sang trang đăng nhập) */}
                <Link
                  to="/dangnhap"
                  className="relative z-10 flex-1 py-3 text-sm font-semibold transition-colors rounded-full text-on-secondary-container hover:text-primary text-center"
                >
                  Đăng nhập
                </Link>

                {/* Tab "Tạo tài khoản" - đang active (chữ trắng) */}
                <button
                  type="button"
                  className="relative z-10 flex-1 py-3 text-sm font-semibold transition-colors rounded-full text-white"
                >
                  Tạo tài khoản
                </button>
              </div>

              {/* --- FORM ĐĂNG KÝ --- */}
              <form onSubmit={handleSubmit} className="space-y-4">

                {/* Ô nhập: Họ và tên */}
                <div>
                  <label className="block text-xs font-bold text-on-secondary-container mb-2 ml-1">Họ và tên</label>
                  <div className="relative group">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors">
                      <FiUser className="w-5 h-5" />
                    </span>
                    <input
                      type="text"
                      value={form.hoTen}
                      onChange={handleChange('hoTen')}
                      className={inputClass('hoTen')}
                      placeholder="Nguyễn Văn A"
                    />
                  </div>
                  {errors.hoTen && <p className="mt-1 text-xs text-[#EF4444] ml-1">{errors.hoTen}</p>}
                </div>

                {/* Ô nhập: Email */}
                <div>
                  <label className="block text-xs font-bold text-on-secondary-container mb-2 ml-1">Email</label>
                  <div className="relative group">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors">
                      <FiMail className="w-5 h-5" />
                    </span>
                    <input
                      type="email"
                      value={form.email}
                      onChange={handleChange('email')}
                      className={inputClass('email')}
                      placeholder="example@email.com"
                    />
                  </div>
                  {errors.email && <p className="mt-1 text-xs text-[#EF4444] ml-1">{errors.email}</p>}
                </div>

                {/* Ô nhập: Tên đăng nhập */}
                <div>
                  <label className="block text-xs font-bold text-on-secondary-container mb-2 ml-1">Tên đăng nhập</label>
                  <div className="relative group">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors">
                      <FiUser className="w-5 h-5" />
                    </span>
                    <input
                      type="text"
                      value={form.tenDangNhap}
                      onChange={handleChange('tenDangNhap')}
                      className={inputClass('tenDangNhap')}
                      placeholder="tendangnhap"
                      autoComplete="username"
                    />
                  </div>
                  {errors.tenDangNhap && <p className="mt-1 text-xs text-[#EF4444] ml-1">{errors.tenDangNhap}</p>}
                </div>

                {/* Ô nhập: Số điện thoại */}
                <div>
                  <label className="block text-xs font-bold text-on-secondary-container mb-2 ml-1">Số điện thoại</label>
                  <div className="relative group">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors">
                      <FiPhone className="w-5 h-5" />
                    </span>
                    <input
                      type="tel"
                      value={form.soDienThoai}
                      onChange={handleChange('soDienThoai')}
                      className={inputClass('soDienThoai')}
                      placeholder="0901234567"
                    />
                  </div>
                  {errors.soDienThoai && <p className="mt-1 text-xs text-[#EF4444] ml-1">{errors.soDienThoai}</p>}
                </div>

                {/* Ô nhập: Địa chỉ */}
                <div>
                  <label className="block text-xs font-bold text-on-secondary-container mb-2 ml-1">Địa chỉ</label>
                  <div className="relative group">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors">
                      <FiMapPin className="w-5 h-5" />
                    </span>
                    <input
                      type="text"
                      value={form.diaChi}
                      onChange={handleChange('diaChi')}
                      className={inputClass('diaChi')}
                      placeholder="123 Đường ABC, Quận 1, TP.HCM"
                    />
                  </div>
                  {errors.diaChi && <p className="mt-1 text-xs text-[#EF4444] ml-1">{errors.diaChi}</p>}
                </div>

                {/* Ô nhập: Mật khẩu */}
                <div>
                  <label className="block text-xs font-bold text-on-secondary-container mb-2 ml-1">Mật khẩu</label>
                  <div className="relative group">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors">
                      <FiLock className="w-5 h-5" />
                    </span>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={form.matKhau}
                      onChange={handleChange('matKhau')}
                      className={`${inputClass('matKhau')} !pr-12`}
                      placeholder="••••••••"
                      autoComplete="new-password"
                    />
                    {/* Nút ẩn/hiện mật khẩu */}
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-primary transition-colors focus:outline-none cursor-pointer"
                      tabIndex={-1}
                    >
                      {showPassword ? <FiEyeOff className="w-5 h-5" /> : <FiEye className="w-5 h-5" />}
                    </button>
                  </div>
                  {errors.matKhau && <p className="mt-1 text-xs text-[#EF4444] ml-1">{errors.matKhau}</p>}
                </div>

                {/* Ô nhập: Xác nhận mật khẩu */}
                <div>
                  <label className="block text-xs font-bold text-on-secondary-container mb-2 ml-1">Xác nhận mật khẩu</label>
                  <div className="relative group">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors">
                      <FiLock className="w-5 h-5" />
                    </span>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={form.xacNhanMatKhau}
                      onChange={handleChange('xacNhanMatKhau')}
                      className={inputClass('xacNhanMatKhau')}
                      placeholder="••••••••"
                      autoComplete="new-password"
                    />
                  </div>
                  {errors.xacNhanMatKhau && <p className="mt-1 text-xs text-[#EF4444] ml-1">{errors.xacNhanMatKhau}</p>}
                </div>

                {/* --- Checkbox đồng ý Điều khoản --- */}
                <label className="flex items-start gap-2.5 pt-1 cursor-pointer group select-none">
                  <input
                    type="checkbox"
                    checked={agreeTerms}
                    onChange={() => {
                      setAgreeTerms(!agreeTerms);
                      if (errors.agreeTerms) setErrors((prev) => ({ ...prev, agreeTerms: '' }));
                    }}
                    className="w-4 h-4 mt-0.5 rounded border-outline-variant text-primary focus:ring-primary/40 cursor-pointer accent-primary"
                  />
                  <span className="text-xs font-medium text-on-secondary-container leading-relaxed">
                    Tôi đồng ý với{' '}
                    <button type="button" onClick={() => toast('Điều khoản dịch vụ.', { icon: '📋' })} className="text-primary font-semibold hover:underline cursor-pointer">
                      Điều khoản dịch vụ
                    </button>
                    {' & '}
                    <button type="button" onClick={() => toast('Chính sách bảo mật.', { icon: '🔒' })} className="text-primary font-semibold hover:underline cursor-pointer">
                      Chính sách bảo mật
                    </button>
                  </span>
                </label>
                {errors.agreeTerms && <p className="text-xs text-[#EF4444] ml-1">{errors.agreeTerms}</p>}

                {/* Nút TẠO TÀI KHOẢN chính */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-4 px-6 bg-gradient-to-r from-primary to-secondary text-white font-bold text-sm rounded-full shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-60 disabled:scale-100 disabled:cursor-not-allowed cursor-pointer"
                >
                  {isLoading ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      Đang tạo tài khoản...
                    </span>
                  ) : (
                    'Tạo tài khoản'
                  )}
                </button>
              </form>

              {/* --- ĐƯỜNG PHÂN CÁCH --- */}
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

              {/* --- NÚT ĐĂNG NHẬP MẠNG XÃ HỘI (Google, Facebook) --- */}
              <div className="grid grid-cols-2 gap-4">

                {/* Nút Google */}
                <button
                  type="button"
                  onClick={() => toast('Đăng ký bằng Google đang phát triển.', { icon: '🔧' })}
                  className="flex items-center justify-center py-3 border-2 border-outline-variant/50 rounded-2xl hover:bg-primary-container hover:border-primary-container transition-all active:scale-95 cursor-pointer"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                  </svg>
                </button>

                {/* Nút Facebook */}
                <button
                  type="button"
                  onClick={() => toast('Đăng ký bằng Facebook đang phát triển.', { icon: '🔧' })}
                  className="flex items-center justify-center py-3 border-2 border-outline-variant/50 rounded-2xl hover:bg-primary-container hover:border-primary-container transition-all active:scale-95 cursor-pointer"
                >
                  <svg className="w-5 h-5" fill="#1877F2" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                </button>
              </div>

            </div>
            {/* === KẾT THÚC CARD ĐĂNG KÝ === */}

          </div>
        </section>
        {/* ========== KẾT THÚC CỘT PHẢI ========== */}

      </main>

      {/* ==================== FOOTER ==================== */}
      <Footer />

    </div>
  );
}
