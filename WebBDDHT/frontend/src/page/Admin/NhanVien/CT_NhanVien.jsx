import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import API from '../../../services/api';
import AdminLayout from '../../../components/AdminLayout';
import { toast } from 'react-hot-toast';
import { MdArrowBack, MdSave, MdPerson } from 'react-icons/md';

export default function CT_NhanVien() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [loading, setLoading] = useState(isEdit);
  const [submitLoading, setSubmitLoading] = useState(false);

  const [currentAccount, setCurrentAccount] = useState({
    hoTen: '',
    tenDangNhap: '',
    email: '',
    soDienThoai: '',
    diaChi: '',
    gioiTinh: 'Nam',
    ngaySinh: '',
    vaiTro: 'Nhân viên',
    matKhau: '',
    trangThai: 'Đang hoạt động'
  });

  useEffect(() => {
    if (isEdit) {
      fetchAccountDetails();
    }
  }, [id]);

  const fetchAccountDetails = async () => {
    try {
      setLoading(true);
      const res = await API.get(`/NhanVien/${id}`);
      const data = res.data;
      setCurrentAccount({
        hoTen: data.hoTen || '',
        tenDangNhap: data.tenDangNhap || '',
        email: data.email || '',
        soDienThoai: data.sdt || '',
        diaChi: data.diaChi || '',
        gioiTinh: data.gioiTinh || 'Nam',
        ngaySinh: data.ngaySinh ? data.ngaySinh.split('T')[0] : '',
        vaiTro: data.vaiTro || data.role || 'Nhân viên',
        matKhau: '', // Không tải mật khẩu về
        trangThai: data.trangThai || 'Đang hoạt động'
      });
    } catch (error) {
      console.error('Lỗi khi tải chi tiết tài khoản:', error);
      toast.error('Không thể tải thông tin tài khoản!');
      navigate('/admin/nhanvien');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!currentAccount.tenDangNhap.trim()) {
      toast.error('Vui lòng nhập tên đăng nhập!');
      return;
    }
    if (!isEdit && !currentAccount.matKhau) {
      toast.error('Vui lòng nhập mật khẩu cho tài khoản mới!');
      return;
    }

    setSubmitLoading(true);

    try {
      if (isEdit) {
        await API.put(`/NhanVien/${id}`, currentAccount);
        toast.success('Cập nhật tài khoản thành công!');
      } else {
        await API.post('/NhanVien', currentAccount);
        toast.success('Tạo tài khoản mới thành công!');
      }
      navigate('/admin/nhanvien');
    } catch (error) {
      console.error('Lỗi khi lưu tài khoản:', error);
      toast.error('Lỗi khi lưu tài khoản: ' + (error.response?.data?.message || error.message));
    } finally {
      setSubmitLoading(false);
    }
  };

  return (
    <AdminLayout requiredRole="Admin">
      <div className="space-y-6">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 rounded-3xl shadow-sm border border-gray-100">
          <div className="flex items-center gap-4">
            <Link 
              to="/admin/nhanvien"
              className="w-10 h-10 flex items-center justify-center rounded-full text-gray-500 hover:bg-gray-100 hover:text-gray-900 transition-colors cursor-pointer"
            >
              <MdArrowBack className="w-6 h-6" />
            </Link>
            <div>
              <h2 className="text-2xl font-extrabold text-gray-900 tracking-tight">
                {isEdit ? 'Chỉnh sửa tài khoản' : 'Thêm tài khoản mới'}
              </h2>
              <p className="text-sm text-gray-500 mt-0.5">
                {isEdit ? `Mã tài khoản: #${id}` : 'Nhập thông tin cho nhân viên mới'}
              </p>
            </div>
          </div>
          <button 
            type="button"
            onClick={handleSubmit}
            disabled={submitLoading || loading}
            className="px-6 py-3 bg-[#0070F3] hover:bg-[#0060df] text-white text-sm font-bold rounded-full flex items-center justify-center gap-2 cursor-pointer shadow-sm hover:shadow-md transition-all self-end md:self-auto disabled:opacity-60"
          >
            <MdSave className="w-5 h-5" />
            <span>{submitLoading ? 'Đang lưu...' : 'Lưu tài khoản'}</span>
          </button>
        </div>

        {/* Main Content */}
        {loading ? (
          <div className="flex justify-center items-center h-64 bg-white rounded-3xl shadow-sm">
            <div className="animate-spin rounded-full h-10 w-10 border-4 border-primary border-t-transparent"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Left Column: Avatar & Role Info */}
            <div className="lg:col-span-1 space-y-6">
              <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
                <h3 className="font-bold text-lg text-gray-900 mb-5 border-b border-gray-100 pb-3">Hồ sơ nhân viên</h3>
                
                <div className="flex flex-col items-center mb-6">
                  <div className="w-24 h-24 rounded-full bg-slate-50 border border-slate-200 flex items-center justify-center mb-3">
                    <MdPerson className="w-12 h-12 text-slate-300" />
                  </div>
                  <p className="text-xs text-gray-400 text-center">Avatar mặc định<br/>(Sẽ lấy chữ cái đầu và cuối của tên)</p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                      Vai trò (Phân quyền)
                    </label>
                    <select 
                      value={currentAccount.vaiTro}
                      onChange={(e) => setCurrentAccount({ ...currentAccount, vaiTro: e.target.value })}
                      className="w-full bg-gray-50 border border-gray-200 rounded-2xl h-12 px-4 text-sm font-semibold focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/15 transition-all cursor-pointer text-gray-800"
                    >
                      <option value="Admin">Admin (Toàn quyền)</option>
                      <option value="Nhân viên">Nhân viên (Quyền hạn chế)</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Details Form */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
                <h3 className="font-bold text-lg text-gray-900 mb-6 border-b border-gray-100 pb-3">Thông tin chi tiết</h3>
                
                <form className="space-y-5" onSubmit={handleSubmit}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {/* Họ tên */}
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 ml-1">
                        Họ và tên <span className="text-red-500">*</span>
                      </label>
                      <input 
                        type="text" 
                        value={currentAccount.hoTen}
                        onChange={(e) => setCurrentAccount({ ...currentAccount, hoTen: e.target.value })}
                        placeholder="Ví dụ: Nguyễn Văn A"
                        className="w-full bg-white border border-gray-200 rounded-2xl h-12 px-4 text-sm focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/15 transition-all text-gray-800 font-medium"
                        required
                      />
                    </div>

                    {/* Số điện thoại */}
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 ml-1">
                        Số điện thoại
                      </label>
                      <input 
                        type="tel" 
                        value={currentAccount.soDienThoai}
                        onChange={(e) => setCurrentAccount({ ...currentAccount, soDienThoai: e.target.value })}
                        placeholder="Ví dụ: 0987654321"
                        className="w-full bg-white border border-gray-200 rounded-2xl h-12 px-4 text-sm focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/15 transition-all text-gray-800 font-medium"
                      />
                    </div>

                    {/* Ngày sinh */}
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 ml-1">
                        Ngày sinh
                      </label>
                      <input 
                        type="date" 
                        value={currentAccount.ngaySinh}
                        onChange={(e) => setCurrentAccount({ ...currentAccount, ngaySinh: e.target.value })}
                        className="w-full bg-white border border-gray-200 rounded-2xl h-12 px-4 text-sm focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/15 transition-all text-gray-800 font-medium"
                      />
                    </div>

                    {/* Giới tính */}
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 ml-1">
                        Giới tính
                      </label>
                      <select 
                        value={currentAccount.gioiTinh}
                        onChange={(e) => setCurrentAccount({ ...currentAccount, gioiTinh: e.target.value })}
                        className="w-full bg-white border border-gray-200 rounded-2xl h-12 px-4 text-sm font-medium focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/15 transition-all cursor-pointer text-gray-800"
                      >
                        <option value="Nam">Nam</option>
                        <option value="Nữ">Nữ</option>
                        <option value="Khác">Khác</option>
                      </select>
                    </div>

                    {/* Email */}
                    <div className="md:col-span-2">
                      <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 ml-1">
                        Email liên hệ
                      </label>
                      <input 
                        type="email" 
                        value={currentAccount.email}
                        onChange={(e) => setCurrentAccount({ ...currentAccount, email: e.target.value })}
                        placeholder="name@example.com"
                        className="w-full bg-white border border-gray-200 rounded-2xl h-12 px-4 text-sm focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/15 transition-all text-gray-800 font-medium"
                      />
                    </div>

                    {/* Địa chỉ */}
                    <div className="md:col-span-2">
                      <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 ml-1">
                        Địa chỉ
                      </label>
                      <input 
                        type="text" 
                        value={currentAccount.diaChi}
                        onChange={(e) => setCurrentAccount({ ...currentAccount, diaChi: e.target.value })}
                        placeholder="Số nhà, Tên đường, Phường/Xã, Quận/Huyện, Tỉnh/Thành phố"
                        className="w-full bg-white border border-gray-200 rounded-2xl h-12 px-4 text-sm focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/15 transition-all text-gray-800 font-medium"
                      />
                    </div>

                    {/* Username */}
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 ml-1">
                        Tên đăng nhập (Username) <span className="text-red-500">*</span>
                      </label>
                      <input 
                        type="text" 
                        value={currentAccount.tenDangNhap}
                        onChange={(e) => setCurrentAccount({ ...currentAccount, tenDangNhap: e.target.value })}
                        placeholder="Ví dụ: staff_admin"
                        disabled={isEdit}
                        className="w-full bg-white border border-gray-200 rounded-2xl h-12 px-4 text-sm focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/15 transition-all text-gray-800 font-medium disabled:bg-gray-50 disabled:text-gray-400"
                        required
                      />
                      {isEdit && <p className="text-[10px] text-gray-400 mt-1 ml-1">Không thể thay đổi tên đăng nhập sau khi tạo.</p>}
                    </div>

                    {/* Mật khẩu */}
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 ml-1">
                        {isEdit ? 'Đổi mật khẩu mới' : 'Mật khẩu khởi tạo'} {!isEdit && <span className="text-red-500">*</span>}
                      </label>
                      <input 
                        type="password" 
                        value={currentAccount.matKhau}
                        onChange={(e) => setCurrentAccount({ ...currentAccount, matKhau: e.target.value })}
                        placeholder={isEdit ? 'Để trống nếu không đổi mật khẩu' : 'Tối thiểu 6 ký tự'}
                        minLength="6"
                        className="w-full bg-white border border-gray-200 rounded-2xl h-12 px-4 text-sm focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/15 transition-all text-gray-800 font-medium"
                        required={!isEdit}
                      />
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
