import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { MdAdd, MdEdit, MdDelete, MdSearch, MdLock, MdLockOpen, MdPerson } from 'react-icons/md';
import toast from 'react-hot-toast';
import API from '../../../services/api';
import AdminLayout from '../../../components/AdminLayout';
import Pagination from '../../../components/Pagination';

export default function QLTaiKhoan() {
  const navigate = useNavigate();
  const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [filterRole, setFilterRole] = useState('Tất cả');

  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 20;

  // Debounce search
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setCurrentPage(1);
    }, 500);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  // Reset page when filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [filterRole]);

  // Fetch accounts
  const fetchAccounts = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: currentPage,
        pageSize: itemsPerPage,
        ...(debouncedSearch && { search: debouncedSearch }),
        ...(filterRole !== 'Tất cả' && { role: filterRole })
      });
      const res = await API.get(`/NhanVien?${params.toString()}`);
      
      setAccounts(res.data.items || []);
      setTotalPages(res.data.totalPages || 1);
    } catch (error) {
      console.error('Lỗi khi tải tài khoản:', error);
      toast.error('Không thể tải danh sách tài khoản!');
    } finally {
      setLoading(false);
    }
  }, [currentPage, debouncedSearch, filterRole]);

  useEffect(() => {
    fetchAccounts();
  }, [fetchAccounts]);

  // lấy ID tài khoản
  const getAccountId = (acc) => {
    return acc.maNV || acc.id;
  };

  // mở trang thêm nhân viên
  const handleOpenAdd = () => {
    navigate('/admin/nhanvien/add');
  };

  // mở trang chỉnh sửa nhân viên
  const handleOpenEdit = (account) => {
    const accId = getAccountId(account);
    navigate(`/admin/nhanvien/edit/${accId}`);
  };

  // Đổi trạng thái tài khoản
  const handleToggleStatus = async (account) => {
    if (account.tenDangNhap === currentUser.tenDangNhap) {
      toast.error('Không thể đổi trạng thái tài khoản của chính mình!');
      return;
    }
    const accId = getAccountId(account);
    const currentStatus = account.trangThai || 'Đang hoạt động';
    const nextStatus = currentStatus === 'Đang hoạt động' ? 'Bị khóa' : 'Đang hoạt động';
    
    if (window.confirm(`Bạn có chắc chắn muốn ${nextStatus === 'Bị khóa' ? 'Khóa' : 'Mở khóa'} tài khoản này?`)) {
      try {
        // Gọi API cập nhật trạng thái
        await API.put(`/NhanVien/${accId}`, {
          ...account,
          trangThai: nextStatus
        });
        toast.success('Cập nhật trạng thái tài khoản thành công!');
        fetchAccounts();
      } catch (error) {
        console.error('Lỗi khi đổi trạng thái tài khoản:', error);
        toast.error('Lỗi khi đổi trạng thái: ' + (error.response?.data?.message || error.message));
      }
    }
  };

  // Xóa tài khoản
  const handleDelete = async (account) => {
    const accId = getAccountId(account);
    if (window.confirm('Bạn có chắc chắn muốn xóa vĩnh viễn tài khoản này không?')) {
      try {
        await API.delete(`/NhanVien/${accId}`);
        toast.success('Xóa tài khoản thành công!');
        fetchAccounts();
      } catch (error) {
        console.error('Lỗi khi xóa tài khoản:', error);
        toast.error('Không thể xóa tài khoản này vì đã có dữ liệu giao dịch liên quan!');
      }
    }
  };
  
  const getInitials = (name) => {
    if (!name) return 'NV';
    const parts = name.trim().split(/\s+/);// /\s+/ là khoảng trắng
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
    return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
  };

  return (
    <AdminLayout requiredRole="Admin">
      <div className="space-y-6">
        
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">Quản lý nhân viên</h2>
            <p className="text-sm text-gray-500">Quản lý tài khoản người dùng và phân quyền hệ thống.</p>
          </div>
          <button 
            onClick={handleOpenAdd}
            className="px-5 py-3 bg-[#0070F3] hover:bg-[#0060df] text-white text-sm font-bold rounded-full flex items-center justify-center gap-2 cursor-pointer shadow-sm hover:shadow-md transition-all self-end md:self-auto"
          >
            <MdAdd className="w-5 h-5" />
            <span>Thêm tài khoản</span>
          </button>
        </div>

        {/* 4 Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Card 1: Tổng số tài khoản nhân sự */}
          <div className="bg-white rounded-3xl p-5 border border-gray-100 shadow-sm flex items-center gap-4 hover:scale-[1.01] transition-transform duration-300">
            <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center shrink-0 border border-slate-100">
              <svg className="w-6 h-6 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">Tổng số nhân sự</p>
              <h4 className="text-xl font-black text-gray-800">{accounts.length}</h4>
            </div>
          </div>

          {/* Card 2: Admin */}
          <div className="bg-white rounded-3xl p-5 border border-gray-100 shadow-sm flex items-center gap-4 hover:scale-[1.01] transition-transform duration-300">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 flex items-center justify-center shrink-0 border border-rose-100/50">
              <svg className="w-6 h-6 text-rose-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">Quản trị viên</p>
              <h4 className="text-xl font-black text-rose-600">{accounts.filter(a => (a.vaiTro || a.role || 'Nhân viên') === 'Admin').length}</h4>
            </div>
          </div>

          {/* Card 3: Nhân viên */}
          <div className="bg-white rounded-3xl p-5 border border-gray-100 shadow-sm flex items-center gap-4 hover:scale-[1.01] transition-transform duration-300">
            <div className="w-12 h-12 rounded-2xl bg-sky-50 flex items-center justify-center shrink-0 border border-sky-100/50">
              <svg className="w-6 h-6 text-sky-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">Nhân viên</p>
              <h4 className="text-xl font-black text-sky-600">{accounts.filter(a => (a.vaiTro || a.role || 'Nhân viên') === 'Nhân viên').length}</h4>
            </div>
          </div>

          {/* Card 4: Đang hoạt động */}
          <div className="bg-white rounded-3xl p-5 border border-gray-100 shadow-sm flex items-center gap-4 hover:scale-[1.01] transition-transform duration-300">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center shrink-0 border border-emerald-100/50">
              <svg className="w-6 h-6 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">Đang hoạt động</p>
              <h4 className="text-xl font-black text-emerald-600">{accounts.filter(a => !(a.trangThai || '').toLowerCase().includes('khóa') && !(a.trangThai || '').toLowerCase().includes('lock')).length}</h4>
            </div>
          </div>
        </div>

        {/* White container card for Filters and Table */}
        <div className="bg-white rounded-3xl p-6 shadow-sm space-y-6">
          
          {/* Actions & Filters Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex flex-col sm:flex-row items-center gap-3 flex-1 w-full">
              {/* Search Box */}
              <div className="w-full sm:w-72 relative">
                <MdSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 z-10" />
                <input 
                  type="text" 
                  placeholder="Tìm tên, username, email, sđt..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-full h-11 pl-11 pr-4 text-sm focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all font-semibold text-gray-700"
                />
              </div>

              {/* Filter role pills dropdown */}
              <select 
                value={filterRole}
                onChange={(e) => setFilterRole(e.target.value)}
                className="bg-white border border-gray-250 rounded-full h-11 px-4 text-xs font-bold focus:outline-none focus:border-primary cursor-pointer text-gray-600 shadow-sm hover:bg-slate-50 transition-colors"
              >
                <option value="Tất cả">Vai trò: Tất cả</option>
                <option value="Admin">Admin</option>
                <option value="Nhân viên">Nhân viên</option>
              </select>
            </div>
          </div>

          {/* Accounts Table */}
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-10 w-10 border-4 border-primary border-t-transparent"></div>
            </div>
          ) : accounts.length === 0 ? (
            <div className="text-center py-16 text-slate-500">
              <MdPerson className="w-16 h-16 mx-auto mb-3 text-slate-300" />
              <p className="font-semibold text-lg">Không tìm thấy tài khoản nhân viên nào.</p>
            </div>
          ) : (
            <div className="overflow-x-auto rounded-2xl">
              <table className="w-full text-sm text-left border-collapse">
                <thead>
                  <tr className="bg-[#1E3A8A] text-white font-bold text-xs uppercase tracking-wider">
                    <th className="p-4 w-20 text-center">Avatar</th>
                    <th className="p-4">Họ và tên</th>
                    <th className="p-4">Username</th>
                    <th className="p-4">Liên hệ</th>
                    <th className="p-4">Vai trò</th>
                    <th className="p-4 text-center">Trạng thái</th>
                    <th className="p-4 w-36 text-center">Hành động</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {accounts.map((acc, index) => {
                    let role = acc.vaiTro || acc.role || 'Nhân viên';
                    if (role === 'NhanVien') role = 'Nhân viên';
                    const isLocked = (acc.trangThai || '').toLowerCase().includes('khóa') || (acc.trangThai || '').toLowerCase().includes('lock');
                    
                    const initials = getInitials(acc.hoTen);
                    const colorSchemes = [
                      { bg: 'bg-[#EFF6FF]', text: 'text-[#2563EB]' }, // Blue
                      // { bg: 'bg-[#F0FDF4]', text: 'text-[#16A34A]' }, // Green
                      // { bg: 'bg-[#FFF7ED]', text: 'text-[#EA580C]' }, // Orange
                      // { bg: 'bg-[#FAF5FF]', text: 'text-[#9333EA]' }, // Purple
                      // { bg: 'bg-[#FDF2F8]', text: 'text-[#DB2777]' }, // Pink
                    ];
                    const scheme = colorSchemes[index % colorSchemes.length];

                    return (
                      <tr key={getAccountId(acc)} className="hover:bg-slate-50/40 transition-colors">
                        <td className="p-3 text-center">
                          <div className="w-10 h-10 rounded-full overflow-hidden border border-gray-150 bg-gray-50 flex items-center justify-center mx-auto shadow-sm">
                            {acc.avatar ? (
                              <img 
                                src={acc.avatar.startsWith('http') ? acc.avatar : `https://localhost:7224${acc.avatar}`} 
                                alt={acc.hoTen} 
                                className="w-full h-full object-cover"
                                onError={(e) => { e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(acc.hoTen || 'U')}&background=EFF6FF&color=2563EB`; }}
                              />
                            ) : (
                              <div className={`w-full h-full ${scheme.bg} ${scheme.text} flex items-center justify-center font-bold text-xs shadow-inner`}>
                                {initials}
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="p-4 font-bold text-gray-800">{acc.hoTen || 'Chưa đặt tên'}</td>
                        <td className="p-4 font-semibold text-slate-500 font-mono text-xs">{acc.tenDangNhap}</td>
                        <td className="p-4">
                          <div className="font-semibold text-gray-700 text-xs">{acc.email || 'Chưa cập nhật email'}</div>
                          <div className="text-slate-400 text-xs mt-0.5">{acc.soDienThoai || 'Chưa cập nhật sđt'}</div>
                        </td>
                        <td className="p-4">
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold inline-block border ${role === 'Admin' ? 'bg-rose-50 text-rose-600 border-rose-100/50' : 'bg-sky-50 text-sky-600 border-sky-100/50'}`}>
                            {role}
                          </span>
                        </td>
                        <td className="p-4 text-center">
                          <span className={`px-2.5 py-1 rounded-full text-xs font-bold border inline-flex items-center gap-1.5 ${isLocked ? 'bg-rose-50 text-rose-600 border-rose-100/50' : 'bg-emerald-50 text-emerald-600 border-emerald-100/50'}`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${isLocked ? 'bg-rose-500' : 'bg-emerald-500'}`} />
                            <span>{isLocked ? 'Đang bị khóa' : 'Hoạt động'}</span>
                          </span>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center justify-center gap-2">
                            <button 
                              onClick={() => handleToggleStatus(acc)}
                              className={`w-8 h-8 rounded-full border flex items-center justify-center transition-colors cursor-pointer ${isLocked ? 'bg-emerald-50 text-emerald-600 border-emerald-100/50 hover:bg-emerald-100' : 'bg-amber-50 text-amber-600 border-amber-100/50 hover:bg-amber-100'}`}
                              title={isLocked ? "Mở khóa tài khoản" : "Khóa tài khoản"}
                            >
                              {isLocked ? <MdLockOpen className="w-4 h-4" /> : <MdLock className="w-4 h-4" />}
                            </button>
                            
                            <button 
                              onClick={() => handleOpenEdit(acc)}
                              className="w-8 h-8 rounded-full bg-slate-50 text-slate-600 border border-slate-200 hover:bg-slate-100 flex items-center justify-center transition-colors cursor-pointer"
                              title="Chỉnh sửa vai trò"
                            >
                              <MdEdit className="w-4 h-4" />
                            </button>
                            
                            <button 
                              onClick={() => handleDelete(acc)}
                              className="w-8 h-8 rounded-full bg-rose-50 text-rose-500 border border-rose-100 hover:bg-rose-100 flex items-center justify-center transition-colors cursor-pointer"
                              title="Xóa tài khoản"
                            >
                              <MdDelete className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination Component */}
          {!loading && totalPages > 1 && (
            <Pagination 
              currentPage={currentPage} 
              totalPages={totalPages} 
              onPageChange={setCurrentPage} 
            />
          )}

        </div>
      </div>
    </AdminLayout>  
  );
}
