import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  MdCheckCircle, 
  MdPersonOutline, 
  MdLocationOn, 
  MdLocalShipping, 
  MdOutlineShoppingBag, 
  MdPayments,
  MdKeyboardArrowDown
} from 'react-icons/md';
import toast from 'react-hot-toast';
import API from '../../services/api';
import { getCartToken } from '../../utils/cart';
import Header from '../../components/Header';

export default function ThanhToan() {
  const navigate = useNavigate();
  const location = useLocation();
  const selectedIds = location.state?.selectedIds || [];
  const [cartItems, setCartItems] = useState([]);
  const [phanTramVIP, setPhanTramVIP] = useState(0);
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    hoTen: '',
    sdt: '',
    email: '',
    diaChi: '',
    ghiChu: '',
  });

  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);
  
  const [selectedProvince, setSelectedProvince] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [selectedWard, setSelectedWard] = useState('');
  
  const [targetAddress, setTargetAddress] = useState(null);
  
  const [shippingFee, setShippingFee] = useState(0);
  const [expectedDeliveryTime, setExpectedDeliveryTime] = useState(null);
  const [loadingFee, setLoadingFee] = useState(false);

  const [selectedPayment, setSelectedPayment] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const cartToken = getCartToken();
        const [cartRes, paymentRes, userRes, provinceRes] = await Promise.all([
          API.get(`/GioHang?cartToken=${cartToken}`),
          API.get('/PhuongThucThanhToan').catch(() => ({ data: [] })),
          API.get('/TaiKhoan/thongtin').catch(() => ({ data: null })),
          API.get('/VanChuyen/tinh-thanh').catch(() => ({ data: null }))
        ]);
        // Xử lý lấy thông tin tài khoản
        if (userRes.data) {
          const user = userRes.data;
          let parsedDiaChi = user.diaChi;
          // Xử lý địa chỉ
          if (user.diaChi) {
            const parts = user.diaChi.split(',').map(s => s.trim());
            if (parts.length >= 3) {
              const target = {
                province: parts[parts.length - 1],
                district: parts[parts.length - 2],
                ward: parts[parts.length - 3],
                street: parts.slice(0, parts.length - 3).join(', ')
              };
              setTargetAddress(target);
              parsedDiaChi = target.street;
            }
          }

          setFormData(prev => ({
            ...prev,
            hoTen: user.hoTen || prev.hoTen,
            email: user.email || prev.email,
            sdt: user.soDienThoai || prev.sdt,
            diaChi: parsedDiaChi || prev.diaChi
          }));
        }
        
        let items = cartRes.data.danhSachSanPham || [];
        if (selectedIds.length > 0) {
          items = items.filter(item => selectedIds.includes(item.maSP));
        }

        if (items.length === 0) {
          toast.error('Giỏ hàng hoặc sản phẩm đã chọn trống!');
          navigate('/giohang');
          return;
        }

        setPhanTramVIP(cartRes.data.phanTramVIP || 0);

        // Xử lý giỏ hàng
        const mapped = items.map(item => ({
          id: item.maSP,
          name: item.tenSP,
          price: item.donGia,
          quantity: item.soLuong,
          canNang: item.canNang || 300,
          img: item.hinhAnh ? (item.hinhAnh.startsWith('http') ? item.hinhAnh : `https://localhost:7224/images/${item.hinhAnh}`) : `https://via.placeholder.com/300x300?text=${encodeURIComponent(item.tenSP)}`,
        }));
        setCartItems(mapped);

        setPaymentMethods(paymentRes.data);
        if (paymentRes.data.length > 0) {
          setSelectedPayment(paymentRes.data[0].maPTTT);
        }

        if (provinceRes.data && provinceRes.data.data) {
          setProvinces(provinceRes.data.data);
        }
      } catch (error) {
        console.error('Lỗi khi tải dữ liệu thanh toán:', error);
        toast.error('Có lỗi xảy ra khi tải dữ liệu.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [navigate]);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  useEffect(() => {
    if (selectedProvince) {
      API.get(`/VanChuyen/quan-huyen?province_id=${selectedProvince}`)
        .then(res => setDistricts(res.data?.data || []))
        .catch(err => console.error("Lỗi lấy quận/huyện", err));
    } else {
      setDistricts([]);
      setWards([]);
      setSelectedDistrict('');
      setSelectedWard('');
      setShippingFee(0);
      setExpectedDeliveryTime(null);
    }
  }, [selectedProvince]);

  useEffect(() => {
    if (selectedDistrict) {
      API.get(`/VanChuyen/phuong-xa?district_id=${selectedDistrict}`)
        .then(res => setWards(res.data?.data || []))
        .catch(err => console.error("Lỗi lấy phường/xã", err));
    } else {
      setWards([]);
      setSelectedWard('');
      setShippingFee(0);
      setExpectedDeliveryTime(null);
    }
  }, [selectedDistrict]);
  // Xử lý địa chỉ
  const normalizeLocation = (str) => {
    if(!str) return '';
    let s = str.toLowerCase().replace(/(thành phố|tỉnh|quận|huyện|phường|xã|thị trấn|tp\.|q\.|h\.|p\.|x\.)/g, '').trim();
    if(s.includes('hcm') || s.includes('ho chi minh')) return 'ho chi minh';
    if(s.includes('hn') || s.includes('ha noi')) return 'ha noi';
    return s;
  };

  useEffect(() => {
    if (provinces.length > 0 && targetAddress && !selectedProvince) {
      const targetProv = normalizeLocation(targetAddress.province);
      const matchedProv = provinces.find(p => {
         const normP = normalizeLocation(p.ProvinceName);
         return normP === targetProv || normP.includes(targetProv) || targetProv.includes(normP);
      });
      if (matchedProv) {
         setSelectedProvince(matchedProv.ProvinceID.toString());
      }
    }
  }, [provinces, targetAddress, selectedProvince]);

  useEffect(() => {
    if (districts.length > 0 && targetAddress && selectedProvince && !selectedDistrict) {
      const targetDist = normalizeLocation(targetAddress.district);
      const matchedDist = districts.find(d => {
         const normD = normalizeLocation(d.DistrictName);
         return normD === targetDist || normD.includes(targetDist) || targetDist.includes(normD);
      });
      if (matchedDist) {
         setSelectedDistrict(matchedDist.DistrictID.toString());
      }
    }
  }, [districts, targetAddress, selectedProvince, selectedDistrict]);

  useEffect(() => {
    if (wards.length > 0 && targetAddress && selectedDistrict && !selectedWard) {
      const targetWard = normalizeLocation(targetAddress.ward);
      const matchedWard = wards.find(w => {
         const normW = normalizeLocation(w.WardName);
         return normW === targetWard || normW.includes(targetWard) || targetWard.includes(normW);
      });
      if (matchedWard) {
         setSelectedWard(matchedWard.WardCode);
         setTargetAddress(null); // Clear after full match
      }
    }
  }, [wards, targetAddress, selectedDistrict, selectedWard]);

  useEffect(() => {
    if (selectedDistrict && selectedWard && cartItems.length > 0) {
      setLoadingFee(true);
      const totalWeight = cartItems.reduce((sum, item) => sum + (item.canNang * item.quantity), 0);
      
      API.post('/VanChuyen/tinh-phi', {
        toDistrictId: parseInt(selectedDistrict),
        toWardCode: selectedWard,
        weight: totalWeight
      }).then(res => {
        setShippingFee(res.data.phiVanChuyen || 0);
        if (res.data.thoiGianDuKienGiao) {
          const date = new Date(res.data.thoiGianDuKienGiao);
          setExpectedDeliveryTime(date.toLocaleDateString('vi-VN'));
        }
      }).catch(err => {
        console.error("Lỗi tính phí", err);
        setShippingFee(0);
        setExpectedDeliveryTime(null);
        toast.error('Lỗi tính phí vận chuyển từ GHN. Vui lòng kiểm tra lại cấu hình!');
      }).finally(() => {
        setLoadingFee(false);
      });
    }
  }, [selectedDistrict, selectedWard, cartItems]);

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (!formData.hoTen || !formData.sdt || !formData.diaChi || !selectedProvince || !selectedDistrict || !selectedWard) {
      toast.error('Vui lòng điền đầy đủ thông tin giao hàng (Họ tên, SĐT, Địa chỉ, Tỉnh/Huyện/Xã)!');
      return;
    }
    if (!selectedPayment) {
      toast.error('Vui lòng chọn phương thức thanh toán!');
      return;
    }

    setIsSubmitting(true);
    
    // Tìm tên tỉnh/huyện/xã để lưu vào địa chỉ đầy đủ
    const provinceName = provinces.find(p => p.ProvinceID === parseInt(selectedProvince))?.ProvinceName || '';
    const districtName = districts.find(d => d.DistrictID === parseInt(selectedDistrict))?.DistrictName || '';
    const wardName = wards.find(w => w.WardCode === selectedWard)?.WardName || '';
    
    const diaChiGiaoHang = `${formData.diaChi}, ${wardName}, ${districtName}, ${provinceName}`;
    
    try {
      const cartToken = getCartToken();
      const payload = {
        hoTenNguoiNhan: formData.hoTen,
        sdtNguoiNhan: formData.sdt,
        diaChiGiaoHang: diaChiGiaoHang,
        ghiChu: formData.ghiChu,
        maPTTT: selectedPayment,
        cartToken: cartToken,
        selectedMaSPs: cartItems.map(item => item.id),
        phiVanChuyen: shippingFee,
        maQuanHuyen: parseInt(selectedDistrict),
        maPhuongXa: selectedWard
      };

      const endpoint = cartToken ? '/DonHang' : '/DonHang/thanh-vien-tao-don';
      const res = await API.post(endpoint, payload);
      
      // Clear giỏ hàng bằng cách đổi cartToken
      localStorage.removeItem('cartToken');
      window.dispatchEvent(new Event('cartUpdated'));

      console.log('API RESPONSE FULL:', res.data);
      console.log('paymentUrl value:', res.data.paymentUrl);
      
      if (res.data.paymentUrl) {
        toast.success('Đang chuyển hướng sang thanh toán...');
        setTimeout(() => {
          window.location.href = res.data.paymentUrl;
        }, 1500);
      } else {
        if (selectedPayment !== 1) {
          toast.error('Lỗi khi lấy link thanh toán. Vui lòng kiểm tra lại!');
        }
        navigate('/hoantat', { 
          state: { 
            donHangData: res.data,
            hoTen: formData.hoTen,
            diaChi: diaChiGiaoHang,
            expectedDeliveryTime: expectedDeliveryTime
          } 
        });
      }
    } catch (error) {
      console.error('Lỗi khi đặt hàng:', error);
      if (error.response && error.response.data) {
        console.error('Chi tiết lỗi từ server:', error.response.data);
      }
      toast.error(error.response?.data?.message || 'Có lỗi xảy ra khi đặt hàng');
    } finally {
      setIsSubmitting(false);
    }
  };

  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const total = Math.max(0, subtotal + shippingFee);

  if (loading) {
    return <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center">Đang tải...</div>;
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Header Phụ */}
      <Header />
     

      {/* Breadcrumb Steps */}
      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="flex items-center justify-center">
          <div className="flex flex-col items-center">
            <div className="w-8 h-8 rounded-full bg-[#eef5ed] text-green-600 flex items-center justify-center mb-2">
              <MdCheckCircle className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-on-surface/70">Giỏ hàng</span>
          </div>
          <div className="w-24 h-px bg-outline-variant/50 mx-2 -mt-6"></div>
          <div className="flex flex-col items-center">
            <div className="w-8 h-8 rounded-full bg-[#2563EB] text-white flex items-center justify-center mb-2 font-bold text-sm">
              02
            </div>
            <span className="text-xs font-bold text-[#2563EB]">Thanh toán</span>
          </div>
          <div className="w-24 h-px bg-outline-variant/50 mx-2 -mt-6"></div>
          <div className="flex flex-col items-center">
            <div className="w-8 h-8 rounded-full bg-surface-container text-on-surface/40 flex items-center justify-center mb-2 font-bold text-sm">
              03
            </div>
            <span className="text-xs font-bold text-on-surface/40">Hoàn tất</span>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Cột trái: Form thông tin */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Thông tin khách hàng */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-outline-variant/20">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold text-[#111827] flex items-center gap-2">
                  <MdPersonOutline className="w-6 h-6 text-primary" />
                  Thông tin khách hàng
                </h2>
                
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#6B7280] mb-1.5 ml-1">Email</label>
                  <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="example@gmail.com" className="w-full bg-surface-container/50 border border-outline-variant/50 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#6B7280] mb-1.5 ml-1">Số điện thoại</label>
                  <input type="tel" name="sdt" value={formData.sdt} onChange={handleChange} placeholder="09xx xxx xxx" className="w-full bg-surface-container/50 border border-outline-variant/50 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all" />
                </div>
              </div>
            </div>

            {/* Địa chỉ giao hàng */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-outline-variant/20">
              <h2 className="text-lg font-bold text-[#111827] flex items-center gap-2 mb-6">
                <MdLocationOn className="w-6 h-6 text-primary" />
                Địa chỉ giao hàng
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-[#6B7280] mb-1.5 ml-1">Họ và tên</label>
                  <input type="text" name="hoTen" value={formData.hoTen} onChange={handleChange} placeholder="Nguyễn Văn A" className="w-full bg-surface-container/50 border border-outline-variant/50 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#6B7280] mb-1.5 ml-1">Tỉnh/Thành phố</label>
                  <select 
                    value={selectedProvince} 
                    onChange={e => setSelectedProvince(e.target.value)} 
                    className="w-full bg-surface-container/50 border border-outline-variant/50 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                  >
                    <option value="">Chọn Tỉnh/Thành phố</option>
                    {provinces.map(p => (
                      <option key={p.ProvinceID} value={p.ProvinceID}>{p.ProvinceName}</option>
                    ))}
                  </select>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-[#6B7280] mb-1.5 ml-1">Quận/Huyện</label>
                    <select 
                      value={selectedDistrict} 
                      onChange={e => setSelectedDistrict(e.target.value)} 
                      disabled={!selectedProvince}
                      className="w-full bg-surface-container/50 border border-outline-variant/50 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all disabled:opacity-50"
                    >
                      <option value="">Chọn Quận/Huyện</option>
                      {districts.map(d => (
                        <option key={d.DistrictID} value={d.DistrictID}>{d.DistrictName}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#6B7280] mb-1.5 ml-1">Phường/Xã</label>
                    <select 
                      value={selectedWard} 
                      onChange={e => setSelectedWard(e.target.value)} 
                      disabled={!selectedDistrict}
                      className="w-full bg-surface-container/50 border border-outline-variant/50 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all disabled:opacity-50"
                    >
                      <option value="">Chọn Phường/Xã</option>
                      {wards.map(w => (
                        <option key={w.WardCode} value={w.WardCode}>{w.WardName}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#6B7280] mb-1.5 ml-1">Địa chỉ cụ thể (Số nhà, tên đường)</label>
                  <input type="text" name="diaChi" value={formData.diaChi} onChange={handleChange} placeholder="123 Đường ABC" className="w-full bg-surface-container/50 border border-outline-variant/50 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#6B7280] mb-1.5 ml-1">Ghi chú cho đơn hàng</label>
                  <textarea name="ghiChu" value={formData.ghiChu} onChange={handleChange} placeholder="Giao hàng trong giờ hành chính..." rows="2" className="w-full bg-surface-container/50 border border-outline-variant/50 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all resize-none"></textarea>
                </div>
              </div>
            </div>

          </div>

          {/* Cột phải: Thông tin đơn hàng */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Đơn hàng của bạn */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-outline-variant/20">
              <div className="flex items-center justify-between mb-6 cursor-pointer">
                <h2 className="text-lg font-bold text-[#111827] flex items-center gap-2">
                  <MdOutlineShoppingBag className="w-6 h-6 text-primary" />
                  Đơn hàng của bạn ({cartItems.length})
                </h2>
                <MdKeyboardArrowDown className="w-6 h-6 text-on-surface/50" />
              </div>
              <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-surface-container overflow-hidden shrink-0 border border-[#E5E7EB]">
                        <img src={item.img} alt={item.name} className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-[#111827] line-clamp-1">{item.name}</h4>
                        <span className="text-xs font-medium text-on-surface/60">Số lượng: {item.quantity}</span>
                      </div>
                    </div>
                    <span className="text-sm font-bold text-[#111827]">{(item.price * item.quantity).toLocaleString('vi-VN')}đ</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Phương thức thanh toán */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-outline-variant/20">
              <h2 className="text-lg font-bold text-[#111827] flex items-center gap-2 mb-6">
                <MdPayments className="w-6 h-6 text-primary" />
                Phương thức thanh toán
              </h2>
              <div className="space-y-3">
                {paymentMethods.map(method => (
                  <label key={method.maPTTT} className={`cursor-pointer border-2 rounded-xl px-4 py-3 flex items-center gap-3 transition-all ${selectedPayment === method.maPTTT ? 'border-[#2563EB] bg-[#EFF6FF]' : 'border-outline-variant/40 hover:border-outline-variant'}`}>
                    <input type="radio" name="payment" value={method.maPTTT} checked={selectedPayment === method.maPTTT} onChange={() => setSelectedPayment(method.maPTTT)} className="hidden" />
                    {method.hinhAnh ? (
                      <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center p-1 border border-outline-variant/30">
                        <img src={`https://localhost:7224/images/${method.hinhAnh}`} alt={method.maCode} className="w-full h-full object-contain" />
                      </div>
                    ) : (
                      <div className="w-8 h-8 rounded-lg bg-surface-container flex items-center justify-center text-[#1E3A8A]">
                        <MdPayments className="w-5 h-5" />
                      </div>
                    )}
                    <span className="text-sm font-bold text-[#111827]">{method.tenPhuongThuc}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Tóm tắt đơn hàng */}
            <div className="bg-white border border-[#E5E7EB] p-6 rounded-2xl shadow-sm">
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-on-surface/70 font-medium">Tạm tính</span>
                  <span className="font-bold text-[#111827]">{subtotal.toLocaleString('vi-VN')}đ</span>
                </div>
                {phanTramVIP > 0 && (
                  <div className="flex justify-between text-sm text-[#2563EB]">
                    <span className="font-medium">Ưu đãi thành viên ({phanTramVIP}%)</span>
                    <span className="font-bold">-{(subtotal * (phanTramVIP / 100)).toLocaleString('vi-VN')}đ</span>
                  </div>
                )}
                <div className="flex justify-between text-sm">
                  <span className="text-on-surface/70 font-medium flex items-center gap-2">
                    Phí vận chuyển
                    {loadingFee && <span className="text-xs text-primary animate-pulse">Đang tính...</span>}
                  </span>
                  <span className="font-bold text-[#111827]">
                    {shippingFee === 0 && (!selectedDistrict || !selectedWard) ? 'Tính khi chọn địa chỉ' : `${shippingFee.toLocaleString('vi-VN')}đ`}
                  </span>
                </div>
                {expectedDeliveryTime && (
                  <div className="flex justify-between text-sm mt-1">
                    <span className="text-on-surface/70 font-medium">Dự kiến giao hàng</span>
                    <span className="font-bold text-[#10B981]">{expectedDeliveryTime}</span>
                  </div>
                )}
              </div>
              <div className="border-t border-outline-variant/40 pt-4 mb-6">
                <div className="flex justify-between items-end">
                  <span className="text-base font-bold text-[#111827]">Tổng cộng</span>
                  <span className="text-xl font-bold text-[#2563EB]">
                    {((subtotal * (1 - phanTramVIP / 100)) + shippingFee).toLocaleString('vi-VN')}đ
                  </span>
                </div>
              </div>
              
              <button 
                onClick={handlePlaceOrder}
                disabled={isSubmitting}
                className="w-full bg-[#2563EB] hover:bg-[#1D4ED8] text-white h-12 rounded-xl font-bold flex items-center justify-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm cursor-pointer"
              >
                {isSubmitting ? 'Đang xử lý...' : (
                  <>
                    <MdCheckCircle className="w-5 h-5" />
                    Đặt hàng ngay
                  </>
                )}
              </button>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
