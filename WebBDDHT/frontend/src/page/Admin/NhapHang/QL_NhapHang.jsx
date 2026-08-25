import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { MdAdd, MdReceipt, MdOutlineRemoveRedEye, MdSearch } from 'react-icons/md';
import toast from 'react-hot-toast';
import API from '../../../services/api';
import AdminLayout from '../../../components/AdminLayout';
import Pagination from '../../../components/Pagination';

export default function QLNhapHang() {
  const navigate = useNavigate();
  const [receipts, setReceipts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const itemsPerPage = 20;

  // Debounce search
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setCurrentPage(1); 
    }, 500);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  // Fetch receipts with pagination
  const fetchReceiptsData = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: currentPage,
        pageSize: itemsPerPage,
        ...(debouncedSearch && { search: debouncedSearch })
      });
      const receiptRes = await API.get(`/NhapHang?${params.toString()}`);
      
      setReceipts(receiptRes.data.items || []);
      setTotalPages(receiptRes.data.totalPages || 1);
      setTotalCount(receiptRes.data.totalCount || 0);
    } catch (err) {
      console.error('Không thể lấy dữ liệu nhập hàng:', err);
      toast.error('Lỗi khi tải dữ liệu nhập hàng!');
    } finally {
      setLoading(false);
    }
  }, [currentPage]);



  useEffect(() => {
    fetchReceiptsData();
  }, [fetchReceiptsData]);

  // Format currency
  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  // Open detail page
  const handleViewDetail = (receipt) => {
    const pnId = receipt.maNH || receipt.maPN || receipt.id;
    navigate(`/admin/nhaphang/${pnId}`);
  };

  return (
    <AdminLayout requiredRole="Nhân viên">
      <div className="bg-surface rounded-3xl p-6 border border-outline-variant/30 shadow-sm space-y-6">
        
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="flex items-center gap-4 bg-primary-container/20 border border-primary/10 rounded-2xl p-4 flex-1">
            <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center shrink-0">
              <MdReceipt className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-on-background">Phiếu nhập kho hàng hóa</h3>
              <p className="text-2xl font-extrabold text-primary">{totalCount} hóa đơn nhập</p>
            </div>
          </div>
          
          <div className="w-full sm:w-96 relative shrink-0">
            <MdSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 z-10" />
            <input
              type="text"
              placeholder="Tìm tên nhà cung cấp, người lập..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-background border border-outline-variant/30 rounded-full h-12 pl-11 pr-4 text-sm focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/15 transition-all"
            />
          </div>

          <button
            onClick={() => navigate('/admin/nhaphang/add')}
            className="flex items-center justify-center gap-2 bg-primary text-white hover:bg-primary-hover px-5 h-12 rounded-full text-sm font-bold shadow-md shadow-primary/10 transition-all cursor-pointer select-none grow-0 shrink-0"
          >
            <MdAdd className="w-5 h-5" />
            Tạo phiếu nhập mới
          </button>
        </div>

        {/* Receipts Table */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-10 w-10 border-4 border-primary border-t-transparent"></div>
          </div>
        ) : receipts.length === 0 ? (
          <div className="text-center py-12 text-on-secondary-container">Chưa có phiếu nhập kho nào.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left border-collapse rounded-2xl overflow-hidden border border-outline-variant/30">
              <thead>
                <tr className="bg-secondary text-white font-bold">
                  <th className="p-4 w-20 text-center">Mã phiếu</th>
                  <th className="p-4 w-48">Nhà cung cấp</th>
                  <th className="p-4 text-center whitespace-nowrap">Loại phiếu</th>
                  <th className="p-4 text-center">Ngày nhập</th>
                  <th className="p-4">Người lập phiếu</th>
                  <th className="p-4 text-center whitespace-nowrap">Trạng thái</th>
                  <th className="p-4 text-center">Tổng giá trị</th>
                  <th className="p-4 w-20 text-center">Hành động</th>
                </tr>
              </thead>
              <tbody>
                {receipts.map((receipt, index) => (
                  <tr
                    key={receipt.maNH || receipt.maPN || receipt.id || index}
                    className={`border-b border-outline-variant/20 hover:bg-background/40 transition-colors ${index % 2 === 1 ? 'bg-background/20' : ''}`}
                  >
                    <td className="p-4 text-center font-semibold text-on-secondary-container">#PN-{receipt.maNH || receipt.maPN || receipt.id}</td>
                    <td className="p-4 font-bold text-on-background line-clamp-2" title={receipt.tenNCC || receipt.supplierName}>
                      {receipt.tenNCC || receipt.supplierName}
                    </td>
                    <td className="p-4 text-center whitespace-nowrap">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                        (receipt.loaiPhieu || 'Nhập hàng').toLowerCase() === 'nhập hàng' ? 'bg-blue-100 text-blue-700' :
                        (receipt.loaiPhieu || '').toLowerCase().includes('tăng') ? 'bg-green-100 text-green-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {receipt.loaiPhieu || 'Nhập hàng'}
                      </span>
                    </td>
                    <td className="p-4 text-center text-on-secondary-container">{receipt.ngayNhap ? receipt.ngayNhap.split('T')[0].replace(/-/g, '/') : ''}</td>
                    <td className="p-4 text-on-secondary-container">{receipt.tenNhanVien || receipt.tenNguoiNhap || receipt.createdByName}</td>
                    <td className="p-4 text-center whitespace-nowrap">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                        (receipt.trangThai === 'Đã Nhập Hàng' || receipt.trangThai === 'Hoàn thành') ? 'bg-green-100 text-green-700' :
                        (receipt.trangThai === 'Đã Hủy' || receipt.trangThai === 'Từ Chối' || receipt.trangThai === 'Từ chối') ? 'bg-red-100 text-red-700' :
                        'bg-orange-100 text-orange-700'
                      }`}>
                        {receipt.trangThai || 'Chờ Xác Nhận'}
                      </span>
                    </td>
                    <td className="p-4 text-center font-extrabold text-primary">{formatPrice(receipt.tongTien)}</td>
                    <td className="p-4">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => handleViewDetail(receipt)}
                          className="w-8 h-8 rounded-full bg-primary-container text-primary border border-primary/10 hover:bg-primary/15 flex items-center justify-center transition-colors cursor-pointer"
                          title="Xem chi tiết phiếu nhập"
                        >
                          <MdOutlineRemoveRedEye className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
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


    </AdminLayout>
  );
}