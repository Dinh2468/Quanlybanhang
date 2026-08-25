import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  MdPerson, 
  MdHistory, 
  MdLogout, 
  MdCameraAlt, 
  MdLockOutline
} from 'react-icons/md';
import toast from 'react-hot-toast';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import API from '../../services/api';

export default function ThongTinCaNhan() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [avatar, setAvatar] = useState(null);

  // Edit states
  const [editingField, setEditingField] = useState(null);
  const [editFormData, setEditFormData] = useState({
    hoTen: '',
    email: '',
    soDienThoai: '',
    diaChi: ''
  });



  // Change password state
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordFormData, setPasswordFormData] = useState({
    matKhauCu: '',
    matKhauMoi: '',
    xacNhanMatKhau: ''
  });

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await API.get('/TaiKhoan/thongtin');
        setUser(res.data);
        setAvatar(res.data.avatar);
        setEditFormData({
          hoTen: res.data.hoTen || '',
          email: res.data.email || '',
          soDienThoai: res.data.soDienThoai || '',
          diaChi: res.data.diaChi || ''
        });
      } catch (error) {
        console.error('Lỗi lấy thông tin:', error);
        toast.error('Vui lòng đăng nhập lại!');
        navigate('/dangnhap');
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/';
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (passwordFormData.matKhauMoi !== passwordFormData.xacNhanMatKhau) {
      toast.error('Mật khẩu mới không khớp!');
      return;
    }
    if (passwordFormData.matKhauMoi.length < 6) {
      toast.error('Mật khẩu mới phải có ít nhất 6 ký tự!');
      return;
    }
    
    try {
      await API.put('/TaiKhoan/doimatkhau', {
        matKhauCu: passwordFormData.matKhauCu,
        matKhauMoi: passwordFormData.matKhauMoi
      });
      toast.success('Đổi mật khẩu thành công!');
      setShowPasswordModal(false);
      setPasswordFormData({ matKhauCu: '', matKhauMoi: '', xacNhanMatKhau: '' });
    } catch (error) {
      console.error(error);
      const errorMsg = error.response?.data?.message || 'Lỗi khi đổi mật khẩu!';
      toast.error(errorMsg);
    }
  };

  if (loading) {
    return <div className="min-h-screen bg-[#f4f7f6] flex items-center justify-center">Đang tải...</div>;
  }

  // Fallback info
  const fullName = user?.hoTen || 'Người dùng';
  const membership = user?.tenHangThanhVien || 'Thành viên Mới';

  const getAvatarUrl = (avatarStr, name) => {
    if (!avatarStr) return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=e2e8f0&color=3a4750&size=150`;
    if (avatarStr.startsWith('http') || avatarStr.startsWith('data:')) return avatarStr;
    return `https://localhost:7224/images/${avatarStr}`;
  };

  const displayAvatar = getAvatarUrl(avatar, fullName);
  // Ảnh đại diện
  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      // Giới hạn dung lượng 2MB
      if (file.size > 2 * 1024 * 1024) {
        toast.error('Ảnh quá lớn. Vui lòng chọn ảnh dưới 2MB');
        return;
      }
      
      const formData = new FormData();
      formData.append('HoTen', user?.hoTen || 'Người dùng');
      formData.append('SoDienThoai', user?.soDienThoai || '');
      formData.append('DiaChi', user?.diaChi || '');
      formData.append('Email', user?.email || '');
      formData.append('FileAvatar', file);

      try {
        await API.put('/TaiKhoan/capnhatthongtin', formData, {
          headers: {
            'Content-Type': undefined
          }
        });
        
        // Cập nhật preview ảnh ngay lập tức
        const reader = new FileReader();
        reader.onloadend = () => {
          setAvatar(reader.result);
        };
        reader.readAsDataURL(file);

        toast.success('Cập nhật ảnh đại diện thành công!');
        window.dispatchEvent(new Event('userUpdated'));
      } catch (error) {
        console.error(error.response?.data);
        const errorMsg = error.response?.data?.message 
          || (error.response?.data?.errors ? JSON.stringify(error.response.data.errors) : null)
          || error.message;
        toast.error('Lỗi: ' + errorMsg);
      }
    }
  };
  // Chỉnh sửa thông tin cá nhân
  const handleEditClick = (field) => {
    setEditingField(field);
  };
  // Lưu thông tin cá nhân
  const handleSaveInfo = async (field) => {
    if (field === 'soDienThoai' && editFormData.soDienThoai) {
      if (!/^0(3|5|7|8|9)\d{8}$/.test(editFormData.soDienThoai)) {
        toast.error('Số điện thoại không hợp lệ (bắt đầu bằng 03,05,07,08,09 và đủ 10 số).');
        return;
      }
    }

    const formData = new FormData();
    formData.append('HoTen', editFormData.hoTen || user?.hoTen || 'Người dùng');
    formData.append('SoDienThoai', editFormData.soDienThoai || user?.soDienThoai || '');
    formData.append('Email', editFormData.email || user?.email || '');
    formData.append('DiaChi', editFormData.diaChi || user?.diaChi || '');
    
    try {
      await API.put('/TaiKhoan/capnhatthongtin', formData, {
        headers: {
          'Content-Type': undefined
        }
      });
      toast.success('Cập nhật thông tin thành công!');
      window.dispatchEvent(new Event('userUpdated'));
      setEditingField(null);
      // Cập nhật lại user gốc
      setUser(prev => ({
        ...prev,
        hoTen: editFormData.hoTen,
        email: editFormData.email,
        soDienThoai: editFormData.soDienThoai,
        diaChi: editFormData.diaChi
      }));
    } catch (error) {
      console.error(error.response?.data);
      const errorMsg = error.response?.data?.message 
        || (error.response?.data?.errors ? JSON.stringify(error.response.data.errors) : null)
        || error.message;
      toast.error('Lỗi cập nhật: ' + errorMsg);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col font-body-md text-[#111827] selection:bg-primary-container selection:text-[#2563EB]">
      <Header />
      
      <main className="flex-1 max-w-[1280px] mx-auto w-full px-4 py-8 grid grid-cols-1 md:grid-cols-[280px_1fr] gap-8">
        
        {/* Sidebar */}
        <aside className="bg-white/60 rounded-3xl p-6 flex flex-col items-center border border-outline-variant/30 h-fit">
          <div className="w-24 h-24 rounded-full overflow-hidden mb-4 border-4 border-white shadow-sm shrink-0">
            <img 
              src={displayAvatar} 
              alt="Avatar" 
              className="w-full h-full object-cover" 
            />
          </div>
          <h2 className="text-xl font-bold text-center mb-1">{fullName}</h2>
          <p className="text-sm text-[#6B7280] text-center mb-8">Hạng:{membership}</p>
 
          <nav className="w-full flex flex-col gap-2">
            <Link to="/thongtincanhan" className="flex items-center gap-3 w-full px-4 py-3 bg-[#EFF6FF] text-[#2563EB] rounded-xl font-bold transition-colors">
              <MdPerson className="w-5 h-5" />
              Hồ sơ của tôi
            </Link>
            <Link to="/lichsudonhang" className="flex items-center gap-3 w-full px-4 py-3 text-[#6B7280] hover:bg-[#EFF6FF] hover:text-[#2563EB] rounded-xl font-medium transition-colors">
              <MdHistory className="w-5 h-5" />
              Lịch sử đơn hàng
            </Link>
            <div className="my-2 border-t border-outline-variant/30"></div>
            <button 
              onClick={handleLogout}
              className="flex items-center gap-3 w-full px-4 py-3 text-red-600 hover:bg-red-50 rounded-xl font-bold transition-colors cursor-pointer"
            >
              <MdLogout className="w-5 h-5" />
              Đăng xuất
            </button>
          </nav>
        </aside>
 
        {/* Main Content */}
        <div className="flex flex-col gap-6">
          
          {/* Header Card */}
          <div className="bg-white rounded-3xl p-6 border border-outline-variant/30 flex items-center gap-6">
            <div className="relative shrink-0">
              <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-surface-container">
                <img 
                  src={displayAvatar} 
                  alt="Avatar" 
                  className="w-full h-full object-cover" 
                />
              </div>
              <input type="file" accept="image/*" className="hidden" id="avatarUpload" onChange={handleAvatarChange} />
              <label htmlFor="avatarUpload" className="absolute bottom-0 right-0 w-7 h-7 bg-[#2563EB] text-white rounded-full flex items-center justify-center border-2 border-white cursor-pointer hover:bg-[#1D4ED8] shadow-sm">
                <MdCameraAlt className="w-4 h-4" />
              </label>
            </div>
            <div>
              <h1 className="text-2xl font-bold mb-1">Hồ sơ cá nhân</h1>
              <p className="text-sm text-[#6B7280]">Cập nhật ảnh đại diện và chi tiết thông tin của bạn để có trải nghiệm mua sắm tốt nhất.</p>
              <label htmlFor="avatarUpload" className="mt-3 inline-block px-4 py-1.5 bg-[#EFF6FF] text-[#2563EB] text-sm font-bold rounded-full hover:bg-[#2563EB]/10 transition-colors cursor-pointer">
                Cập nhật ảnh
              </label>
            </div>
          </div>
 
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6 items-start">
            
            {/* Info Card */}
            <div className="bg-white rounded-3xl p-6 border border-outline-variant/30 flex flex-col">
              <div className="flex items-center gap-2 mb-6">
                <MdPerson className="w-5 h-5 text-[#2563EB]" />
                <h3 className="font-bold text-lg">Thông tin cá nhân</h3>
              </div>
 
              <div className="flex flex-col gap-6">
                <div className="flex justify-between items-center border-b border-outline-variant/20 pb-4">
                  <div className="flex-1">
                    <p className="text-xs font-bold text-[#6B7280] mb-1 uppercase tracking-wider">Họ và tên</p>
                    {editingField === 'hoTen' ? (
                      <input 
                        type="text" 
                        className="w-full font-medium border-b border-primary outline-none bg-transparent" 
                        value={editFormData.hoTen}
                        onChange={(e) => setEditFormData({...editFormData, hoTen: e.target.value})}
                        autoFocus
                      />
                    ) : (
                      <p className="font-medium">{user?.hoTen || 'Chưa cập nhật'}</p>
                    )}
                  </div>
                  {editingField === 'hoTen' ? (
                    <button onClick={() => handleSaveInfo('hoTen')} className="text-sm font-bold text-primary hover:text-[#1D4ED8] ml-4 transition-colors cursor-pointer">Lưu</button>
                  ) : (
                    <button onClick={() => handleEditClick('hoTen')} className="text-sm font-bold text-[#6B7280] hover:text-primary ml-4 transition-colors cursor-pointer">Chỉnh sửa</button>
                  )}
                </div>
                
                <div className="flex justify-between items-center border-b border-outline-variant/20 pb-4">
                  <div className="flex-1">
                    <p className="text-xs font-bold text-[#6B7280] mb-1 uppercase tracking-wider">Email</p>
                    {editingField === 'email' ? (
                      <input 
                        type="email" 
                        className="w-full font-medium border-b border-primary outline-none bg-transparent" 
                        value={editFormData.email}
                        onChange={(e) => setEditFormData({...editFormData, email: e.target.value})}
                        autoFocus
                      />
                    ) : (
                      <p className="font-medium">{user?.email || 'Chưa cập nhật'}</p>
                    )}
                  </div>
                  {editingField === 'email' ? (
                    <button onClick={() => handleSaveInfo('email')} className="text-sm font-bold text-primary hover:text-[#1D4ED8] ml-4 transition-colors cursor-pointer">Lưu</button>
                  ) : (
                    <button onClick={() => handleEditClick('email')} className="text-sm font-bold text-[#6B7280] hover:text-primary ml-4 transition-colors cursor-pointer">Chỉnh sửa</button>
                  )}
                </div>
 
                <div className="flex justify-between items-center border-b border-outline-variant/20 pb-4">
                  <div className="flex-1">
                    <p className="text-xs font-bold text-[#6B7280] mb-1 uppercase tracking-wider">Số điện thoại</p>
                    {editingField === 'soDienThoai' ? (
                      <input 
                        type="text" 
                        className="w-full font-medium border-b border-primary outline-none bg-transparent" 
                        value={editFormData.soDienThoai}
                        onChange={(e) => setEditFormData({...editFormData, soDienThoai: e.target.value})}
                        autoFocus
                      />
                    ) : (
                      <p className="font-medium">{user?.soDienThoai || 'Chưa cập nhật'}</p>
                    )}
                  </div>
                  {editingField === 'soDienThoai' ? (
                    <button onClick={() => handleSaveInfo('soDienThoai')} className="text-sm font-bold text-primary hover:text-[#1D4ED8] ml-4 transition-colors cursor-pointer">Lưu</button>
                  ) : (
                    <button onClick={() => handleEditClick('soDienThoai')} className="text-sm font-bold text-[#6B7280] hover:text-primary ml-4 transition-colors cursor-pointer">Chỉnh sửa</button>
                  )}
                </div>

                <div className="flex justify-between items-center">
                  <div className="flex-1">
                    <p className="text-xs font-bold text-[#6B7280] mb-1 uppercase tracking-wider">Địa chỉ</p>
                    {editingField === 'diaChi' ? (
                      <input 
                        type="text" 
                        className="w-full font-medium border-b border-primary outline-none bg-transparent" 
                        value={editFormData.diaChi}
                        onChange={(e) => setEditFormData({...editFormData, diaChi: e.target.value})}
                        autoFocus
                      />
                    ) : (
                      <p className="font-medium">{user?.diaChi || 'Chưa cập nhật'}</p>
                    )}
                  </div>
                  {editingField === 'diaChi' ? (
                    <button onClick={() => handleSaveInfo('diaChi')} className="text-sm font-bold text-primary hover:text-[#1D4ED8] ml-4 transition-colors cursor-pointer">Lưu</button>
                  ) : (
                    <button onClick={() => handleEditClick('diaChi')} className="text-sm font-bold text-[#6B7280] hover:text-primary ml-4 transition-colors cursor-pointer">Chỉnh sửa</button>
                  )}
                </div>
              </div>
            </div>
 
            <div className="flex flex-col gap-6">
              
              {/* Password Card */}
              <div className="bg-[#fbf9f4] rounded-3xl p-6 border border-[#e0d6c8] flex flex-col">
                <div className="flex items-center gap-2 mb-4">
                  <MdLockOutline className="w-5 h-5 text-[#8b7355]" />
                  <h3 className="font-bold text-lg text-[#5a4a35]">Thay đổi mật khẩu</h3>
                </div>
                <div className="flex justify-between items-center mt-2">
                  <p className="text-sm italic text-[#8b7355]">Bảo mật tài khoản của bạn</p>
                  <button 
                    onClick={() => setShowPasswordModal(true)}
                    className="px-4 py-2 border border-[#8b7355] text-[#5a4a35] text-sm font-bold rounded-full hover:bg-[#8b7355] hover:text-white transition-colors cursor-pointer"
                  >
                    Đổi mật khẩu
                  </button>
                </div>
              </div>
 
            

            </div>
          </div>
        </div>
      </main>

      {/* Password Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full mx-4 shadow-xl">
            <h2 className="text-2xl font-bold text-[#3a4750] mb-6">Đổi mật khẩu</h2>
            <form onSubmit={handleChangePassword} className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-[#5a4a35] mb-2">Mật khẩu hiện tại</label>
                <input 
                  type="password" 
                  required
                  value={passwordFormData.matKhauCu}
                  onChange={(e) => setPasswordFormData({...passwordFormData, matKhauCu: e.target.value})}
                  className="w-full border border-[#e0d6c8] rounded-xl px-4 py-3 focus:outline-none focus:border-[#8b7355] focus:ring-1 focus:ring-[#8b7355]"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-[#5a4a35] mb-2">Mật khẩu mới</label>
                <input 
                  type="password" 
                  required
                  value={passwordFormData.matKhauMoi}
                  onChange={(e) => setPasswordFormData({...passwordFormData, matKhauMoi: e.target.value})}
                  className="w-full border border-[#e0d6c8] rounded-xl px-4 py-3 focus:outline-none focus:border-[#8b7355] focus:ring-1 focus:ring-[#8b7355]"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-[#5a4a35] mb-2">Xác nhận mật khẩu mới</label>
                <input 
                  type="password" 
                  required
                  value={passwordFormData.xacNhanMatKhau}
                  onChange={(e) => setPasswordFormData({...passwordFormData, xacNhanMatKhau: e.target.value})}
                  className="w-full border border-[#e0d6c8] rounded-xl px-4 py-3 focus:outline-none focus:border-[#8b7355] focus:ring-1 focus:ring-[#8b7355]"
                />
              </div>
              <div className="flex gap-4 mt-8">
                <button 
                  type="button"
                  onClick={() => {
                    setShowPasswordModal(false);
                    setPasswordFormData({ matKhauCu: '', matKhauMoi: '', xacNhanMatKhau: '' });
                  }}
                  className="flex-1 px-4 py-3 rounded-full font-bold text-[#5a4a35] bg-[#fbf9f4] hover:bg-[#e0d6c8] transition-colors cursor-pointer"
                >
                  Hủy
                </button>
                <button 
                  type="submit"
                  className="flex-1 px-4 py-3 rounded-full font-bold text-white bg-[#8b7355] hover:bg-[#5a4a35] transition-colors cursor-pointer"
                >
                  Lưu thay đổi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
