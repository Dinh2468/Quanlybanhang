import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { MdSearch, MdFilterList, MdOutlineRemoveRedEye, MdClose, MdCheckCircle, MdPendingActions, MdLocalShipping, MdCancel, MdInventory } from 'react-icons/md';
import toast from 'react-hot-toast';
import API from '../../../services/api';
import AdminLayout from '../../../components/AdminLayout';
import Pagination from '../../../components/Pagination';

export default function QLDonHang() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('Tất cả');
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [stats, setStats] = useState({ totalPending: 0, totalShipping: 0, totalSuccess: 0 });
  const itemsPerPage = 20;

  // Debounce search
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setCurrentPage(1); // Reset page on new search
    }, 500);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  // Reset page when filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [filterStatus]);

  // Fetch all orders
  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: currentPage,
        pageSize: itemsPerPage,
        ...(debouncedSearch && { search: debouncedSearch }),
        ...(filterStatus !== 'Tất cả' && { status: filterStatus })
      });
      const res = await API.get(`/DonHang?${params.toString()}`);
      
      setOrders(res.data.items || []);
      setTotalPages(res.data.totalPages || 1);
      setTotalCount(res.data.totalCount || 0);
      if (res.data.additionalData) {
        setStats(res.data.additionalData);
      }
    } catch (error) {
      console.error('Lỗi khi tải đơn hàng:', error);
      toast.error('Không thể tải danh sách đơn hàng!');
    } finally {
      setLoading(false);
    }
  }, [currentPage, debouncedSearch, filterStatus]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  // Fetch order detail page
  const handleViewDetails = (order) => {
    const id = order.maDH || order.maDonHang || order.id;
    navigate(`/admin/donhang/${id}`);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Intl.DateTimeFormat('vi-VN', {
      day: '2-digit', month: '2-digit', year: 'numeric',
      hour: '2-digit', minute: '2-digit'
    }).format(new Date(dateString));
  };

  const getStatusIcon = (status) => {
    if (!status) return <MdPendingActions className="w-5 h-5 text-amber-500" />;
    const s = status.toLowerCase();
    if (s.includes('chuẩn bị')) return <MdInventory className="w-5 h-5 text-purple-500" />;
    if (s.includes('chờ') || s.includes('xử lý')) return <MdPendingActions className="w-5 h-5 text-amber-500" />;
    if (s.includes('hủy')) return <MdCancel className="w-5 h-5 text-red-500" />;
    if (s.includes('giao')) return <MdLocalShipping className="w-5 h-5 text-blue-500" />;
    return <MdCheckCircle className="w-5 h-5 text-emerald-500" />;
  };

  const getStatusColorClass = (status) => {
    if (!status) return 'text-amber-700 bg-amber-50 border-amber-200';
    const s = status.toLowerCase();
    if (s.includes('chuẩn bị')) return 'text-purple-700 bg-purple-50 border-purple-200';
    if (s.includes('chờ') || s.includes('xử lý')) return 'text-amber-700 bg-amber-50 border-amber-200';
    if (s.includes('hủy')) return 'text-red-700 bg-red-50 border-red-200';
    if (s.includes('giao')) return 'text-blue-700 bg-blue-50 border-blue-200';
    return 'text-emerald-700 bg-emerald-50 border-emerald-200';
  };

  const getInitials = (name) => {
    if (!name) return 'KH';
    const parts = name.trim().split(/\s+/);
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
    return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
  };


  return (
    <AdminLayout requiredRole="Nhân viên">
      <div className="space-y-6">
        
        {/* Page Header */}
        <div>
          <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">Quản lý đơn hàng</h2>
          <p className="text-sm text-gray-500">Theo dõi, xử lý và cập nhật trạng thái các đơn hàng từ khách hàng.</p>
        </div>

        {/* 4 Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Card 1: Tổng số đơn hàng */}
          <div className="bg-white rounded-3xl p-5 border border-gray-100 shadow-sm flex items-center justify-between hover:scale-[1.01] transition-transform duration-300">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center shrink-0 border border-slate-100">
                <svg className="w-6 h-6 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                </svg>
              </div>
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">Tổng đơn hàng</p>
                <h4 className="text-xl font-black text-gray-800">{totalCount}</h4>
              </div>
            </div>
            <span className="bg-emerald-50 text-emerald-600 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-100/60">+12%</span>
          </div>

          {/* Card 2: Chờ xác nhận */}
          <div className="bg-white rounded-3xl p-5 border border-gray-100 shadow-sm flex items-center gap-4 hover:scale-[1.01] transition-transform duration-300">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 flex items-center justify-center shrink-0 border border-amber-100/50">
              <svg className="w-6 h-6 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">Chờ xác nhận</p>
              <h4 className="text-xl font-black text-amber-600">{stats.totalPending}</h4>
            </div>
          </div>

          {/* Card 3: Đang giao */}
          <div className="bg-white rounded-3xl p-5 border border-gray-100 shadow-sm flex items-center gap-4 hover:scale-[1.01] transition-transform duration-300">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center shrink-0 border border-blue-100/50">
              <svg className="w-6 h-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">Đang giao</p>
              <h4 className="text-xl font-black text-blue-600">{stats.totalShipping}</h4>
            </div>
          </div>

          {/* Card 4: Đã hoàn thành */}
          <div className="bg-white rounded-3xl p-5 border border-gray-100 shadow-sm flex items-center gap-4 hover:scale-[1.01] transition-transform duration-300">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center shrink-0 border border-emerald-100/50">
              <svg className="w-6 h-6 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">Đã hoàn thành</p>
              <h4 className="text-xl font-black text-emerald-600">{stats.totalSuccess}</h4>
            </div>
          </div>
        </div>

        {/* White container card for Filters and Table */}
        <div className="bg-white rounded-3xl p-6 shadow-sm space-y-6">
          
          {/* Search & Filter Pill Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            
            <div className="flex flex-wrap items-center gap-3">
              {/* Search Box */}
              <div className="w-full sm:w-72 relative">
                <MdSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 z-10" />
                <input 
                  type="text" 
                  placeholder="Tìm mã ĐH, tên khách, số điện thoại..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-full h-11 pl-11 pr-4 text-sm focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all font-semibold text-gray-700"
                />
              </div>

              {/* Status Select Pill */}
              <select 
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="bg-white border border-gray-250 rounded-full h-11 px-4 text-xs font-bold focus:outline-none focus:border-primary cursor-pointer text-gray-600 shadow-sm hover:bg-slate-50 transition-colors"
              >
                <option value="Tất cả">Trạng thái: Tất cả</option>
                <option value="Chờ xử lý">Chờ xử lý</option>
                <option value="Đang chuẩn bị hàng">Đang chuẩn bị hàng</option>
                <option value="Đang giao">Đang giao</option>
                <option value="Thành công">Thành công</option>
                <option value="Đã hủy">Đã hủy</option>
              </select>
            </div>

            {/* nút xuất báo cáo  */}
            {/* <button className="h-11 px-5 rounded-full bg-white border border-gray-250 text-gray-700 text-xs font-bold hover:bg-slate-50 transition-colors shadow-sm flex items-center gap-2 cursor-pointer">
              <svg className="w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              <span>Xuất báo cáo</span>
            </button> */}
          </div>

          {/* Bảng đơn hàng */}
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-10 w-10 border-4 border-primary border-t-transparent"></div>
            </div>
          ) : orders.length === 0 ? (
            <div className="text-center py-12 text-on-secondary-container">Không tìm thấy đơn hàng nào.</div>
          ) : (
            <div className="overflow-x-auto rounded-2xl">
              <table className="w-full text-sm text-left border-collapse">
                <thead>
                  <tr className="bg-[#1E3A8A] text-white font-bold text-xs uppercase tracking-wider">
                    <th className="p-4 w-28">Mã ĐH</th>
                    <th className="p-4">Khách hàng</th>
                    <th className="p-4">Ngày đặt</th>
                    <th className="p-4">Tổng tiền</th>
                    <th className="p-4">Thanh toán</th>
                    <th className="p-4">Trạng thái</th>
                    <th className="p-4 w-24 text-center">Hành động</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {orders.map((order, index) => {                    
                    return (
                      <tr key={order.maDH} className="hover:bg-slate-50/40 transition-colors">
                        <td className="p-4 font-bold text-primary">#DH-{order.maDH}</td>
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            {/* Initials Avatar */}                            
                            <div>
                              <div className="font-bold text-gray-800">{order.hoTenNguoiNhan || 'Khách hàng'}</div>
                              <div className="text-xs text-slate-400 font-medium">{order.sdtNguoiNhan}</div>
                            </div>
                          </div>
                        </td>
                        <td className="p-4 text-slate-500 font-medium">{formatDate(order.ngayDat)}</td>
                        <td className="p-4 font-extrabold text-gray-800">{formatPrice(order.tongTien)}</td>
                        <td className="p-4">
                          <div className="text-xs font-bold text-gray-700">{order.tenPhuongThucThanhToan || 'COD'}</div>
                          <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full inline-block mt-1 ${order.trangThaiThanhToan?.includes('Chưa') ? 'bg-amber-50 text-amber-600 border border-amber-100/50' : 'bg-emerald-50 text-emerald-600 border border-emerald-100/50'}`}>
                            {order.trangThaiThanhToan || 'Chưa thanh toán'}
                          </span>
                        </td>
                        <td className="p-4">
                          <span className={`px-2.5 py-1.5 rounded-full text-xs font-bold border inline-flex items-center gap-1.5 ${getStatusColorClass(order.trangThai)}`}>
                            <span className="w-1.5 h-1.5 rounded-full bg-current" />
                            <span>{order.trangThai || 'Chờ xử lý'}</span>
                          </span>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center justify-center">
                            <button 
                              onClick={() => handleViewDetails(order)}
                              className="w-8 h-8 rounded-full bg-slate-50 text-slate-500 border border-slate-200 hover:bg-slate-100 flex items-center justify-center transition-colors cursor-pointer"
                              title="Xem chi tiết & Cập nhật"
                            >
                              <MdOutlineRemoveRedEye className="w-4 h-4" />
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
