import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import API from '../../../services/api';
import { toast } from 'react-hot-toast';
import { MdArrowBack, MdEmail, MdPhone, MdLocationOn, MdStar, MdShoppingBag, MdClose } from 'react-icons/md';
import AdminLayout from '../../../components/AdminLayout';

export default function ChiTietKhachHang() {
  const { id } = useParams();
  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedOrderDetails, setSelectedOrderDetails] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchCustomerDetails();
  }, [id]);

  const fetchCustomerDetails = async () => {
    try {
      const res = await API.get(`/KhachHang/admin/chitiet/${id}`);
      setCustomer(res.data);
    } catch (error) {
      console.error(error);
      toast.error('Lỗi khi tải thông tin khách hàng');
    } finally {
      setLoading(false);
    }
  };

  const handleViewOrderDetails = async (orderId) => {
    try {
      const res = await API.get(`/DonHang/admin/chitiet/${orderId}`);
      setSelectedOrderDetails(res.data);
      setIsModalOpen(true);
    } catch (error) {
      console.error(error);
      toast.error('Không thể tải chi tiết đơn hàng');
    }
  };

  const getTierColor = (tier) => {
    switch (tier) {
      case 'Đồng': return 'bg-amber-700/20 text-amber-700';
      case 'Bạc': return 'bg-slate-400/20 text-slate-600';
      case 'Vàng': return 'bg-yellow-400/20 text-yellow-600';
      case 'Kim Cương': return 'bg-cyan-400/20 text-cyan-600';
      default: return 'bg-slate-100 text-slate-500';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Chờ xử lý': return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'Đang giao': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'Hoàn thành': 
      case 'Thành công': return 'bg-green-100 text-green-700 border-green-200';
      case 'Đã hủy': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  if (loading) return (
    <AdminLayout>
      <div className="p-8 text-center">Đang tải...</div>
    </AdminLayout>
  );
  if (!customer) return (
    <AdminLayout>
      <div className="p-8 text-center text-red-500">Không tìm thấy khách hàng</div>
    </AdminLayout>
  );

  return (
    <AdminLayout>
      <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link 
          to="/admin/khachhang"
          className="p-2 hover:bg-slate-200 rounded-full transition-colors"
        >
          <MdArrowBack className="w-6 h-6 text-slate-600" />
        </Link>
        <h2 className="text-2xl font-bold text-slate-800">Chi tiết khách hàng</h2>
      </div>

      {/* Profile Card */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 flex flex-col md:flex-row gap-8 items-start">
        <div className="flex-shrink-0">
          <img 
            src={customer.avatar 
              ? (customer.avatar.startsWith('http') ? customer.avatar : `https://localhost:7224${customer.avatar}`) 
              : `https://ui-avatars.com/api/?name=${encodeURIComponent(customer.hoTen)}&background=EFF6FF&color=2563EB&size=128`}
            alt={customer.hoTen}
            className="w-32 h-32 rounded-full object-cover border-4 border-slate-100 shadow-sm"
          />
        </div>
        
        <div className="flex-1 space-y-4">
          <div>
            <h3 className="text-2xl font-bold text-slate-900">{customer.hoTen}</h3>
            <div className="flex items-center gap-2 mt-2">
              <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getTierColor(customer.tenHangThanhVien)}`}>
                {customer.tenHangThanhVien || 'Thành viên mới'}
              </span>
              <span className="flex items-center gap-1 text-sm font-semibold text-amber-500 bg-amber-50 px-3 py-1 rounded-full">
                <MdStar className="w-4 h-4" />
                {customer.diemTichLuy} điểm
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-slate-100">
            <div className="flex items-center gap-3 text-slate-600">
              <div className="p-2 bg-slate-50 rounded-lg text-slate-400"><MdEmail className="w-5 h-5" /></div>
              <div>
                <p className="text-xs font-semibold text-slate-400">Email</p>
                <p className="font-medium text-slate-700">{customer.email || 'Chưa cập nhật'}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 text-slate-600">
              <div className="p-2 bg-slate-50 rounded-lg text-slate-400"><MdPhone className="w-5 h-5" /></div>
              <div>
                <p className="text-xs font-semibold text-slate-400">Số điện thoại</p>
                <p className="font-medium text-slate-700">{customer.sdt || 'Chưa cập nhật'}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 text-slate-600 md:col-span-2">
              <div className="p-2 bg-slate-50 rounded-lg text-slate-400"><MdLocationOn className="w-5 h-5" /></div>
              <div>
                <p className="text-xs font-semibold text-slate-400">Địa chỉ giao hàng mặc định</p>
                <p className="font-medium text-slate-700">{customer.diaChi || 'Chưa cập nhật'}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Order History */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-6 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <MdShoppingBag className="w-6 h-6 text-primary" />
            Lịch sử đơn hàng ({customer.lichSuDonHangs.length})
          </h3>
          <div className="text-sm font-semibold text-slate-600">
            Tổng chi tiêu: <span className="text-primary text-lg ml-1">
              {customer.lichSuDonHangs
                .filter(o =>  o.trangThai === 'Thành công')
                .reduce((sum, o) => sum + (o.tongTien || 0), 0)
                .toLocaleString()}đ
            </span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white text-sm text-slate-500 font-semibold border-b border-slate-200">
                <th className="p-4 whitespace-nowrap">Mã ĐH</th>
                <th className="p-4 whitespace-nowrap">Ngày đặt</th>
                <th className="p-4 whitespace-nowrap">Tổng tiền</th>
                <th className="p-4 whitespace-nowrap">Trạng thái</th>
                <th className="p-4 whitespace-nowrap">Thanh toán</th>
                <th className="p-4 whitespace-nowrap text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {customer.lichSuDonHangs.length === 0 ? (
                <tr>
                  <td colSpan="6" className="p-8 text-center text-slate-500">Khách hàng chưa có đơn hàng nào.</td>
                </tr>
              ) : (
                customer.lichSuDonHangs.map((order) => (
                  <tr key={order.maDH} className="hover:bg-slate-50/50 transition-colors">
                    <td className="p-4 font-bold text-primary">#DH-{order.maDH}</td>
                    <td className="p-4 text-slate-600">
                      {new Date(order.ngayDat).toLocaleDateString('vi-VN')}
                    </td>
                    <td className="p-4 font-bold text-slate-700 whitespace-nowrap">
                      {order.tongTien?.toLocaleString()} đ
                    </td>
                    <td className="p-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusColor(order.trangThai)}`}>
                        {order.trangThai}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded-md text-xs font-semibold ${
                        order.trangThaiThanhToan?.includes('Đã') 
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-amber-100 text-amber-700'
                      }`}>
                        {order.trangThaiThanhToan}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <button 
                        onClick={() => handleViewOrderDetails(order.maDH)}
                        className="text-sm font-semibold text-primary hover:text-blue-700 hover:underline cursor-pointer"
                      >
                        Chi tiết
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>

    {/* Order Details Modal */}
    {isModalOpen && selectedOrderDetails && (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
        <div className="bg-white rounded-2xl shadow-xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col animate-in fade-in zoom-in duration-200">
          <div className="flex items-center justify-between p-6 border-b border-slate-100 bg-slate-50">
            <div>
              <h3 className="text-xl font-bold text-slate-800">
                Chi tiết đơn hàng #{selectedOrderDetails.maDH}
              </h3>
              <p className="text-sm text-slate-500 mt-1">
                Đặt lúc: {new Date(selectedOrderDetails.ngayDat).toLocaleString('vi-VN')}
              </p>
            </div>
            <button 
              onClick={() => setIsModalOpen(false)}
              className="p-2 hover:bg-slate-200 rounded-full transition-colors"
            >
              <MdClose className="w-6 h-6 text-slate-500" />
            </button>
          </div>
          
          <div className="p-6 overflow-y-auto flex-1">
            <div className="grid grid-cols-2 gap-6 mb-8">
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                <h4 className="font-semibold text-slate-700 mb-3 flex items-center gap-2">
                  <MdLocationOn className="text-primary" /> Thông tin giao hàng
                </h4>
                <div className="space-y-2 text-sm text-slate-600">
                  <p><span className="font-medium text-slate-500">Người nhận:</span> {selectedOrderDetails.hoTenNguoiNhan}</p>
                  <p><span className="font-medium text-slate-500">SĐT:</span> {selectedOrderDetails.sdtNguoiNhan}</p>
                  <p><span className="font-medium text-slate-500">Địa chỉ:</span> {selectedOrderDetails.diaChiGiaoHang}</p>
                </div>
              </div>
              
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                <h4 className="font-semibold text-slate-700 mb-3 flex items-center gap-2">
                  <MdShoppingBag className="text-primary" /> Thông tin thanh toán
                </h4>
                <div className="space-y-2 text-sm text-slate-600">
                  <p><span className="font-medium text-slate-500">Phương thức:</span> {selectedOrderDetails.tenPhuongThucThanhToan || 'N/A'}</p>
                  <p><span className="font-medium text-slate-500">Trạng thái TT:</span> {selectedOrderDetails.trangThaiThanhToan}</p>
                  <p><span className="font-medium text-slate-500">Trạng thái ĐH:</span> {selectedOrderDetails.trangThai}</p>
                </div>
              </div>
            </div>

            <h4 className="font-semibold text-slate-800 mb-4">Danh sách sản phẩm</h4>
            <div className="border border-slate-200 rounded-xl overflow-hidden">
              <table className="w-full text-sm text-left">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold">
                  <tr>
                    <th className="p-4">Sản phẩm</th>
                    <th className="p-4 text-center">Số lượng</th>
                    <th className="p-4 text-right">Đơn giá</th>
                    <th className="p-4 text-right">Thành tiền</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {(selectedOrderDetails.chiTietDonHangs || selectedOrderDetails.danhSachSanPham || []).map((item, index) => (
                    <tr key={index} className="hover:bg-slate-50">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <img 
                            src={item.hinhAnh || `https://ui-avatars.com/api/?name=${encodeURIComponent(item.tenSP)}&background=random`} 
                            alt={item.tenSP}
                            className="w-12 h-12 rounded-lg object-cover border border-slate-200"
                          />
                          <span className="font-medium text-slate-700 line-clamp-2">{item.tenSP}</span>
                        </div>
                      </td>
                      <td className="p-4 text-center font-medium">{item.soLuong}</td>
                      <td className="p-4 text-right text-slate-600">
                        {(item.donGia)?.toLocaleString('vi-VN')} đ
                      </td>
                      <td className="p-4 text-right font-bold text-primary">
                        {(item.soLuong * (item.donGia || 0))?.toLocaleString('vi-VN')} đ
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            <div className="mt-6 flex justify-end">
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 w-64 text-right">
                <p className="text-slate-500 text-sm mb-1">Tổng cộng</p>
                <p className="text-2xl font-bold text-primary">{selectedOrderDetails.tongTien?.toLocaleString('vi-VN')} đ</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    )}

    </AdminLayout>
  );
}
