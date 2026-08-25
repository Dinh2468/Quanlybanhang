import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MdArrowBack, MdLocalShipping } from 'react-icons/md';
import toast from 'react-hot-toast';
import API from '../../../services/api';
import AdminLayout from '../../../components/AdminLayout';

export default function CTDonHang() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [pushingGHN, setPushingGHN] = useState(false);
  const [newStatus, setNewStatus] = useState('');
  const [newPaymentStatus, setNewPaymentStatus] = useState('');
  const [maVanDonGHN, setMaVanDonGHN] = useState('');

  const fetchOrderDetail = async () => {
    setLoading(true);
    try {
      let res;
      try {
        res = await API.get(`/DonHang/admin/chitiet/${id}`);
      } catch (adminErr) {
        res = await API.get(`/DonHang/chitiet/${id}`);
      }
      setOrder(res.data);
      setNewStatus(res.data.trangThai || 'Chờ xử lý');
      setNewPaymentStatus(res.data.trangThaiThanhToan || 'Chưa thanh toán');
      setMaVanDonGHN(res.data.maVanDonGHN || '');
    } catch (error) {
      console.error('Lỗi khi tải chi tiết đơn hàng:', error);
      toast.error('Không thể tải chi tiết đơn hàng!');
    } finally {
      setLoading(false);
    }
  };

  const handlePushToGHN = async () => {
    try {
      setPushingGHN(true);
      const res = await API.post(`/DonHang/push-ghn/${id}`);
      toast.success(res.data.message || 'Đẩy đơn lên GHN thành công!');
      if (res.data.orderCode) {
        setMaVanDonGHN(res.data.orderCode);
        setOrder(prev => ({ ...prev, maVanDonGHN: res.data.orderCode }));
      }
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || 'Lỗi khi đẩy đơn lên GHN');
    } finally {
      setPushingGHN(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchOrderDetail();
    }
  }, [id]);

  const handleUpdateStatus = async () => {
    if (!order) return;
    
    setUpdatingStatus(true);
    const orderId = order.maDH || order.maDonHang || order.id;
    
    try {
      try {
        await API.put(`/DonHang/capnhattrangthai/${orderId}`, { 
          trangThai: newStatus,
          trangThaiThanhToan: newPaymentStatus,
          maVanDonGHN: maVanDonGHN
        });
      } catch (err) {
        try {
          await API.put(`/capnhattrangthai/${orderId}`, { 
            trangThai: newStatus,
            trangThaiThanhToan: newPaymentStatus,
            maVanDonGHN: maVanDonGHN
          });
        } catch (err2) {
          await API.put(`/DonHang/${orderId}`, { 
            ...order,
            trangThai: newStatus,
            trangThaiThanhToan: newPaymentStatus,
            maVanDonGHN: maVanDonGHN
          });
        }
      }
      
      toast.success('Cập nhật trạng thái đơn hàng thành công!');
      fetchOrderDetail();
    } catch (error) {
      console.error('Lỗi khi cập nhật trạng thái đơn hàng:', error);
      toast.error('Lỗi cập nhật trạng thái đơn hàng!');
    } finally {
      setUpdatingStatus(false);
    }
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

  if (loading) {
    return (
      <AdminLayout requiredRole="Nhân viên">
        <div className="flex justify-center items-center h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
        </div>
      </AdminLayout>
    );
  }

  if (!order) {
    return (
      <AdminLayout requiredRole="Nhân viên">
        <div className="text-center py-20">
          <h2 className="text-2xl font-bold text-gray-700">Không tìm thấy đơn hàng</h2>
          <button onClick={() => navigate('/admin/donhang')} className="mt-4 px-6 py-2 bg-primary text-white rounded-full">
            Quay lại danh sách
          </button>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout requiredRole="Nhân viên">
      <div className="space-y-6 max-w-5xl mx-auto pb-10">
        
        {/* Header with Back Button */}
        <div className="flex items-center gap-4 border-b border-gray-200 pb-4">
          <button 
            onClick={() => navigate('/admin/donhang')}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors shadow-sm cursor-pointer"
          >
            <MdArrowBack className="w-5 h-5" />
          </button>
          <div>
            <h2 className="text-2xl font-extrabold text-gray-900">Chi tiết đơn hàng #DH-{order.maDH}</h2>
            <p className="text-sm text-gray-500 mt-1">Ngày đặt: {formatDate(order.ngayDat)}</p>
          </div>
        </div>

        {/* 2-Column Info Block */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Recipient Details */}
          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-3">
            <h4 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4 border-b border-gray-100 pb-2">Thông tin người nhận</h4>
            <p className="text-base font-bold text-gray-800">Họ tên: <span className="font-semibold text-gray-600 ml-2">{order.hoTenNguoiNhan}</span></p>
            <p className="text-base font-bold text-gray-800">Điện thoại: <span className="font-semibold text-gray-600 ml-2">{order.sdtNguoiNhan}</span></p>
            <p className="text-base font-bold text-gray-800">Địa chỉ: <span className="font-semibold text-gray-600 ml-2">{order.diaChiGiaoHang}</span></p>
            {order.ghiChu && <p className="text-base font-bold text-red-500 mt-4">Ghi chú: <span className="font-semibold ml-2">{order.ghiChu}</span></p>}
          </div>

          {/* Payment Details */}
          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-3">
            <h4 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4 border-b border-gray-100 pb-2">Thông tin thanh toán</h4>
            <p className="text-base font-bold text-gray-800">Phương thức: <span className="font-semibold text-gray-600 ml-2">{order.tenPhuongThucThanhToan || 'COD'}</span></p>
            <p className="text-base font-bold text-gray-800">Trạng thái TT: <span className={`font-bold ml-2 ${order.trangThaiThanhToan?.includes('Chưa') ? 'text-amber-600' : 'text-emerald-600'}`}>{order.trangThaiThanhToan || 'Chưa thanh toán'}</span></p>
            <p className="text-base font-bold text-gray-800 mt-4">Tổng tiền thanh toán: <span className="text-primary font-extrabold text-xl ml-2">{formatPrice(order.tongTien)}</span></p>
          </div>
        </div>

        {/* Status Update Control */}
        {order.trangThai === 'Đã hủy' || order.trangThai === 'Thành công' ? (
          <div className="bg-gray-50 border border-gray-200 p-6 rounded-3xl text-center shadow-sm">
            <p className="text-gray-500 font-bold">Đơn hàng ở trạng thái <span className={order.trangThai === 'Thành công' ? 'text-emerald-600' : 'text-red-500'}>{order.trangThai}</span> nên không thể tiếp tục chỉnh sửa.</p>
          </div>
        ) : (
        <div className="bg-blue-50 border border-blue-100 p-6 rounded-3xl space-y-4 shadow-sm">
          <h4 className="text-sm font-bold text-blue-800 uppercase tracking-wider">Cập nhật đơn hàng (Quyền Admin / Nhân viên)</h4>
          <div className="flex flex-col md:flex-row items-end gap-4">
            
            <div className="flex-1 w-full">
              <label className="block text-xs font-bold text-blue-700 uppercase tracking-wider mb-2">Trạng thái vận chuyển</label>
              <select 
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value)}
                className="w-full bg-white border border-blue-200 rounded-xl h-12 px-4 text-sm font-semibold focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 cursor-pointer shadow-sm text-gray-700"
              >
                <option value="Chờ xử lý">Chờ xử lý</option>
                <option value="Đang chuẩn bị hàng">Đang chuẩn bị hàng</option>
                <option value="Đang giao">Đang giao</option>
                <option value="Thành công">Thành công</option>
                <option value="Đã hủy">Đã hủy</option>
              </select>
            </div>

            {newStatus === 'Đang giao' && (
              <div className="flex-1 w-full">
                <label className="block text-xs font-bold text-blue-700 uppercase tracking-wider mb-2">Mã Vận Đơn GHN</label>
                <input 
                  type="text"
                  value={maVanDonGHN}
                  onChange={(e) => setMaVanDonGHN(e.target.value)}
                  placeholder="Nhập mã vận đơn..."
                  className="w-full bg-white border border-blue-200 rounded-xl h-12 px-4 text-sm font-semibold focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 shadow-sm text-gray-700"
                />
              </div>
            )}

            <div className="flex-1 w-full">
              <label className="block text-xs font-bold text-blue-700 uppercase tracking-wider mb-2">Trạng thái thanh toán</label>
              <select 
                value={newPaymentStatus}
                onChange={(e) => setNewPaymentStatus(e.target.value)}
                className="w-full bg-white border border-blue-200 rounded-xl h-12 px-4 text-sm font-semibold focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 cursor-pointer shadow-sm text-gray-700"
              >
                <option value="Chưa thanh toán">Chưa thanh toán</option>
                <option value="Đã thanh toán">Đã thanh toán</option>
              </select>
            </div>

            <button 
              onClick={handleUpdateStatus}
              disabled={updatingStatus}
              className="w-full md:w-auto h-12 px-8 bg-blue-600 text-white text-sm font-bold rounded-xl hover:bg-blue-700 transition-all disabled:opacity-60 cursor-pointer shadow-md"
            >
              {updatingStatus ? 'Đang cập nhật...' : 'Lưu cập nhật'}
            </button>
            
            {!order.maVanDonGHN && newStatus === 'Đang giao' && (
              <button 
                onClick={handlePushToGHN}
                disabled={pushingGHN}
                className="w-full md:w-auto h-12 px-8 bg-orange-600 text-white text-sm font-bold rounded-xl hover:bg-orange-700 transition-all disabled:opacity-60 cursor-pointer shadow-md flex items-center gap-2 justify-center"
              >
                <MdLocalShipping className="w-5 h-5" />
                {pushingGHN ? 'Đang đẩy đơn...' : 'Đẩy đơn lên GHN'}
              </button>
            )}
          </div>
        </div>
        )}

        {/* Ordered Items List */}
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
          <h4 className="text-lg font-extrabold text-gray-900 mb-6 border-b border-gray-100 pb-4">Danh sách sản phẩm mua</h4>
          <div className="space-y-4">
            {(order.chiTietDonHangs || order.danhSachSanPham || []).map((item, index) => (
              <div key={index} className="flex flex-col sm:flex-row gap-4 items-center bg-gray-50 border border-gray-100 p-4 rounded-2xl hover:border-primary/30 transition-colors shadow-sm">
                <div className="w-20 h-20 bg-white rounded-xl overflow-hidden shrink-0 border border-gray-200 flex items-center justify-center p-1">
                  <img 
                    src={item.hinhAnh ? (item.hinhAnh.startsWith('http') ? item.hinhAnh : `https://localhost:7224${item.hinhAnh}`) : 'https://via.placeholder.com/150'} 
                    alt={item.tenSP} 
                    className="w-full h-full object-contain rounded-lg"
                    onError={(e) => { e.target.src = 'https://via.placeholder.com/150?text=No+Image'; }}
                  />
                </div>
                <div className="flex-1 min-w-0 w-full text-center sm:text-left">
                  <h5 className="text-base font-bold text-gray-800 line-clamp-2">{item.tenSP}</h5>
                  <p className="text-sm text-gray-500 mt-1 font-medium">Đơn giá: {formatPrice(item.donGia)}</p>
                </div>
                <div className="text-center sm:text-right w-full sm:w-auto mt-2 sm:mt-0">
                  <div className="text-sm font-extrabold text-gray-500 bg-gray-200 inline-block px-3 py-1 rounded-full">SL: {item.soLuong}</div>
                  <div className="text-lg font-black text-primary mt-2">{formatPrice(item.thanhTien || item.donGia * item.soLuong)}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </AdminLayout>
  );
}
