import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../../services/api';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { toast } from 'react-hot-toast';
import { 
  MdReceiptLong, 
  MdOutlineRemoveRedEye,
  MdClose,
  MdCheckCircle,
  MdPendingActions,
  MdLocalShipping,
  MdCancel,
  MdPerson,
  MdHistory,
  MdLocalOffer,
  MdLogout,
  MdLocationOn,
  MdInventory,
  MdStar,
  MdStarBorder,
  MdOutlineAccessTime
} from 'react-icons/md';

export default function LichSuDonHang() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [trackingData, setTrackingData] = useState(null);
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('Tất cả');
  
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('Vui lòng đăng nhập để xem lịch sử đơn hàng!');
      navigate('/dangnhap');
      return;
    }
    
    fetchUserInfo();
    fetchOrders();
  }, [navigate]);

  // Local storage helpers for persistent review tracking (fallback for Backend)
  const getLocalReviewedOrders = () => {
    try {
      return JSON.parse(localStorage.getItem('reviewed_orders') || '{}');
    } catch (e) {
      return {};
    }
  };

  const markOrderAsReviewedLocally = (orderId) => {
    try {
      const localData = getLocalReviewedOrders();
      localData[orderId] = true;
      localStorage.setItem('reviewed_orders', JSON.stringify(localData));
    } catch (e) {
      console.error(e);
    }
  };

  const getLocalReviewedProducts = () => {
    try {
      return JSON.parse(localStorage.getItem('reviewed_products') || '{}');
    } catch (e) {
      return {};
    }
  };

  const markProductAsReviewedLocally = (orderId, maSP) => {
    try {
      const localData = getLocalReviewedProducts();
      if (!localData[orderId]) {
        localData[orderId] = {};
      }
      localData[orderId][maSP] = true;
      localStorage.setItem('reviewed_products', JSON.stringify(localData));
    } catch (e) {
      console.error(e);
    }
  };

  const fetchUserInfo = async () => {
    try {
      const res = await API.get('/TaiKhoan/thongtin');
      setUser(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchOrders = async () => {
    try {
      const res = await API.get('/DonHang/lichsu');
      const localReviewedOrders = getLocalReviewedOrders();
      const mappedOrders = (res.data || []).map(order => {
        const orderId = order.maDH || order.maDonHang;
        return {
          ...order,
          daDanhGia: order.daDanhGia || !!localReviewedOrders[orderId]
        };
      });
      
      // Sắp xếp đơn hàng từ mới nhất đến cũ nhất dựa vào mã đơn hàng (mã càng lớn càng mới)
      mappedOrders.sort((a, b) => {
        const idA = a.maDH || a.maDonHang || 0;
        const idB = b.maDH || b.maDonHang || 0;
        return idB - idA;
      });

      setOrders(mappedOrders);
    } catch (error) {
      console.error(error);
      toast.error('Lỗi lấy lịch sử đơn hàng!');
    } finally {
      setLoading(false);
    }
  };

  const handleRetryPayment = async (orderId) => {
    try {
      const toastId = toast.loading('Đang khởi tạo thanh toán...');
      const res = await API.post(`/DonHang/${orderId}/retry-payment`);
      toast.dismiss(toastId);
      if (res.data && res.data.paymentUrl) {
        window.location.href = res.data.paymentUrl;
      } else {
        toast.error('Không lấy được link thanh toán');
      }
    } catch (err) {
      toast.dismiss();
      console.error(err);
      toast.error(err.response?.data?.message || 'Có lỗi xảy ra khi tạo link thanh toán');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/';
  };

  const handleViewDetails = async (id) => {
    setDetailsLoading(true);
    setSelectedOrder({ id: 'loading' });
    try {
      const res = await API.get(`/DonHang/chitiet/${id}`);
      const localReviewedProducts = getLocalReviewedProducts()[id] || {};
      const updatedOrder = {
        ...res.data,
        danhSachSanPham: res.data.danhSachSanPham?.map(item => ({
          ...item,
          daDanhGia: item.daDanhGia || !!localReviewedProducts[item.maSP]
        }))
      };
      setSelectedOrder(updatedOrder);

      // Fetch tracking if maVanDonGHN exists
      if (res.data.maVanDonGHN) {
        try {
          const trackRes = await API.get(`/DonHang/tracking/${id}`);
          if (trackRes.data && trackRes.data.data) {
            setTrackingData(trackRes.data.data);
          } else {
            setTrackingData(null);
          }
        } catch (err) {
          console.error("Lỗi tải tracking GHN:", err);
          setTrackingData(null);
        }
      } else {
        setTrackingData(null);
      }
    } catch (error) {
      console.error(error);
      toast.error('Lỗi lấy chi tiết đơn hàng!');
      setSelectedOrder(null);
    } finally {
      setDetailsLoading(false);
    }
  };

  const closeModal = () => setSelectedOrder(null);

  // States for confirm receipt and product evaluation
  const [confirmingOrderId, setConfirmingOrderId] = useState(null);


  // Confirm receipt action
  const handleConfirmReceived = async (orderId) => {
    setConfirmingOrderId(orderId);
    try {
      await API.put(`/DonHang/khachhang/nhanhang/${orderId}`);
      toast.success('Xác nhận nhận hàng thành công!');
      fetchOrders();
    } catch (error) {
      console.error(error);
      toast.error('Gặp lỗi khi xác nhận nhận hàng!');
    } finally {
      setConfirmingOrderId(null);
    }
  };

  // Cancel Order Action
  const handleCancelOrder = async (orderId) => {
    if (!window.confirm('Bạn có chắc chắn muốn hủy đơn hàng này không?')) {
      return;
    }
    
    try {
      await API.put(`/DonHang/khachhang/huy/${orderId}`);
      toast.success('Hủy đơn hàng thành công!');
      fetchOrders();
      closeModal();
    } catch (error) {
      console.error(error);
      const errorMsg = error.response?.data?.message || 'Gặp lỗi khi hủy đơn hàng!';
      toast.error(errorMsg);
    }
  };

  // Navigate to review page
  const handleOpenReviewModal = (order) => {
    const id = order.maDH || order.maDonHang || order.id;
    navigate(`/danhgia/${id}`);
  };

  const getStatusColor = (status) => {
    if (!status) return 'text-[#2563EB] bg-[#EFF6FF] border-[#2563EB]/20';
    const s = status.toLowerCase();
    if (s.includes('chuẩn bị')) return 'text-[#7C3AED] bg-[#F5F3FF] border-[#DDD6FE]'; // Purple theme
    if (s.includes('chờ') || s.includes('đang xử lý')) return 'text-[#F59E0B] bg-[#FFFBEB] border-[#FEF3C7]'; // Amber/Warning
    if (s.includes('hủy')) return 'text-[#EF4444] bg-[#FEF2F2] border-[#FEE2E2]'; // Red/Danger
    if (s.includes('thành công')) return 'text-[#10B981] bg-[#ECFDF5] border-[#D1FAE5]'; // Green/Success
    return 'text-[#2563EB] bg-[#EFF6FF] border-[#DBEAFE]'; // Primary blue
  };
  
  const getStatusIcon = (status) => {
    if (!status) return <MdPendingActions />;
    const s = status.toLowerCase();
    if (s.includes('chuẩn bị')) return <MdInventory className="w-4 h-4" />;
    if (s.includes('chờ')) return <MdPendingActions className="w-4 h-4" />;
    if (s.includes('hủy')) return <MdCancel className="w-4 h-4" />;
    if (s.includes('thành công') || s.includes('đã giao')) return <MdCheckCircle className="w-4 h-4" />;
    return <MdLocalShipping className="w-4 h-4" />;
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Intl.DateTimeFormat('vi-VN', {
      day: '2-digit', month: '2-digit', year: 'numeric'
    }).format(new Date(dateString));
  };

  const getAvatarUrl = (avatarStr, name) => {
    if (!avatarStr) return `https://ui-avatars.com/api/?name=${encodeURIComponent(name || 'U')}&background=EFF6FF&color=2563EB&size=150`;
    if (avatarStr.startsWith('http') || avatarStr.startsWith('data:')) return avatarStr;
    if (avatarStr.startsWith('/')) return `https://localhost:7224${avatarStr}`;
    return `https://localhost:7224/images/${avatarStr}`;
  };

  const displayAvatar = getAvatarUrl(user?.avatar, user?.hoTen);

  // Tabs logic
  const tabs = [
    { name: 'Tất cả', count: orders.length },
    { name: 'Chờ xử lý', count: orders.filter(o => o.trangThai.toLowerCase().includes('chờ')).length },
    { name: 'Đang chuẩn bị hàng', count: orders.filter(o => o.trangThai.toLowerCase().includes('chuẩn bị')).length },
    { name: 'Đang giao', count: orders.filter(o => o.trangThai.toLowerCase().includes('đang giao')).length },
    { name: 'Thành công', count: orders.filter(o => o.trangThai.toLowerCase().includes('thành công')).length },
    { name: 'Đã hủy', count: orders.filter(o => o.trangThai.toLowerCase().includes('hủy')).length },
  ];

  const filteredOrders = orders.filter(o => {
    if (activeTab === 'Tất cả') return true;
    if (activeTab === 'Chờ xử lý') return o.trangThai.toLowerCase().includes('chờ');
    if (activeTab === 'Đang chuẩn bị hàng') return o.trangThai.toLowerCase().includes('chuẩn bị');
    if (activeTab === 'Đang giao') return o.trangThai.toLowerCase().includes('đang giao');
    if (activeTab === 'Thành công') return o.trangThai.toLowerCase().includes('thành công');
    if (activeTab === 'Đã hủy') return o.trangThai.toLowerCase().includes('hủy');
    return true;
  });

  return (
    <div className="min-h-screen flex flex-col bg-background font-body-md text-on-background selection:bg-primary-container selection:text-primary">
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
          <h2 className="text-xl font-bold text-center mb-1">{user?.hoTen || 'Đang tải...'}</h2>
          <p className="text-sm text-on-secondary-container text-center mb-8">Hạng: {user?.tenHangThanhVien || 'Thành viên Mới'}</p>
 
          <nav className="w-full flex flex-col gap-2">
            <Link to="/thongtincanhan" className="flex items-center gap-3 w-full px-4 py-3 text-on-secondary-container hover:bg-[#EFF6FF] hover:text-[#2563EB] rounded-xl font-medium transition-colors">
              <MdPerson className="w-5 h-5" />
              Hồ sơ của tôi
            </Link>
            <Link to="/lichsudonhang" className="flex items-center gap-3 w-full px-4 py-3 bg-[#EFF6FF] text-[#2563EB] rounded-xl font-bold transition-colors shadow-sm">
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
        <div className="flex flex-col">
          <h1 className="text-3xl font-bold text-on-background mb-8">Đơn hàng của tôi</h1>
          
          {/* Tabs */}
          <div className="flex items-center overflow-x-auto scrollbar-none border-b border-outline-variant/30 mb-8">
            {tabs.map(tab => (
              <button
                key={tab.name}
                onClick={() => setActiveTab(tab.name)}
                className={`pb-4 px-6 text-sm font-bold whitespace-nowrap transition-colors relative ${
                  activeTab === tab.name ? 'text-primary' : 'text-on-secondary-container hover:text-on-background'
                }`}
              >
                {tab.name} ({tab.count})
                {activeTab === tab.name && (
                  <div className="absolute bottom-0 left-0 w-full h-1 bg-primary rounded-t-full"></div>
                )}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-10 w-10 border-4 border-primary border-t-transparent"></div>
            </div>
          ) : filteredOrders.length === 0 ? (
            <div className="bg-surface rounded-3xl p-12 flex flex-col items-center justify-center border border-outline-variant/30 shadow-sm text-center">
              <div className="w-24 h-24 bg-background rounded-full flex items-center justify-center mb-4">
                <MdReceiptLong className="w-10 h-10 text-on-secondary-container/60" />
              </div>
              <h2 className="text-xl font-bold text-on-background mb-2">Không tìm thấy đơn hàng</h2>
              <p className="text-on-secondary-container">Bạn chưa có đơn hàng nào trong trạng thái này.</p>
            </div>
          ) : (
            <div className="flex flex-col gap-6">
              {filteredOrders.map((order) => (
                <div key={order.maDH} className="bg-surface rounded-3xl border border-outline-variant/30 shadow-sm overflow-hidden flex flex-col hover:border-primary/50 transition-colors">
                  {/* Card Header */}
                  <div className="flex justify-between items-center px-6 py-4 border-b border-outline-variant/30 bg-background">
                    <div className="flex items-center gap-3">
                      <span className="font-bold text-on-background">#DH-{order.maDH}</span>
                      <span className="text-outline-variant hidden sm:inline">|</span>
                      <span className="text-sm font-medium text-on-secondary-container">Ngày đặt: {formatDate(order.ngayDat)}</span>
                    </div>
                    <div className={`px-3 py-1.5 rounded-full text-xs font-bold border flex items-center gap-1.5 ${getStatusColor(order.trangThai)}`}>
                      {getStatusIcon(order.trangThai)}
                      {order.trangThai}
                    </div>
                  </div>
                  
                  {/* Card Body */}
                  <div className="p-6">
                    <div className="flex gap-5 items-center">
                      <div className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center border border-outline-variant/30 shrink-0 overflow-hidden">
                        {order.hinhAnhSanPhamDauTien ? (
                          <img 
                            src={order.hinhAnhSanPhamDauTien.startsWith('http') ? order.hinhAnhSanPhamDauTien : `https://localhost:7224${order.hinhAnhSanPhamDauTien}`} 
                            alt={order.tenSanPhamDauTien} 
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <MdReceiptLong className="w-8 h-8 text-on-secondary-container" />
                        )}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-on-background text-lg line-clamp-1">{order.tenSanPhamDauTien || 'Đơn hàng văn phòng phẩm'}</h3>
                        <p className="text-sm text-on-secondary-container mt-1 line-clamp-1">
                          {order.tongSoLoaiSanPham > 1 
                            ? `Số Lượng: x${order.soLuongSanPhamDauTien} (Và ${order.tongSoLoaiSanPham - 1} sản phẩm khác)` 
                            : `Số lượng: x${order.soLuongSanPhamDauTien || 1}`}
                        </p>
                        <p className="text-sm text-on-secondary-container mt-1">Trạng thái: <span className={`font-semibold ${order.trangThaiThanhToan?.includes('Chưa') ? 'text-[#F59E0B]' : 'text-[#10B981]'}`}>{order.trangThaiThanhToan}</span></p>
                      </div>
                      <div className="text-right hidden sm:block">
                        <p className="font-extrabold text-xl text-on-background">{formatPrice(order.tongTien)}</p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Card Footer */}
                  <div className="px-6 py-4 bg-background border-t border-outline-variant/30 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="text-sm text-on-secondary-container flex items-center gap-2 w-full sm:w-auto">
                      <div className="w-2 h-2 rounded-full bg-primary/60"></div>
                      <span>Vui lòng xem chi tiết để biết thêm thông tin</span>
                    </div>
                    
                    <div className="flex items-center gap-3 w-full sm:w-auto">
                      <div className="sm:hidden font-extrabold text-lg text-on-background mr-auto">{formatPrice(order.tongTien)}</div>
                      
                      {order.trangThai?.toLowerCase() === 'chờ xử lý' && (
                        <div className="flex gap-2">
                          {order.trangThaiThanhToan?.toLowerCase().includes('chưa thanh toán') && 
                           order.tenPhuongThucThanhToan && 
                           (order.tenPhuongThucThanhToan.toLowerCase().includes('vnpay') || order.tenPhuongThucThanhToan.toLowerCase().includes('momo')) && (
                            <button 
                              onClick={() => handleRetryPayment(order.maDH)}
                              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-full transition-colors shadow-sm flex items-center gap-1.5 cursor-pointer"
                            >
                              Thanh toán
                            </button>
                          )}
                          <button 
                            onClick={() => handleCancelOrder(order.maDH)}
                            className="px-5 py-2.5 bg-red-500 hover:bg-red-600 text-white text-sm font-bold rounded-full transition-colors shadow-sm flex items-center gap-1.5 cursor-pointer"
                          >
                            Hủy đơn hàng
                          </button>
                        </div>
                      )}

                      {order.trangThai?.toLowerCase().includes('giao') && !order.trangThai?.toLowerCase().includes('đã') && (
                        <button 
                          onClick={() => handleConfirmReceived(order.maDH)}
                          disabled={confirmingOrderId === order.maDH}
                          className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold rounded-full transition-colors shadow-sm flex items-center gap-1.5 cursor-pointer disabled:opacity-60"
                        >
                          {confirmingOrderId === order.maDH ? 'Đang xử lý...' : 'Nhận hàng'}
                        </button>
                      )}
                      
                      {(order.trangThai?.toLowerCase().includes('thành công') || order.trangThai?.toLowerCase().includes('đã giao')) && !order.daDanhGia && (
                        <button 
                          onClick={() => handleOpenReviewModal(order)}
                          className="px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-white text-sm font-bold rounded-full transition-colors shadow-sm flex items-center gap-1.5 cursor-pointer"
                        >
                          Đánh giá sản phẩm
                        </button>
                      )}
                      
                      <button 
                        onClick={() => handleViewDetails(order.maDH)} 
                        className="px-6 py-2.5 bg-primary hover:bg-[#1D4ED8] text-white text-sm font-bold rounded-full transition-colors shadow-sm shadow-primary/20 flex items-center gap-2 cursor-pointer"
                      >
                        <MdOutlineRemoveRedEye className="w-4 h-4" />
                        Xem chi tiết
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Modal Chi tiết đơn hàng */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0F172A]/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-surface rounded-3xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-slide-up relative">
            
            <div className="flex items-center justify-between p-5 border-b border-outline-variant/30 bg-background">
              <h2 className="text-xl font-bold text-on-background">
                {selectedOrder.id === 'loading' ? 'Đang tải...' : `Chi tiết đơn hàng #DH-${selectedOrder.maDH}`}
              </h2>
              <button 
                onClick={closeModal}
                className="w-8 h-8 flex items-center justify-center rounded-full text-on-secondary-container hover:bg-outline-variant/30 hover:text-on-background transition-colors cursor-pointer"
              >
                <MdClose className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 scrollbar-thin">
              {detailsLoading || selectedOrder.id === 'loading' ? (
                <div className="flex justify-center items-center h-40">
                  <div className="animate-spin rounded-full h-8 w-8 border-4 border-primary border-t-transparent"></div>
                </div>
              ) : (
                <div className="flex flex-col gap-6">
                  {/* Tracking Stepper */}
                  <div className="bg-white p-5 rounded-2xl border border-primary/20 shadow-sm mb-2">
                    <h3 className="text-sm font-bold text-primary mb-6 flex items-center gap-2">
                      <MdLocalShipping className="w-5 h-5" /> 
                      Tiến trình đơn hàng
                    </h3>
                    
                    {/* Stepper Internal */}
                    {(() => {
                      const stt = selectedOrder.trangThai?.toLowerCase() || '';
                      let currentStep = 1;
                      if (stt.includes('chuẩn bị') || stt.includes('đang xử lý')) currentStep = 2;
                      else if (stt.includes('đang giao') || stt.includes('vận chuyển')) currentStep = 3;
                      else if (stt.includes('thành công') || stt.includes('đã giao') || stt.includes('đã nhận')) currentStep = 4;
                      
                      const isCancelled = stt.includes('hủy');

                      if (isCancelled) {
                        return (
                          <div className="flex items-center gap-3 text-red-600 bg-red-50 p-4 rounded-xl border border-red-100">
                            <MdCancel className="w-6 h-6" />
                            <span className="font-bold">Đơn hàng đã bị hủy</span>
                          </div>
                        );
                      }

                      const steps = [
                        { id: 1, title: 'Chờ xử lý', icon: MdPendingActions },
                        { id: 2, title: 'Chuẩn bị hàng', icon: MdInventory },
                        { id: 3, title: 'Đang giao', icon: MdLocalShipping },
                        { id: 4, title: 'Thành công', icon: MdCheckCircle }
                      ];

                      return (
                        <div className="relative flex justify-between items-center w-full mt-2 mb-4 px-2 sm:px-6">
                          {/* Đường line nền */}
                          <div className="absolute top-5 left-10 right-10 h-[2px] bg-gray-200 -z-10 hidden sm:block"></div>
                          {/* Đường line active */}
                          <div 
                            className="absolute top-5 left-10 h-[2px] bg-primary -z-10 transition-all duration-500 hidden sm:block"
                            style={{ width: `calc(${(currentStep - 1) / (steps.length - 1) * 100}% - 40px)` }}
                          ></div>

                          {steps.map((step, index) => {
                            const isCompleted = step.id <= currentStep;
                            const isCurrent = step.id === currentStep;
                            const Icon = step.icon;

                            return (
                              <div key={step.id} className="flex flex-col items-center gap-2 z-10 w-1/4">
                                <div 
                                  className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 shadow-sm ${
                                    isCompleted 
                                      ? 'bg-primary text-white scale-110 shadow-primary/30' 
                                      : 'bg-gray-100 text-gray-400'
                                  } ${isCurrent ? 'ring-4 ring-primary/20' : ''}`}
                                >
                                  <Icon className="w-5 h-5" />
                                </div>
                                <span className={`text-xs sm:text-sm font-bold text-center ${
                                  isCurrent ? 'text-primary' : isCompleted ? 'text-gray-800' : 'text-gray-400'
                                }`}>
                                  {step.title}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      );
                    })()}

                    {/* GHN Info (Mã vận đơn & Dự kiến giao hàng) */}
                    {selectedOrder.maVanDonGHN && (
                      <div className="mt-8 pt-5 border-t border-gray-100 flex flex-col gap-3">
                        <div className="flex items-center gap-2 text-sm text-gray-700">
                           <span className="font-semibold">Mã vận đơn GHN:</span> 
                           <span className="text-primary font-bold bg-primary/10 px-2 py-0.5 rounded">{selectedOrder.maVanDonGHN}</span>
                        </div>
                        
                        {trackingData?.leadtime && (() => {
                            let formattedDate = 'Không xác định';
                            let dateObj;
                            if (typeof trackingData.leadtime === 'number' || !isNaN(Number(trackingData.leadtime))) {
                                dateObj = new Date(Number(trackingData.leadtime) * 1000);
                            } else {
                                dateObj = new Date(trackingData.leadtime);
                            }
                            if (!isNaN(dateObj.getTime())) {
                                formattedDate = dateObj.toLocaleDateString('vi-VN');
                            }
                            return (
                              <div className="text-sm bg-emerald-50 text-emerald-700 px-3 py-2 rounded-lg font-medium border border-emerald-100 flex items-center gap-2 w-fit">
                                <MdOutlineAccessTime className="w-4 h-4" />
                                Dự kiến giao hàng: {formattedDate}
                              </div>
                            );
                        })()}
                      </div>
                    )}
                  </div>

                  {/* Status & Info */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-background p-4 rounded-2xl border border-outline-variant/30">
                      <h3 className="text-xs font-bold text-on-secondary-container uppercase tracking-wider mb-3">Thông tin đơn hàng</h3>
                      <div className="flex flex-col gap-2 text-sm font-medium">
                        <div className="flex justify-between">
                          <span className="text-on-secondary-container">Trạng thái:</span>
                          <span className={`font-bold ${getStatusColor(selectedOrder.trangThai).split(' ')[0]}`}>{selectedOrder.trangThai}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-on-secondary-container">Ngày đặt:</span>
                          <span className="text-on-background">{formatDate(selectedOrder.ngayDat)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-on-secondary-container">Thanh toán:</span>
                          <span className="text-on-background">{selectedOrder.tenPhuongThucThanhToan}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-on-secondary-container">TT Thanh toán:</span>
                          <span className={`font-bold ${selectedOrder.trangThaiThanhToan?.includes('Chưa') ? 'text-[#F59E0B]' : 'text-[#10B981]'}`}>
                            {selectedOrder.trangThaiThanhToan}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-background p-4 rounded-2xl border border-outline-variant/30">
                      <h3 className="text-xs font-bold text-on-secondary-container uppercase tracking-wider mb-3">Thông tin giao hàng</h3>
                      <div className="flex flex-col gap-2 text-sm font-medium">
                        <div className="flex justify-between">
                          <span className="text-on-secondary-container shrink-0">Người nhận:</span>
                          <span className="text-on-background text-right font-bold">{selectedOrder.hoTenNguoiNhan}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-on-secondary-container shrink-0">Điện thoại:</span>
                          <span className="text-on-background text-right font-bold">{selectedOrder.sdtNguoiNhan}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-on-secondary-container shrink-0">Địa chỉ:</span>
                          <span className="text-on-background text-right line-clamp-2" title={selectedOrder.diaChiGiaoHang}>{selectedOrder.diaChiGiaoHang}</span>
                        </div>
                        {selectedOrder.ghiChu && (
                          <div className="flex justify-between mt-1 pt-1 border-t border-outline-variant/20">
                            <span className="text-on-secondary-container shrink-0">Ghi chú:</span>
                            <span className="text-[#EF4444] text-right">{selectedOrder.ghiChu}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Items list */}
                  <div>
                    <h3 className="text-sm font-bold text-on-background mb-3 border-b border-outline-variant/30 pb-2">Danh sách sản phẩm</h3>
                    <div className="flex flex-col gap-3">
                      {selectedOrder.danhSachSanPham?.map((item, index) => (
                        <div key={index} className="flex gap-4 items-center bg-white border border-outline-variant/30 p-3 rounded-2xl hover:border-primary/50 transition-colors">
                          <div className="w-16 h-16 bg-background rounded-xl overflow-hidden shrink-0 border border-outline-variant/30">
                            <img 
                              src={item.hinhAnh ? (item.hinhAnh.startsWith('http') ? item.hinhAnh : `https://localhost:7224${item.hinhAnh}`) : 'https://placehold.co/100'} 
                              alt={item.tenSP} 
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="flex-1 flex flex-col">
                            <h4 className="text-sm font-bold text-on-background line-clamp-1">{item.tenSP}</h4>
                            <div className="text-xs text-on-secondary-container font-medium mt-1">Đơn giá: {formatPrice(item.donGia)}</div>
                            <div className="text-xs font-bold text-primary mt-0.5">Số lượng: x{item.soLuong}</div>
                          </div>
                          <div className="text-right">
                            <div className="text-sm font-bold text-primary">{formatPrice(item.thanhTien)}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>
              )}
            </div>

            {!detailsLoading && selectedOrder && selectedOrder.id !== 'loading' && (
              <div className="p-5 border-t border-outline-variant/30 bg-surface flex flex-col gap-4 rounded-b-3xl">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-on-secondary-container uppercase tracking-wider">Tổng cộng</span>
                  <span className="text-2xl font-extrabold text-primary">{formatPrice(selectedOrder.tongTien)}</span>
                </div>
                
                {/* Action buttons inside detail modal */}
                <div className="flex justify-end gap-3">
                  {selectedOrder.trangThai?.toLowerCase() === 'chờ xử lý' && (
                    <div className="flex gap-2">
                      {selectedOrder.trangThaiThanhToan?.toLowerCase().includes('chưa thanh toán') && 
                       selectedOrder.tenPhuongThucThanhToan && 
                       (selectedOrder.tenPhuongThucThanhToan.toLowerCase().includes('vnpay') || selectedOrder.tenPhuongThucThanhToan.toLowerCase().includes('momo')) && (
                        <button 
                          onClick={() => {
                            handleRetryPayment(selectedOrder.maDH || selectedOrder.id);
                            closeModal();
                          }}
                          className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-full transition-colors shadow-sm flex items-center gap-1.5 cursor-pointer"
                        >
                          Thanh toán
                        </button>
                      )}
                      <button 
                        onClick={() => handleCancelOrder(selectedOrder.maDH || selectedOrder.id)}
                        className="px-6 py-2.5 bg-red-500 hover:bg-red-600 text-white text-sm font-bold rounded-full transition-colors shadow-sm flex items-center gap-1.5 cursor-pointer"
                      >
                        Hủy đơn hàng
                      </button>
                    </div>
                  )}
                  {selectedOrder.trangThai?.toLowerCase().includes('giao') && !selectedOrder.trangThai?.toLowerCase().includes('đã') && (
                    <button 
                      onClick={() => {
                        handleConfirmReceived(selectedOrder.maDH);
                        closeModal();
                      }}
                      disabled={confirmingOrderId === selectedOrder.maDH}
                      className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold rounded-full transition-colors shadow-sm flex items-center gap-1.5 cursor-pointer disabled:opacity-60"
                    >
                      Xác nhận đã nhận hàng
                    </button>
                  )}
                  {(selectedOrder.trangThai?.toLowerCase().includes('thành công') || selectedOrder.trangThai?.toLowerCase().includes('đã giao')) && !selectedOrder.danhSachSanPham?.every(item => item.daDanhGia) && (
                    <button 
                      onClick={() => {
                        const ord = selectedOrder;
                        closeModal();
                        handleOpenReviewModal(ord);
                      }}
                      className="px-6 py-2.5 bg-amber-500 hover:bg-amber-600 text-white text-sm font-bold rounded-full transition-colors shadow-sm flex items-center gap-1.5 cursor-pointer"
                    >
                      Viết đánh giá sản phẩm
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}


      
      <Footer />
    </div>
  );
}
