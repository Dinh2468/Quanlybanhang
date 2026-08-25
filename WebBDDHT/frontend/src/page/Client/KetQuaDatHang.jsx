import React, { useState, useEffect } from 'react';
import { Link, useLocation, Navigate } from 'react-router-dom';
import { 
  MdCheckCircle, 
  MdOutlineSecurity, 
  MdCalendarToday, 
  MdPayments,
  MdCheck,
  MdLocalShipping,
  MdInventory2,
  MdOutlineAccessTime
} from 'react-icons/md';
import API from '../../services/api';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { toast } from 'react-hot-toast';

export default function DatThanhCong() {
  const location = useLocation();
  const [orderDetails, setOrderDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [paymentStatus, setPaymentStatus] = useState('success');
  const [orderId, setOrderId] = useState(null);
  const [expectedDeliveryTime, setExpectedDeliveryTime] = useState(location.state?.expectedDeliveryTime);

  useEffect(() => {
    // Ưu tiên đọc từ URL Param (Trường hợp từ VNPay/MoMo trả về)
    const queryParams = new URLSearchParams(location.search);
    const statusFromUrl = queryParams.get('status');
    const orderIdFromUrl = queryParams.get('orderId');

    // Hoặc lấy từ state (Trường hợp COD)
    const orderDataFromState = location.state;
    const orderIdFromState = orderDataFromState?.donHangData?.maDonHang;

    const finalOrderId = orderIdFromUrl || orderIdFromState;
    
    if (statusFromUrl === 'failed' || statusFromUrl === 'error') {
      setPaymentStatus('failed');
      setOrderId(finalOrderId);
      setLoading(false);
      return;
    }

    if (!finalOrderId) {
      setLoading(false);
      return;
    }

    setOrderId(finalOrderId);

    const fetchOrderDetails = async () => {
      try {
        // Dùng API dành riêng cho khách hàng mà ta vừa tạo
        const res = await API.get(`/DonHang/khachhang/chitiet/${finalOrderId}`);
        setOrderDetails(res.data);
      } catch (error) {
        console.error('Lỗi khi tải chi tiết đơn hàng:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [location]);

  useEffect(() => {
    if (orderDetails && !expectedDeliveryTime) {
      if (orderDetails.maQuanHuyen && orderDetails.maPhuongXa) {
        API.post('/VanChuyen/tinh-phi', {
          toDistrictId: parseInt(orderDetails.maQuanHuyen),
          toWardCode: orderDetails.maPhuongXa,
          weight: 200
        }).then(res => {
          if (res.data.thoiGianDuKienGiao) {
            const date = new Date(res.data.thoiGianDuKienGiao);
            setExpectedDeliveryTime(date.toLocaleDateString('vi-VN'));
          }
        }).catch(err => console.log('Lỗi tính ngày dự kiến giao:', err));
      }
    }
  }, [orderDetails, expectedDeliveryTime]);

  // hàm thanh toán lại đơn hàng
  const handleRetryPayment = async () => {
    if (!orderId) return;
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

  if (!loading && !orderId) {
    return <Navigate to="/" replace />;
  }

  if (loading) {
    return <div className="min-h-screen bg-background flex items-center justify-center">Đang tải thông tin...</div>;
  }

  if (paymentStatus === 'failed') {
    return (
      <div className="min-h-screen flex flex-col bg-background font-body-md selection:bg-primary-container selection:text-primary">
        <Header />
        <div className="flex-1 flex items-center justify-center p-4">
          <div className="bg-white p-8 rounded-3xl shadow-sm max-w-md w-full text-center border border-red-100">
            <div className="w-20 h-20 mx-auto bg-red-50 rounded-full flex items-center justify-center mb-6">
              <MdOutlineSecurity className="w-10 h-10 text-red-500" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Giao dịch thất bại</h2>
            <p className="text-gray-600 mb-8 leading-relaxed">
              Thanh toán cho đơn hàng <strong>#{orderId ? `${orderId}` : ''}</strong> không thành công.
              <br />
              <span className="text-red-500 font-medium">Lưu ý: Vui lòng thanh toán trong vòng 24 giờ tới, nếu không đơn hàng sẽ tự động bị hủy.</span>
            </p>
            <div className="space-y-3">
              <button onClick={handleRetryPayment} className="flex items-center justify-center w-full h-14 bg-primary text-white rounded-xl hover:bg-primary-dark transition-colors font-bold shadow-md hover:shadow-lg">
                <MdPayments className="w-5 h-5 mr-2" />
                Thanh toán lại
              </button>
              <Link to="/" className="flex items-center justify-center w-full h-14 bg-gray-50 text-gray-700 rounded-xl hover:bg-gray-100 transition-colors font-bold border border-gray-200">
                Về trang chủ
              </Link>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!orderDetails) {
    return <div className="min-h-screen bg-background flex items-center justify-center">Không tìm thấy thông tin đơn hàng.</div>;
  }

  // Format date
  const orderDate = orderDetails.ngayDat ? new Date(orderDetails.ngayDat) : new Date();

  const formatDate = (date) => {
    return `Ngày ${date.getDate()} tháng ${date.getMonth() + 1}, ${date.getFullYear()}`;
  };

  // Stepper logic
  const steps = [
    { id: 1, title: 'Đã đặt hàng', icon: MdCheck },
    { id: 2, title: 'Đang xử lý', icon: MdInventory2 },
    { id: 3, title: 'Đang vận chuyển', icon: MdLocalShipping },
    { id: 4, title: 'Đã giao hàng', icon: MdCheckCircle }
  ];

  // Map trangThai to current step
  let currentStep = 1;
  const status = orderDetails.trangThai?.toLowerCase() || '';
  if (status.includes('đang xử lý') || status.includes('chờ xử lý') || status.includes('chuẩn bị')) currentStep = 2;
  else if (status.includes('đang giao') || status.includes('vận chuyển')) currentStep = 3;
  else if (status.includes('thành công') || status.includes('đã giao')) currentStep = 4;

  return (
    <div className="min-h-screen flex flex-col bg-background font-body-md selection:bg-primary-container selection:text-primary">
      <Header />
      <div className="flex-1 w-full max-w-3xl mx-auto px-4 mt-4 mb-16 space-y-6">
        
        {/* Banner Thành Công */}
        <div className="bg-surface rounded-[32px] p-10 text-center shadow-sm relative overflow-hidden border border-outline-variant/30">
          <div className="w-20 h-20 bg-[#ECFDF5] rounded-full flex items-center justify-center mx-auto mb-6 relative z-10">
            <div className="w-12 h-12 bg-[#10B981] rounded-full flex items-center justify-center text-white">
              <MdCheck className="w-8 h-8" />
            </div>
          </div>
          
          <h1 className="text-3xl sm:text-[34px] font-bold text-on-background mb-4 relative z-10 tracking-tight">
            Cảm ơn bạn đã đặt hàng!
          </h1>
          <p className="text-on-secondary-container max-w-lg mx-auto text-[15px] leading-relaxed relative z-10">
            Đồ dùng học tập của bạn đang được đóng gói và sẽ sớm lên đường. 
            Chúng mình đã ghi nhận thông tin đơn hàng của bạn.
          </p>

          {/* Decorative icons behind */}
          <div className="absolute top-10 left-10 text-outline-variant/30 rotate-[-15deg]">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m18 15-6-6-6 6"/></svg>
          </div>
          <div className="absolute bottom-10 right-10 text-outline-variant/30 rotate-[15deg]">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"/></svg>
          </div>
        </div>

        {/* Cột thông tin 2 mảnh */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Box 1: Mã đơn & Phương thức */}
          <div className="bg-surface rounded-3xl p-6 sm:p-8 shadow-sm border border-outline-variant/30">
            <div className="flex items-center justify-between border-b border-outline-variant/30 pb-4 mb-4">
              <span className="text-xs font-bold text-on-secondary-container uppercase tracking-wider">Mã đơn hàng</span>
              <span className="text-primary bg-primary-container px-3 py-1 rounded-full text-xs font-bold">
              {orderDetails.maDH}
              </span>
            </div>
            
            <div className="space-y-5 mt-6">
              <div className="flex gap-4 items-start">
                <MdCalendarToday className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs text-on-secondary-container font-medium mb-1">Ngày đặt</div>
                  <div className="font-bold text-on-background text-[15px]">{formatDate(orderDate)}</div>
                </div>
              </div>
              <div className="flex gap-4 items-start">
                <MdCalendarToday className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs text-on-secondary-container font-medium mb-1">Ngày dự kiến giao hàng</div>
                  <div className="font-bold text-on-background text-[15px]">{expectedDeliveryTime}</div>
                </div>
              </div>
              <div className="flex gap-4 items-start">
                <MdPayments className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs text-on-secondary-container font-medium mb-1">Phương thức thanh toán</div>
                  <div className="font-bold text-on-background text-[15px]">{orderDetails.tenPhuongThucThanhToan}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Box 2: Địa chỉ */}
          <div className="bg-surface rounded-3xl p-6 sm:p-8 shadow-sm border border-outline-variant/30">
            <div className="border-b border-outline-variant/30 pb-4 mb-4">
              <span className="text-xs font-bold text-on-secondary-container uppercase tracking-wider">Địa chỉ giao hàng</span>
            </div>
            <div className="mt-6">
              <div className="font-bold text-on-background text-[17px] mb-2">{orderDetails.hoTenNguoiNhan}</div>
              <div className="text-on-secondary-container text-[15px] mb-2">{orderDetails.sdtNguoiNhan}</div>
              <div className="text-on-secondary-container text-[15px] leading-relaxed">
                {orderDetails.diaChiGiaoHang}
              </div>
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <Link to="/lichsudonhang" className="w-full sm:w-auto min-w-[200px] h-14 bg-primary text-white rounded-full font-bold shadow-md hover:bg-[#1D4ED8] hover:shadow-lg transition-all flex items-center justify-center text-[15px] cursor-pointer">
            Theo dõi đơn hàng
          </Link>
          <Link to="/sanpham" className="w-full sm:w-auto min-w-[200px] h-14 bg-[#F3F4F6] text-on-background border border-outline-variant/30 rounded-full font-bold hover:bg-outline-variant/50 transition-all flex items-center justify-center text-[15px] cursor-pointer">
            Tiếp tục mua sắm
          </Link>
        </div>

      </div>
      <Footer />
    </div>
  );
}
