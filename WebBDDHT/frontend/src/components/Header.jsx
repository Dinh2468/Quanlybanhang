import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { MdSearch, MdPerson, MdShoppingBag, MdFavoriteBorder } from 'react-icons/md';
import API from '../services/api';
import { getCartToken } from '../utils/cart';

export default function Header() {
  const location = useLocation();
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  
  const [cartCount, setCartCount] = useState(0);
  const [favCount, setFavCount] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [userInfo, setUserInfo] = useState(JSON.parse(localStorage.getItem('user') || 'null'));

  const handleSearch = (e) => {
    if (e.key === 'Enter') {
      if (searchTerm.trim() !== '') {
        navigate(`/sanpham?search=${encodeURIComponent(searchTerm.trim())}`);
      } else {
        navigate(`/sanpham`);
      }
    }
  };

  useEffect(() => {
    const updateCartCount = async () => {
      try {
        const cartToken = getCartToken();
        const res = await API.get(`/GioHang?cartToken=${cartToken}`);
        const items = res.data.danhSachSanPham || [];
        const count = items.length;
        setCartCount(count);
      } catch (error) {
        console.error('Lỗi lấy số lượng giỏ hàng:', error);
      }
    };
    const updateFavCount = async () => {
      if (token) {
        try {
          const res = await API.get('/YeuThich/ids');
          setFavCount(res.data.length || 0);
        } catch (error) {
          console.error('Lỗi lấy số lượng yêu thích:', error);
        }
      }
    };
    
    const fetchUserInfo = async () => {
      if (token) {
        try {
          const res = await API.get('/TaiKhoan/thongtin');
          setUserInfo(res.data);
          localStorage.setItem('user', JSON.stringify(res.data));
        } catch (error) {
          console.error('Lỗi lấy thông tin user Header:', error);
        }
      }
    };

    updateCartCount();
    updateFavCount();
    fetchUserInfo();
    window.addEventListener('cartUpdated', updateCartCount);
    window.addEventListener('favUpdated', updateFavCount);
    // Lắng nghe sự kiện cập nhật avatar từ ThongTinCaNhan
    window.addEventListener('userUpdated', fetchUserInfo);
    
    return () => {
      window.removeEventListener('cartUpdated', updateCartCount);
      window.removeEventListener('favUpdated', updateFavCount);
      window.removeEventListener('userUpdated', fetchUserInfo);
    };
  }, [token]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.reload();
  };

  const isActive = (path) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <header className="bg-[#1E3A8A] border-b border-[#1E3A8A] shadow-md sticky top-0 z-50 h-20">
      <div className="flex justify-between items-center w-full px-4 md:px-10 max-w-[1280px] mx-auto h-full gap-6">
        <div className="flex items-center gap-10">
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-2 group shrink-0">
            <span className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-2xl shadow-md group-hover:scale-105 transition-transform">
              D
            </span>
            <span className="text-xl font-bold text-white tracking-tight group-hover:text-[#93C5FD] transition-colors">
              Dinh Store
            </span>
          </Link>

          {/* Nav Links */}
          <nav className="hidden lg:flex items-center gap-6 mt-1">
            <Link to="/" className={`font-label-md text-sm text-white hover:text-[#93C5FD] transition-colors border-b-2 pb-1 ${isActive('/') ? 'border-[#93C5FD] text-[#93C5FD] font-bold' : 'border-transparent hover:border-[#93C5FD]'}`}>Cửa hàng</Link>
            <Link to="/sanpham" className={`font-label-md text-sm text-white hover:text-[#93C5FD] transition-colors border-b-2 pb-1 ${isActive('/sanpham') && !location.search.includes('loai=') ? 'border-[#93C5FD] text-[#93C5FD] font-bold' : 'border-transparent hover:border-[#93C5FD]'}`}>Sản Phẩm</Link>
            <Link to="/khuyenmai" className={`font-label-md text-sm text-white hover:text-[#93C5FD] transition-colors border-b-2 pb-1 ${isActive('/khuyenmai') ? 'border-[#93C5FD] text-[#93C5FD] font-bold' : 'border-transparent hover:border-[#93C5FD]'}`}>Khuyến mãi</Link>
            {/* <Link to="/sanpham?loai=1" className={`font-label-md text-sm text-white hover:text-[#93C5FD] transition-colors border-b-2 pb-1 ${isActive('/sanpham') && location.search.includes('loai=1') ? 'border-[#93C5FD] text-[#93C5FD] font-bold' : 'border-transparent hover:border-[#93C5FD]'}`}>Bút & Mực</Link>
            <Link to="#" className="font-label-md text-sm text-white hover:text-[#93C5FD] transition-colors border-b-2 border-transparent hover:border-[#93C5FD] pb-1">Quà tặng</Link> */}
          </nav>
        </div>

        {/* Search Bar */}
        <div className="hidden md:flex flex-1 max-w-sm relative group ml-auto">
          <MdSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 z-10" />
          <input 
            type="text" 
            placeholder="Tìm kiếm bút, sổ tay..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={handleSearch}
            className="w-full bg-white border border-[#D1D5DB] rounded-full h-10 pl-11 pr-4 text-sm font-body-md text-[#111827] focus:outline-none focus:border-[#2563EB] focus:ring-4 focus:ring-[#2563EB]/15 transition-all"
          />
        </div>

        {/* Actions */}
        <div className="flex items-center gap-4 shrink-0 ml-auto">
          <Link to="/yeuthich" className="relative hidden sm:flex w-10 h-10 items-center justify-center rounded-full hover:bg-white/10 transition-colors text-white cursor-pointer">
            <MdFavoriteBorder className="w-6 h-6" />
            {favCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-[#F97316] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center border-2 border-[#1E3A8A]">{favCount}</span>
            )}
          </Link>
          <Link to="/giohang" className="relative w-10 h-10 flex items-center justify-center rounded-full hover:bg-white/10 transition-colors text-white cursor-pointer">
            <MdShoppingBag className="w-6 h-6" />
            <span className="absolute -top-1 -right-1 bg-[#F97316] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center border-2 border-[#1E3A8A]">{cartCount}</span>
          </Link>
          {token ? (
            <div className="group relative w-10 h-10 flex items-center justify-center rounded-full bg-white/10 text-white font-bold text-sm cursor-pointer ml-2 border-2 border-transparent hover:border-white transition-all">
              <img 
                src={userInfo?.avatar 
                  ? (userInfo.avatar.startsWith('http') ? userInfo.avatar : `https://localhost:7224${userInfo.avatar}`) 
                  : `https://ui-avatars.com/api/?name=${encodeURIComponent(userInfo?.hoTen || 'U')}&background=e8eff5&color=50616b`} 
                alt="Avatar" 
                className="w-full h-full rounded-full object-cover" 
              />
              <div className="absolute top-full right-0 mt-2 w-48 bg-white shadow-lg rounded-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all flex flex-col overflow-hidden border border-gray-100 z-50">
                <Link to="/thongtincanhan" className="px-4 py-3 text-sm text-[#3a4750] hover:bg-surface-container text-left font-bold cursor-pointer border-b border-outline-variant/20">Thông tin cá nhân</Link>
                <Link to="/lichsudonhang" className="px-4 py-3 text-sm text-[#3a4750] hover:bg-surface-container text-left font-bold cursor-pointer border-b border-outline-variant/20">Lịch sử đơn hàng</Link>
                <button onClick={handleLogout} className="px-4 py-3 text-sm text-red-600 hover:bg-red-50 text-left font-bold cursor-pointer">Đăng xuất</button>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2 ml-2">
              <Link to="/dangnhap" className="px-4 py-2 text-sm font-bold text-white bg-transparent border border-white hover:bg-white/10 rounded-full transition-colors whitespace-nowrap">
                Đăng nhập
              </Link>
              <Link to="/dangky" className="px-4 py-2 text-sm font-bold text-white bg-[#F97316] hover:bg-[#EA580C] rounded-full transition-colors shadow-sm whitespace-nowrap">
                Đăng ký
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
