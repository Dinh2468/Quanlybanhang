import React, { useState, useEffect, useCallback } from 'react';
import { MdSearch, MdOutlineRemoveRedEye, MdClose, MdPerson, MdLockOutline, MdLockOpen } from 'react-icons/md';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import API from '../../../services/api';
import AdminLayout from '../../../components/AdminLayout';
import Pagination from '../../../components/Pagination';

export default function QLKhachHang() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [filterRank, setFilterRank] = useState('');
  const [ranks, setRanks] = useState([]);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const itemsPerPage = 20;

  // Debounce search 

  // tìm kiếm trong 500ms
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setCurrentPage(1); // tải lại trang khi tìm kiếm
    }, 500);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  // Lấy danh sách khách hàng
  const fetchCustomers = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: currentPage,// số trang
        pageSize: itemsPerPage,// số lượng mỗi trang
        ...(debouncedSearch && { search: debouncedSearch }),
        ...(filterRank && { hangThanhVien: filterRank })
      });
      const res = await API.get(`/KhachHang?${params.toString()}`);
      
      setCustomers(res.data.items || []);
      setTotalPages(res.data.totalPages || 1);
      setTotalCount(res.data.totalCount || 0);
    } catch (error) {
      console.error('Lỗi khi tải danh sách khách hàng:', error);
      toast.error('Không thể tải danh sách khách hàng!');
    } finally {
      setLoading(false);
    }
  }, [currentPage, debouncedSearch, filterRank]);

  useEffect(() => {
    fetchCustomers();
  }, [fetchCustomers]);

  useEffect(() => {
    const fetchRanks = async () => {
      try {
        const res = await API.get('/HangKhachHang');
        setRanks(res.data || []);
      } catch (error) {
        console.error('Lỗi khi tải danh sách hạng:', error);
      }
    };
    fetchRanks();
  }, []);

  const handleToggleLock = async (id) => {
    try {
      const res = await API.put(`/KhachHang/admin/toggle-lock/${id}`);
      toast.success(res.data.message || 'Thay đổi trạng thái thành công');
      fetchCustomers();
    } catch (error) {
      toast.error('Lỗi khi thay đổi trạng thái tài khoản!');
    }
  };

  // Hàm xác định màu sắc badge của hạng thành viên theo yêu cầu của user
  const getRankBadgeClass = (rankName) => {
    if (!rankName) return 'bg-slate-100 text-slate-500 border-slate-200';
    const r = rankName.toLowerCase();
    // Hạng Đồng: màu đồng (amber/copper sienna)
    if (r.includes('đồng') || r.includes('dong')) {
      return 'bg-[#B87333]/15 text-[#8B4513] border-[#B87333]/30 font-bold';
    }
    // Hạng Bạc: màu bạc (silver/gray)
    if (r.includes('bạc') || r.includes('bac')) {
      return 'bg-[#C0C0C0]/20 text-[#6B7280] border-[#C0C0C0]/40 font-bold';
    }
    // Hạng Vàng: màu vàng (gold)
    if (r.includes('vàng') || r.includes('vang')) {
      return 'bg-[#FFD700]/20 text-[#B45309] border-[#FFD700]/40 font-bold';
    }
   
    // Hạng Kim Cương: màu xanh dương
    if (r.includes('kim cương') || r.includes('kim cuong')) {
      return 'bg-[#0ea5e9]/10 text-[#0284c7] border-[#0ea5e9]/20 font-bold';
    }
    return 'bg-primary-container text-primary border-primary/10 font-bold';
  };

  return (
    <AdminLayout requiredRole="Admin,nhanvien">
      <div className="bg-surface rounded-3xl p-6 border border-outline-variant/30 shadow-sm space-y-6">

        {/* Header summary */}
        <div className="flex items-center gap-4 bg-primary-container/20 border border-primary/10 rounded-2xl p-4">
          <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center shrink-0">
            <MdPerson className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-sm font-extrabold text-on-background">Tổng số khách hàng hệ thống</h3>
            <p className="text-2xl font-extrabold text-primary">{totalCount} khách hàng</p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-4">
          <div className="w-full sm:w-96 relative">
            <MdSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 z-10" />
            <input
              type="text"
              placeholder="Tìm tên, username, email, số điện thoại..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-background border border-outline-variant/30 rounded-full h-11 pl-11 pr-4 text-sm focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/15 transition-all"
            />
          </div>
          <div className="w-full sm:w-48">
            <select
              value={filterRank}
              onChange={(e) => {
                setFilterRank(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full bg-background border border-outline-variant/30 rounded-full h-11 px-4 text-sm focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/15 transition-all"
            >
              <option value="">Tất cả hạng</option>
              {ranks.map(rank => (
                <option key={rank.maHang} value={rank.tenHang}>
                  {rank.tenHang}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Bảng danh sách khách hàng */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-10 w-10 border-4 border-primary border-t-transparent"></div>
          </div>
        ) : customers.length === 0 ? (
          <div className="text-center py-16 text-on-secondary-container">
            <MdPerson className="w-16 h-16 mx-auto mb-3 text-outline-variant" />
            <p className="font-semibold">Không tìm thấy khách hàng nào.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left border-collapse rounded-2xl overflow-hidden border border-outline-variant/30">
              <thead>
                <tr className="bg-secondary text-white font-bold">
                  <th className="p-4 min-w-[150px]">Họ và tên</th>
                  <th className="p-4">Username</th>
                  <th className="p-4">Email</th>
                  <th className="p-4">Số điện thoại</th>
                  <th className="p-4 w-28 text-center">Hạng</th>
                  <th className="p-4 w-32 text-center">Trạng thái</th>
                  <th className="p-4 w-32 text-center">Hành động</th>
                </tr>
              </thead>
              <tbody>
                {customers.map((cust, index) => (
                  <tr
                    key={cust.maKH || cust.maTK || index}
                    className={`border-b border-outline-variant/20 hover:bg-background/40 transition-colors ${index % 2 === 1 ? 'bg-background/20' : ''}`}
                  >
                    <td className="p-4 font-bold text-on-background">{cust.hoTen || '—'}</td>
                    <td className="p-4 text-on-secondary-container font-semibold">{cust.tenDangNhap || '—'}</td>
                    <td className="p-4 text-on-secondary-container">{cust.email || '—'}</td>
                    <td className="p-4 text-on-secondary-container">{cust.sdt || '—'}</td>
                    <td className="p-4 text-center">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border inline-block ${getRankBadgeClass(cust.tenHangThanhVien)}`}>
                        {cust.tenHangThanhVien || 'Thành viên mới'}
                      </span>
                    </td>
                    <td className="p-4 text-center">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border inline-block ${cust.trangThai ? 'bg-green-100 text-green-700 border-green-200' : 'bg-red-100 text-red-700 border-red-200'}`}>
                        {cust.trangThai ? 'Hoạt động' : 'Bị khóa'}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex justify-center gap-2">
                        <Link
                          to={`/admin/khachhang/${cust.maKH}`}
                          className="w-8 h-8 rounded-full bg-primary-container text-primary border border-primary/10 hover:bg-primary/15 flex items-center justify-center transition-colors cursor-pointer"
                          title="Xem chi tiết khách hàng"
                        >
                          <MdOutlineRemoveRedEye className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => handleToggleLock(cust.maKH)}
                          className={`w-8 h-8 rounded-full border flex items-center justify-center transition-colors cursor-pointer ${
                            cust.trangThai
                              ? 'bg-red-50 text-red-500 border-red-100 hover:bg-red-100'
                              : 'bg-green-50 text-green-500 border-green-100 hover:bg-green-100'
                          }`}
                          title={cust.trangThai ? "Khóa tài khoản" : "Mở khóa tài khoản"}
                        >
                          {cust.trangThai ? <MdLockOutline className="w-4 h-4" /> : <MdLockOpen className="w-4 h-4" />}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination Component (phân trang) */}
        {!loading && totalPages > 1 && (
          <Pagination 
            currentPage={currentPage} 
            totalPages={totalPages} 
            onPageChange={setCurrentPage} 
          />
        )}
      </div>
    </AdminLayout>
  );
}
