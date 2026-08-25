import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MdKeyboardArrowLeft, MdKeyboardArrowRight, MdDeleteOutline, MdAdd, MdRemove, MdOutlineSecurity } from 'react-icons/md';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import toast from 'react-hot-toast';
import API from '../../services/api';
import { getCartToken } from '../../utils/cart';

export default function GioHang() {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [phanTramVIP, setPhanTramVIP] = useState(0);

  const fetchCart = async () => {
    try {
      const cartToken = getCartToken();
      const res = await API.get(`/GioHang?cartToken=${cartToken}`);
      const items = res.data.danhSachSanPham || [];
      setPhanTramVIP(res.data.phanTramVIP || 0);
      setCartItems(prevCartItems => {
        const mapped = items.map(item => {
          const prevItem = prevCartItems.find(i => i.id === item.maSP);
          return {
            id: item.maSP,
            name: item.tenSP,
            price: item.donGia,
            quantity: item.soLuong,
            img: item.hinhAnh 
              ? (item.hinhAnh.startsWith('http') ? item.hinhAnh : `https://localhost:7224/images/${item.hinhAnh}`) 
              : `https://via.placeholder.com/300x300?text=${encodeURIComponent(item.tenSP)}`,
            selected: prevItem ? prevItem.selected : true
          };
        });
        return mapped;
      });
    } catch (error) {
      console.error('Lỗi lấy giỏ hàng:', error);
    }
  };

  useEffect(() => {
    fetchCart();
    // Reload giỏ hàng khi có thay đổi
    const handleCartUpdated = () => {
      fetchCart();
    };
    window.addEventListener('cartUpdated', handleCartUpdated);
    return () => window.removeEventListener('cartUpdated', handleCartUpdated);
  }, []);

  const [voucherCode, setVoucherCode] = useState('');
  const shippingDiscount = 0; // Tạm ẩn
  const voucherDiscount = 0; // Tạm ẩn

  const handleSelectAll = (e) => {
    setCartItems(cartItems.map(item => ({ ...item, selected: e.target.checked })));
  };

  const handleSelectItem = (id) => {
    setCartItems(cartItems.map(item => item.id === id ? { ...item, selected: !item.selected } : item));
  };
  
  const handleQuantityChange = async (id, delta) => {
    const item = cartItems.find(i => i.id === id);
    if (!item) return;
    const newQuantity = Math.max(1, item.quantity + delta);
    
    setCartItems(cartItems.map(i => i.id === id ? { ...i, quantity: newQuantity } : i));

    try {
      const cartToken = getCartToken();
      await API.put(`/GioHang/capnhat?cartToken=${cartToken}`, { maSP: id, soLuong: newQuantity });
      window.dispatchEvent(new Event('cartUpdated'));
    } catch (error) {
      // Lấy thông báo lỗi linh động (dynamic) từ Backend trả về
      const errorMsg = error.response?.data?.message || 'Lỗi cập nhật số lượng';
      toast.error(errorMsg);
      fetchCart();
    }
  };

  const handleDelete = async (id) => {
    try {
      const cartToken = getCartToken();
      await API.delete(`/GioHang/xoa/${id}?cartToken=${cartToken}`);
      setCartItems(cartItems.filter(item => item.id !== id));
      window.dispatchEvent(new Event('cartUpdated'));
      toast.success('Đã xóa sản phẩm khỏi giỏ hàng');
    } catch (error) {
      toast.error('Lỗi xóa sản phẩm');
    }
  };

  const handleDeleteAll = async () => {
    try {
      const cartToken = getCartToken();
      for (const item of cartItems) {
        await API.delete(`/GioHang/xoa/${item.id}?cartToken=${cartToken}`);
      }
      setCartItems([]);
      window.dispatchEvent(new Event('cartUpdated'));
      toast.success('Đã làm sạch giỏ hàng');
    } catch (error) {
      toast.error('Lỗi khi xóa giỏ hàng');
    }
  };

  const subtotal = cartItems.filter(i => i.selected).reduce((acc, item) => acc + item.price * item.quantity, 0);
  const vipDiscount = subtotal * (phanTramVIP / 100);
  const total = subtotal - vipDiscount + shippingDiscount + voucherDiscount;

  const handleCheckout = () => {
    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('Vui lòng đăng nhập để tiến hành thanh toán!');
      navigate('/dangnhap');
      return;
    }
    
    const selectedItems = cartItems.filter(i => i.selected);
    if (selectedItems.length === 0) {
      toast.error('Vui lòng chọn sản phẩm để thanh toán!');
      return;
    }

    // const totalQuantity = selectedItems.reduce((acc, item) => acc + item.quantity, 0);
    // if (totalQuantity > 1) {
    //   toast.error('Bạn chỉ được phép mua 1 sản phẩm');
    //   return;
    // }

    const selectedIds = selectedItems.map(i => i.id);
    navigate('/thanhtoan', { state: { selectedIds } });
  };

  return (
    <div className="bg-[#f8f9ff] selection:bg-primary-container selection:text-primary min-h-screen flex flex-col font-body-md text-on-surface">
      {/* Header */}
      <Header />


      {/* Main content */}
      <main className="flex-1 w-full max-w-[1280px] mx-auto px-4 md:px-10 py-10">
        <h1 className="text-[32px] font-display-md font-bold text-[#111827] mb-8">
          Giỏ hàng của bạn <span className="font-normal text-[#2563EB]">({cartItems.length} sản phẩm)</span>
        </h1>
        
        {/* Stepper */}
        <div className="flex items-center gap-4 mb-12 text-sm">
          <div className="flex items-center gap-3 text-[#111827] font-bold">
            <div className="w-7 h-7 rounded-full bg-[#2563EB] text-white flex items-center justify-center text-xs">1</div>
            <span>Giỏ hàng</span>
          </div>
          <div className="w-16 h-[1px] bg-outline-variant/60"></div>
          <div className="flex items-center gap-3 text-on-surface/40 font-medium">
            <div className="w-7 h-7 rounded-full border border-outline-variant/60 flex items-center justify-center text-xs">2</div>
            <span>Thanh toán</span>
          </div>
          <div className="w-16 h-[1px] bg-outline-variant/60"></div>
          <div className="flex items-center gap-3 text-on-surface/40 font-medium">
            <div className="w-7 h-7 rounded-full border border-outline-variant/60 flex items-center justify-center text-xs">3</div>
            <span>Hoàn tất</span>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-10">
          {/* Left Column: Cart Items */}
          <div className="flex-1">
            <div className="bg-white rounded-[24px] shadow-sm border border-outline-variant/20 p-6 sm:p-8 mb-6">
              
              {/* Table Header */}
              <div className="hidden sm:grid grid-cols-[auto_1fr_100px_120px_100px_auto] gap-4 items-center pb-5 border-b border-[#E5E7EB] text-xs font-bold text-[#6B7280] uppercase tracking-wider">
                <input 
                  type="checkbox" 
                  className="w-[18px] h-[18px] rounded text-[#2563EB] border-[#E5E7EB] focus:ring-[#2563EB] cursor-pointer accent-[#2563EB]"
                  checked={cartItems.length > 0 && cartItems.every(i => i.selected)}
                  onChange={handleSelectAll}
                />
                <span className="ml-2">SẢN PHẨM</span>
                <span className="text-center">ĐƠN GIÁ</span>
                <span className="text-center">SỐ LƯỢNG</span>
                <span className="text-right">SỐ TIỀN</span>
                <span className="w-8"></span>
              </div>

              {/* Items List */}
              <div className="divide-y divide-outline-variant/10">
                {cartItems.map(item => (
                  <div key={item.id} className="grid grid-cols-[auto_1fr] sm:grid-cols-[auto_1fr_100px_120px_100px_auto] gap-4 sm:gap-4 items-center py-6">
                    <input 
                      type="checkbox" 
                      className="w-[18px] h-[18px] rounded text-[#2563EB] border-[#E5E7EB] focus:ring-[#2563EB] cursor-pointer accent-[#2563EB] self-start sm:self-center mt-6 sm:mt-0"
                      checked={item.selected}
                      onChange={() => handleSelectItem(item.id)}
                    />
                    
                    <div className="flex items-center gap-4 ml-2">
                      <div className="w-[72px] h-[72px] sm:w-[84px] sm:h-[84px] rounded-2xl bg-[#eef5ed] overflow-hidden shrink-0">
                         <img src={item.img} alt={item.name} className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <h3 className="font-bold text-[#111827] text-[15px] sm:text-base mb-1.5 leading-tight">{item.name}</h3>
                        <p className="text-[13px] text-on-surface/60 font-medium">{item.details}</p>
                      </div>
                    </div>

                    <div className="hidden sm:block text-center font-bold text-[#111827]">
                      {item.price.toLocaleString('vi-VN')}đ
                    </div>

                    <div className="col-start-2 sm:col-auto flex items-center justify-start sm:justify-center mt-2 sm:mt-0 ml-2 sm:ml-0">
                      <div className="flex items-center bg-white rounded-full border border-outline-variant/40 px-1 py-1 h-9">
                        <button onClick={() => handleQuantityChange(item.id, -1)} className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-surface-container text-[#2563EB] transition-colors cursor-pointer">
                          <MdRemove className="w-4 h-4" />
                        </button>
                        <span className="w-8 text-center font-bold text-[#111827] text-sm">{item.quantity}</span>
                        <button onClick={() => handleQuantityChange(item.id, 1)} className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-surface-container text-[#2563EB] transition-colors cursor-pointer">
                          <MdAdd className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <div className="hidden sm:block text-right font-bold text-[#111827]">
                      {(item.price * item.quantity).toLocaleString('vi-VN')}đ
                    </div>

                    <button onClick={() => handleDelete(item.id)} className="col-start-3 sm:col-auto justify-self-end w-8 h-8 flex items-center justify-center text-on-surface/40 hover:text-red-500 transition-colors cursor-pointer rounded-full hover:bg-red-50">
                      <MdDeleteOutline className="w-5 h-5" />
                    </button>
                  </div>
                ))}

                {cartItems.length === 0 && (
                  <div className="py-12 text-center text-on-surface/60 font-medium">Giỏ hàng của bạn đang trống.</div>
                )}
              </div>
            </div>

            <div className="flex justify-between items-center px-2">
              <Link to="/sanpham" className="flex items-center gap-1.5 text-sm font-medium text-[#2563EB] hover:text-[#1D4ED8] transition-colors">
                <MdKeyboardArrowLeft className="w-[18px] h-[18px]" />
                Tiếp tục mua sắm
              </Link>
              {cartItems.length > 0 && (
                <button onClick={handleDeleteAll} className="text-sm font-medium text-on-surface/50 hover:text-red-500 transition-colors cursor-pointer">
                  Xóa tất cả ({cartItems.length})
                </button>
              )}
            </div>
          </div>

          {/* Right Column: Order Summary */}
          <div className="w-full lg:w-[380px] shrink-0">
            <div className="bg-[#f4f7fb] rounded-[24px] p-6 border border-[#e5ecf5] sticky top-28">
              <h2 className="text-sm font-bold text-on-surface/50 uppercase tracking-wider mb-6">Tóm tắt đơn hàng</h2>
              
              {/* Tạm ẩn phần Nhập mã khuyến mãi vì chưa có API
              <div className="mb-8">
                <label className="text-[11px] font-bold text-on-surface/60 uppercase tracking-wider mb-2.5 block">NHẬP MÃ KHUYẾN MÃI</label>
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    value={voucherCode}
                    onChange={(e) => setVoucherCode(e.target.value)}
                    placeholder="PASTELLOVE"
                    className="flex-1 bg-white border border-outline-variant/30 rounded-full px-5 h-11 text-sm focus:outline-none focus:ring-2 focus:ring-[#c3dfcc] transition-all text-[#111827] font-bold placeholder:font-normal placeholder:text-on-surface/40"
                  />
                  <button className="bg-[#d5e8db] text-[#3e6a4b] font-bold px-6 h-11 rounded-full text-sm hover:bg-[#c3dfcc] transition-colors cursor-pointer">
                    Áp dụng
                  </button>
                </div>
              </div>
              */}

              <div className="space-y-4 mb-6 pb-6 border-b border-[#E5E7EB] text-sm">
                <div className="flex justify-between text-[#6B7280]">
                  <span>Tạm tính</span>
                  <span className="font-medium text-[#111827]">{subtotal.toLocaleString('vi-VN')}đ</span>
                </div>
                <div className="flex justify-between text-[#6B7280]">
                  <span>Phí vận chuyển</span>
                  <span className="font-medium text-[#111827]">Tính khi thanh toán</span>
                </div>
                {phanTramVIP > 0 && (
                  <div className="flex justify-between text-[#2563EB]">
                    <span>Ưu đãi thành viên ({phanTramVIP}%)</span>
                    <span className="font-bold">-{(vipDiscount).toLocaleString('vi-VN')}đ</span>
                  </div>
                )}
                {/* Tạm ẩn Giảm giá vận chuyển & Voucher vì chưa đồng bộ
                <div className="flex justify-between text-[#6B7280]">
                  <span>Giảm giá vận chuyển</span>
                  <span className="font-medium text-[#111827]">{(shippingDiscount).toLocaleString('vi-VN')}đ</span>
                </div>
                <div className="flex justify-between text-[#6B7280]">
                  <span>Voucher</span>
                  <span className="font-medium text-[#111827]">{(voucherDiscount).toLocaleString('vi-VN')}đ</span>
                </div>
                */}
              </div>

              <div className="flex justify-between items-end mb-8">
                <span className="text-[#111827] font-medium text-base mb-1">Tổng cộng</span>
                <div className="text-right">
                  <div className="text-[26px] font-bold text-[#2563EB] leading-none mb-1.5">{Math.max(0, total).toLocaleString('vi-VN')}đ</div>
                  <div className="text-[9px] font-bold text-on-surface/40 italic uppercase tracking-wider">(ĐÃ BAO GỒM VAT)</div>
                </div>
              </div>

              <button onClick={handleCheckout} className="w-full h-14 bg-[#2563EB] hover:bg-[#1D4ED8] text-white rounded-full font-bold shadow-md hover:shadow-lg transition-all cursor-pointer flex items-center justify-center gap-2 text-[15px]">
                Tiến hành thanh toán
                <MdKeyboardArrowRight className="w-[22px] h-[22px]" />
              </button>
            </div>
            
           
          </div>
        </div>

      </main>

      <Footer />
    </div>
  );
}
