import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  MdDashboard, 
  MdInventory, 
  MdCategory, 
  MdBookmark, 
  MdReceiptLong, 
  MdPeople, 
  MdManageAccounts, 
  MdBusiness,
  MdArrowBack,
  MdLogout,
  MdMilitaryTech,
  MdLocalOffer,
  MdLibraryAdd,
  MdBarChart
} from 'react-icons/md';

export default function AdminLayout({ children, requiredRole = 'Nhân viên' }) {
  const location = useLocation();
  const navigate = useNavigate();

  // Lấy thông tin user từ localStorage
  const user = JSON.parse(localStorage.getItem('user') || 'null');
  const token = localStorage.getItem('token');

  // Kiểm tra đăng nhập
  if (!token || !user) {
    // Nếu chưa đăng nhập, chuyển hướng sang đăng nhập
    React.useEffect(() => {
      navigate('/dangnhap');
    }, [navigate]);
    return null;
  }

  const userRole = user.vaiTro || user.role || 'NhanVien';
  // Phân quyền dựa chính xác vào dữ liệu Database mình đã tự tạo
  const isAdmin = userRole === 'Admin';
  const isStaff = userRole === 'NhanVien';

  // Kiểm tra quyền truy cập trang
  const hasPermission = () => {
    if (requiredRole === 'Admin') {
      return isAdmin;
    }
    return isAdmin || isStaff;
  };
  
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/';
  };
  // Menu items hiển thị trên sidebar
  const menuItems = [
    { name: 'Tổng quan', path: '/admin/dashboard', icon: MdDashboard, adminOnly: false },
    { name: 'QL Sản phẩm', path: '/admin/sanpham', icon: MdInventory, adminOnly: false },
    { name: 'QL Loại sản phẩm', path: '/admin/loaisp', icon: MdCategory, adminOnly: true },
    { name: 'QL Thương hiệu', path: '/admin/thuonghieu', icon: MdBookmark, adminOnly: true },
    { name: 'QL Đơn hàng', path: '/admin/donhang', icon: MdReceiptLong, adminOnly: false },
    { name: 'QL Khách hàng', path: '/admin/khachhang', icon: MdPeople, adminOnly: false },
    { name: 'QL Nhân viên', path: '/admin/nhanvien', icon: MdManageAccounts, adminOnly: true },
    { name: 'QL Hạng thành viên', path: '/admin/hangthanhvien', icon: MdMilitaryTech, adminOnly: true },
    { name: 'QL Nhà cung cấp', path: '/admin/ncc', icon: MdBusiness, adminOnly: true },
    { name: 'QL Khuyến mãi', path: '/admin/khuyenmai', icon: MdLocalOffer, adminOnly: false },
    { name: 'QL Nhập hàng', path: '/admin/nhaphang', icon: MdLibraryAdd, adminOnly: false },
    { name: 'Báo cáo', path: '/admin/baocao', icon: MdBarChart, adminOnly: true },
  ];

  return (
    <div className="min-h-screen bg-background flex text-on-background font-body-md selection:bg-primary-container selection:text-primary">
      
      {/* Sidebar */}
      <aside className="w-[230px] bg-[#0F172A] text-slate-300 flex flex-col shrink-0 border-r border-slate-800">
        {/* Brand Header */}
        <div className="h-20 flex items-center px-6 border-b border-slate-800 gap-3">
          <span className="w-9 h-9 rounded-full bg-primary flex items-center justify-center text-white font-bold text-xl shadow-md">
            D
          </span>
          <div>
            <h1 className="text-lg font-bold text-white leading-tight">Dinh Store</h1>
          </div>
        </div>

        {/* User profile brief */}
        <div className="p-5 border-b border-slate-800 flex items-center gap-3">
          <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-slate-700 bg-slate-800">
            <img 
              src={user.avatar 
                ? (user.avatar.startsWith('http') ? user.avatar : `https://localhost:7224${user.avatar}`) 
                : `https://ui-avatars.com/api/?name=${encodeURIComponent(user.hoTen || 'U')}&background=EFF6FF&color=2563EB`}
              alt="Avatar" 
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <h4 className="font-bold text-sm text-white line-clamp-1">{user.hoTen}</h4>
            <span className="px-2 py-0.5 bg-primary/20 text-primary rounded-full text-[10px] font-bold">
              {isAdmin ? (userRole || 'Admin') : (userRole || 'Nhân viên')}
            </span>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto">
          {menuItems.map((item) => {
            // Ẩn menu nếu nhân viên không có quyền truy cập
            if (item.adminOnly && !isAdmin) return null;
            
            const active = location.pathname === item.path;

            return (
              <Link 
                key={item.path} 
                to={item.path} 
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all group
                  ${active 
                    ? 'bg-primary text-white shadow-md shadow-primary/20' 
                    : 'hover:bg-slate-800 hover:text-white'
                  }`}
              >
                <item.icon className={`w-5 h-5 shrink-0 ${active ? 'text-white' : 'text-slate-400 group-hover:text-white'}`} />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Footer actions */}
        <div className="p-4 border-t border-slate-800 space-y-1">
          <Link to="/" className="flex items-center gap-3 w-full px-4 py-3 text-slate-400 hover:text-white rounded-xl text-sm font-semibold transition-colors">
            <MdArrowBack className="w-5 h-5" />
            <span>Quay lại client</span>
          </Link>
          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-4 py-3 text-red-400 hover:bg-red-500/10 rounded-xl text-sm font-semibold transition-colors cursor-pointer"
          >
            <MdLogout className="w-5 h-5" />
            <span>Đăng xuất</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <header className="h-20 bg-surface border-b border-outline-variant/30 px-8 flex items-center justify-between">
          <h2 className="text-xl font-bold text-on-background">
            {menuItems.find(item => item.path === location.pathname)?.name || 'Trang quản lý'}
          </h2>

          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm font-bold text-on-background">{user.hoTen}</p>
              <p className="text-xs text-on-secondary-container">{user.email || 'Chưa cập nhật email'}</p>
            </div>
            <div className="w-10 h-10 rounded-full overflow-hidden border border-outline-variant/30">
              <img 
                src={user.avatar 
                  ? (user.avatar.startsWith('http') ? user.avatar : `https://localhost:7224${user.avatar}`) 
                  : `https://ui-avatars.com/api/?name=${encodeURIComponent(user.hoTen || 'U')}&background=EFF6FF&color=2563EB`}
                alt="Avatar" 
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </header>

        {/* Content body */}
        <main className="flex-1 p-8 overflow-y-auto bg-background">
          {hasPermission() ? (
            children
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center">
              <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mb-4 border border-red-100">
                <svg className="w-10 h-10 text-red-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-on-background mb-2">Không có quyền truy cập</h3>
              <p className="text-on-secondary-container max-w-md">
                Tài khoản của bạn với vai trò <strong>{isAdmin ? 'Admin' : 'Nhân viên'}</strong> không có quyền xem trang này. Vui lòng liên hệ Quản trị viên để biết thêm chi tiết.
              </p>
            </div>
          )}
        </main>
      </div>

    </div>
  );
}
