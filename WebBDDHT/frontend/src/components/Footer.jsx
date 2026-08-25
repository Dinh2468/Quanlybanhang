import { Link } from 'react-router-dom';
import { FiMail, FiPhone, FiMapPin } from 'react-icons/fi';

// ============================================================
// COMPONENT FOOTER - Dùng chung cho tất cả các trang
// Import: import Footer from '../../components/Footer';
// Sử dụng: <Footer /> đặt ở cuối mỗi trang
// ============================================================

export default function Footer() {
  return (
    <footer className="w-full bg-[#0F172A] border-t border-gray-800">

      {/* --- Phần chính: 3 cột thông tin --- */}
      <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-1 md:grid-cols-3 gap-8">

        {/* Cột 1: Thông tin cửa hàng */}
        <div>
          {/* Logo + tên */}
          <div className="flex items-center gap-2 mb-4">
            <span className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-lg shadow-md">
              D
            </span>
            <span className="text-lg font-bold text-white">Dinh Store</span>
          </div>
          {/* Mô tả ngắn */}
          <p className="text-sm text-[#CBD5E1] leading-relaxed">
            Cung cấp dụng cụ học tập chất lượng cao với giá cả phải chăng cho học sinh, sinh viên.
          </p>
        </div>

        {/* Cột 2: Liên kết nhanh */}
        <div>
          <h3 className="text-sm font-bold text-white mb-4">Liên kết</h3>
          <ul className="space-y-2">
            <li>
              <Link to="/" className="text-sm text-[#CBD5E1] hover:text-[#60A5FA] transition-colors">
                Trang chủ
              </Link>
            </li>
            <li>
              <Link to="/dangnhap" className="text-sm text-[#CBD5E1] hover:text-[#60A5FA] transition-colors">
                Đăng nhập
              </Link>
            </li>
            <li>
              <Link to="/dangky" className="text-sm text-[#CBD5E1] hover:text-[#60A5FA] transition-colors">
                Đăng ký
              </Link>
            </li>
          </ul>
        </div>

        {/* Cột 3: Thông tin liên hệ */}
        <div>
          <h3 className="text-sm font-bold text-white mb-4">Liên hệ</h3>
          <ul className="space-y-3">
            <li className="flex items-center gap-2 text-sm text-[#CBD5E1]">
              <FiMapPin className="w-4 h-4 text-[#60A5FA] shrink-0" />
              <span>TP. Hồ Chí Minh, Việt Nam</span>
            </li>
            <li className="flex items-center gap-2 text-sm text-[#CBD5E1]">
              <FiPhone className="w-4 h-4 text-[#60A5FA] shrink-0" />
              <span>0901 234 567</span>
            </li>
            <li className="flex items-center gap-2 text-sm text-[#CBD5E1]">
              <FiMail className="w-4 h-4 text-[#60A5FA] shrink-0" />
              <span>contact@dinhstore.com</span>
            </li>
          </ul>
        </div>
      </div>

      {/* --- Dòng cuối: Bản quyền --- */}
      <div className="border-t border-gray-800 py-4">
        <p className="text-center text-xs text-gray-500">
          © 2026 Dinh Store. Bảo lưu mọi quyền.
        </p>
      </div>
    </footer>
  );
}
