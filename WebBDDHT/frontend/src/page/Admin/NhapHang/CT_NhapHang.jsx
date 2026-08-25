import React, { useState, useEffect } from 'react';
import { MdArrowBack, MdReceiptLong, MdBusiness, MdPerson, MdCheckCircle, MdCancel, MdEdit, MdDelete } from 'react-icons/md';
import { useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import API from '../../../services/api';
import AdminLayout from '../../../components/AdminLayout';

export default function CTNhapHang() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [receipt, setReceipt] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  // Check admin role
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const userRole = user.vaiTro || user.role || 'Nhân viên';
  const roleLower = userRole.toLowerCase();
  const isAdmin = roleLower.includes('admin') || roleLower.includes('quản trị') || roleLower.includes('quan tri');

  const fetchReceiptDetail = async () => {
    try {
      setLoading(true);
      const res = await API.get(`/NhapHang/${id}`);
      setReceipt(res.data);
    } catch (err) {
      console.error('Lỗi khi tải chi tiết phiếu nhập:', err);
      toast.error('Không thể tải dữ liệu phiếu nhập');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReceiptDetail();
  }, [id]);

  const handleUpdateStatus = async (newStatus) => {
    if (!window.confirm(`Bạn có chắc chắn muốn chuyển trạng thái phiếu sang "${newStatus}" không?`)) {
      return;
    }

    try {
      setUpdating(true);
      const res = await API.put(`/NhapHang/capnhattrangthai/${id}`, { trangThai: newStatus });
      toast.success(res.data.message || 'Cập nhật trạng thái thành công');
      fetchReceiptDetail(); // Reload data
    } catch (error) {
      toast.error('Lỗi khi cập nhật trạng thái: ' + (error.response?.data?.message || error.message));
    } finally {
      setUpdating(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa hoàn toàn phiếu nhập này không? Hành động này không thể hoàn tác!')) {
      return;
    }

    try {
      setUpdating(true);
      await API.delete(`/NhapHang/${id}`);
      toast.success('Xóa phiếu nhập thành công');
      navigate('/admin/nhaphang');
    } catch (error) {
      toast.error('Lỗi khi xóa phiếu: ' + (error.response?.data?.message || error.message));
    } finally {
      setUpdating(false);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  if (loading) {
    return (
      <AdminLayout requiredRole="Nhân viên">
        <div className="flex justify-center items-center h-full min-h-[400px]">
          <div className="animate-spin rounded-full h-10 w-10 border-4 border-primary border-t-transparent"></div>
        </div>
      </AdminLayout>
    );
  }

  if (!receipt) {
    return (
      <AdminLayout requiredRole="Nhân viên">
        <div className="text-center py-20">
          <p className="text-on-secondary-container text-lg">Không tìm thấy thông tin phiếu nhập.</p>
          <button onClick={() => navigate('/admin/nhaphang')} className="mt-4 text-primary hover:underline font-bold">Quay lại danh sách</button>
        </div>
      </AdminLayout>
    );
  }

  const items = receipt.danhSachSanPham || receipt.chiTietNhapHangs || receipt.chiTiet || receipt.chiTietPhieuNhaps || [];

  return (
    <AdminLayout requiredRole="Nhân viên">
      <div className="space-y-6">
        
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => navigate('/admin/nhaphang')}
              className="w-10 h-10 rounded-full bg-surface border border-outline-variant/30 flex items-center justify-center text-on-surface hover:bg-slate-50 transition-colors cursor-pointer shrink-0"
            >
              <MdArrowBack className="w-5 h-5" />
            </button>
            <div>
              <h2 className="text-3xl font-extrabold text-on-background tracking-tight">Chi tiết Phiếu nhập #{receipt.maNH || receipt.maPN || receipt.id}</h2>
              <div className="flex items-center gap-2 mt-1">
                <p className="text-sm text-on-secondary-container">Ngày lập: {receipt.ngayNhap ? receipt.ngayNhap.split('T')[0] : ''}</p>
                <span className="text-on-secondary-container">•</span>
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                  receipt.loaiPhieu === 'Nhập hàng' ? 'bg-blue-100 text-blue-800 border-blue-200' :
                  receipt.loaiPhieu === 'Điều chỉnh tăng' ? 'bg-green-100 text-green-800 border-green-200' :
                  'bg-red-100 text-red-800 border-red-200'
                }`}>
                  {receipt.loaiPhieu || 'Nhập hàng'}
                </span>
                <span className="text-on-secondary-container">•</span>
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                    receipt.trangThai === 'Chờ Xác Nhận' ? 'bg-amber-100 text-amber-800 border border-amber-200' :
                    receipt.trangThai === 'Hoàn thành' ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' :
                    receipt.trangThai === 'Đã hủy' ? 'bg-rose-100 text-rose-800 border border-rose-200' :
                    'bg-slate-100 text-slate-800 border border-slate-200'
                  }`}>
                    {receipt.trangThai}
                </span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3">
            {receipt.trangThai === 'Chờ Xác Nhận' && (
              <>
                <button
                  onClick={() => navigate(`/admin/nhaphang/edit/${id}`)}
                  disabled={updating}
                  className="flex items-center gap-2 px-5 py-2.5 bg-white border border-blue-200 text-blue-600 hover:bg-blue-50 hover:border-blue-300 text-sm font-bold rounded-full transition-all cursor-pointer disabled:opacity-50"
                >
                  <MdEdit className="w-5 h-5" />
                  Chỉnh sửa
                </button>
                <button
                  onClick={handleDelete}
                  disabled={updating}
                  className="flex items-center gap-2 px-5 py-2.5 bg-white border border-rose-200 text-rose-600 hover:bg-rose-50 hover:border-rose-300 text-sm font-bold rounded-full transition-all cursor-pointer disabled:opacity-50"
                >
                  <MdDelete className="w-5 h-5" />
                  Xóa phiếu
                </button>
                {isAdmin && (
                  <button
                    onClick={() => handleUpdateStatus('Hoàn thành')}
                    disabled={updating}
                    className="flex items-center gap-2 px-6 py-2.5 bg-emerald-600 text-white hover:bg-emerald-700 text-sm font-bold rounded-full shadow-md shadow-emerald-600/20 transition-all cursor-pointer disabled:opacity-50"
                  >
                    <MdCheckCircle className="w-5 h-5" />
                    Duyệt & Nhập kho
                  </button>
                )}
              </>
            )}
          </div>
        </div>

        {/* Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Supplier Info */}
          <div className="bg-surface rounded-3xl p-6 border border-outline-variant/30 shadow-sm flex items-start gap-4">
            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center shrink-0">
              <MdBusiness className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-bold text-on-secondary-container uppercase tracking-wider mb-1">Nhà cung cấp</p>
              <h4 className="text-lg font-bold text-on-background">{receipt.tenNCC || receipt.supplierName}</h4>
            </div>
          </div>

          {/* Staff Info */}
          <div className="bg-surface rounded-3xl p-6 border border-outline-variant/30 shadow-sm flex items-start gap-4">
            <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center shrink-0">
              <MdPerson className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-bold text-on-secondary-container uppercase tracking-wider mb-1">Người lập phiếu</p>
              <h4 className="text-lg font-bold text-on-background">{receipt.tenNhanVien || receipt.tenNguoiNhap || receipt.createdByName}</h4>
            </div>
          </div>
        </div>

        {/* Details Table */}
        <div className="bg-surface rounded-3xl border border-outline-variant/30 shadow-sm overflow-hidden flex flex-col">
          <div className="p-5 border-b border-outline-variant/20 bg-slate-50/50 flex items-center gap-2">
            <MdReceiptLong className="w-5 h-5 text-primary" />
            <h3 className="font-bold text-on-background">Chi tiết mặt hàng nhập kho</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 text-on-secondary-container font-bold border-b border-outline-variant/20">
                  <th className="p-4 w-16 text-center">STT</th>
                  <th className="p-4">Tên sản phẩm</th>
                  <th className="p-4 text-center">Số lượng nhập</th>
                  <th className="p-4 text-right">Đơn giá nhập</th>
                  <th className="p-4 text-right">Thành tiền</th>
                </tr>
              </thead>
              <tbody>
                {items.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="p-8 text-center text-on-secondary-container">Không có chi tiết sản phẩm nào.</td>
                  </tr>
                ) : (
                  items.map((item, idx) => (
                    <tr key={idx} className="border-b border-outline-variant/10 hover:bg-slate-50/50 transition-colors">
                      <td className="p-4 text-center text-on-secondary-container">{idx + 1}</td>
                      <td className="p-4 font-bold text-on-background">{item.tenSP || 'Sản phẩm ' + item.maSP}</td>
                      <td className="p-4 text-center font-bold text-on-background bg-slate-50/30">{item.soLuong}</td>
                      <td className="p-4 text-right text-on-secondary-container">{formatPrice(item.donGia || item.donGiaNhap || 0)}</td>
                      <td className="p-4 text-right font-extrabold text-primary">{formatPrice((item.soLuong || 0) * (item.donGia || item.donGiaNhap || 0))}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          
          {/* Total Footer */}
          <div className="p-6 bg-slate-50 border-t border-outline-variant/20 flex flex-col items-end gap-1">
            <p className="text-sm font-bold text-on-secondary-container uppercase tracking-wider">TỔNG GIÁ TRỊ PHIẾU NHẬP</p>
            <p className="text-3xl font-black text-primary">{formatPrice(receipt.tongTien)}</p>
          </div>
        </div>

      </div>
    </AdminLayout>
  );
}