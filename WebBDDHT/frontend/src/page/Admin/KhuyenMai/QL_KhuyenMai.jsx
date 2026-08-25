import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { MdAdd, MdEdit, MdDelete, MdLocalOffer } from 'react-icons/md';
import toast from 'react-hot-toast';
import API from '../../../services/api';
import AdminLayout from '../../../components/AdminLayout';
import Pagination from '../../../components/Pagination';

export default function QLKhuyenMai() {
  const [promotions, setPromotions] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  
  const userStr = localStorage.getItem('user');// lấy thông tin user
  const currentUser = userStr ? JSON.parse(userStr) : null;// parse json user
  const isAdmin = currentUser?.vaiTro === 'Admin';// check quyền admin

  // Pagination state (phân trang)
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const itemsPerPage = 20;

  // Lấy danh sách khuyến mãi với phân trang
  const fetchPromotionsData = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: currentPage,
        pageSize: itemsPerPage
      });
      const promoRes = await API.get(`/KhuyenMai?${params.toString()}`);
      
      setPromotions(promoRes.data.items || []);
      setTotalPages(promoRes.data.totalPages || 1);
      setTotalCount(promoRes.data.totalCount || 0);
    } catch (err) {
      console.error('Không thể tải dữ liệu khuyến mãi:', err);
      toast.error('Lỗi khi tải dữ liệu từ server!');
    } finally {
      setLoading(false);
    }
  }, [currentPage]);

  useEffect(() => {
    fetchPromotionsData();
  }, [fetchPromotionsData]);
  
  // Xóa khuyến mãi
  const handleDelete = async (maKM) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa chương trình khuyến mãi này không?')) {
      try {
        await API.delete(`/KhuyenMai/${maKM}`);
        toast.success('Xóa khuyến mãi thành công!');
        fetchPromotionsData();
      } catch (err) {
        console.error('Lỗi khi xóa khuyến mãi:', err);
        if (err.response?.status === 403) {
          toast.error('Bạn không có quyền thực hiện chức năng này!');
        } else {
          toast.error('Không thể xóa khuyến mãi: ' + (err.response?.data?.message || err.message));
        }
      }
    }
  };
  // Lấy trạng thái khuyến mãi
  const getPromoStatus = (promo) => {
    if (promo.trangThai) return promo.trangThai;
    const today = new Date().toISOString().split('T')[0];
    const end = promo.ngayKetThuc ? promo.ngayKetThuc.split('T')[0] : '';
    const start = promo.ngayBatDau ? promo.ngayBatDau.split('T')[0] : '';
    if (end && end < today) return 'Đã hết hạn';
    if (start && start > today) return 'Chờ hoạt động';
    return 'Đang hoạt động';
  };
  // Lấy màu sắc trạng thái khuyến mãi
  const getStatusColor = (status) => {
    if (status === 'Đang hoạt động') return 'text-emerald-700 bg-emerald-50 border-emerald-250';
    if (status === 'Chờ hoạt động') return 'text-blue-700 bg-blue-50 border-blue-200';
    return 'text-red-700 bg-red-50 border-red-200';
  };
  
  // Lấy giá trị giảm giá
  const getPromoValueString = (promo) => {
    return `${promo.phanTramGiam || promo.giaTriKM || 0}%`;
  };

  return (
    <AdminLayout requiredRole="Nhân viên">
      <div className="bg-surface rounded-3xl p-6 border border-outline-variant/30 shadow-sm space-y-6">
        
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-4 bg-primary-container/20 border border-primary/10 rounded-2xl p-4 flex-1">
            <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center shrink-0">
              <MdLocalOffer className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-on-background">Chương trình khuyến mãi</h3>
              <p className="text-2xl font-extrabold text-primary">{totalCount} đợt ưu đãi</p>
            </div>
          </div>
          
          <button
            onClick={() => navigate('/admin/khuyenmai/add')}
            className="flex items-center justify-center gap-2 bg-primary text-white hover:bg-primary-hover px-5 h-12 rounded-full text-sm font-bold shadow-md shadow-primary/10 transition-all cursor-pointer select-none grow-0 shrink-0"
          >
            <MdAdd className="w-5 h-5" />
            Tạo khuyến mãi mới
          </button>
        </div>

        {/* Bảng danh sách khuyến mãi */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-10 w-10 border-4 border-primary border-t-transparent"></div>
          </div>
        ) : promotions.length === 0 ? (
          <div className="text-center py-12 text-on-secondary-container">Chưa có chương trình khuyến mãi nào.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left border-collapse rounded-2xl overflow-hidden border border-outline-variant/30">
              <thead>
                <tr className="bg-secondary text-white font-bold">
                  <th className="p-4 w-16 text-center">Mã</th>
                  <th className="p-4">Tên chương trình</th>
                  <th className="p-4 text-center">Mức giảm</th>
                  <th className="p-4 text-center">Thời gian áp dụng</th>
                  <th className="p-4 text-center">Sản phẩm áp dụng</th>
                  <th className="p-4 text-center">Trạng thái</th>
                  <th className="p-4 w-28 text-center">Hành động</th>
                </tr>
              </thead>
              <tbody>
                {promotions.map((promo, index) => (
                  <tr
                    key={promo.maKM || promo.id || index}
                    className={`border-b border-outline-variant/20 hover:bg-background/40 transition-colors ${index % 2 === 1 ? 'bg-background/20' : ''}`}
                  >
                    <td className="p-4 text-center font-semibold text-on-secondary-container">{promo.maKM || promo.id}</td>
                    <td className="p-4 font-bold text-on-background">{promo.tenKM}</td>
                    <td className="p-4 text-center">
                      <span className="bg-red-50 text-red-600 border border-red-200 px-2 py-0.5 rounded-full text-xs font-extrabold">
                        {getPromoValueString(promo)}
                      </span>
                    </td>
                    <td className="p-4 text-center text-xs text-on-secondary-container">
                      <div>{promo.ngayBatDau ? promo.ngayBatDau.split('T')[0] : ''}</div>
                      <div className="font-semibold text-gray-400">đến</div>
                      <div>{promo.ngayKetThuc ? promo.ngayKetThuc.split('T')[0] : ''}</div>
                    </td>
                    <td className="p-4 text-center">
                      <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded-full text-xs font-semibold">
                        {!promo.sanPhams || promo.sanPhams.length === 0 ? 'Tất cả sản phẩm' : `${promo.sanPhams.length} sản phẩm`}
                      </span>
                    </td>
                    <td className="p-4 text-center">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border inline-block ${getStatusColor(getPromoStatus(promo))}`}>
                        {getPromoStatus(promo)}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => navigate(`/admin/khuyenmai/edit/${promo.maKM || promo.id}`)}
                          className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 border border-blue-100 hover:bg-blue-100 flex items-center justify-center transition-colors cursor-pointer"
                          title="Sửa"
                        >
                          <MdEdit className="w-4 h-4" />
                        </button>
                        {isAdmin && (
                          <button
                            onClick={() => handleDelete(promo.maKM || promo.id)}
                            className="w-8 h-8 rounded-full bg-red-50 text-red-600 border border-red-100 hover:bg-red-100 flex items-center justify-center transition-colors cursor-pointer"
                            title="Xóa"
                          >
                            <MdDelete className="w-4 h-4" />
                          </button>
                        )}
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