import API from '../services/api';
import toast from 'react-hot-toast';

export const getCartToken = () => {
  let token = localStorage.getItem('cartToken');
  if (!token) {
    token = 'cart_' + Math.random().toString(36).substr(2, 9) + Date.now();
    localStorage.setItem('cartToken', token);
  }
  return token;
};

export const addToCart = async (sanPham, soLuong = 1) => {
  if (sanPham.soLuongTon <= 0) {
    toast.error('Sản phẩm đã hết hàng!');
    return;
  }
  
  const cartToken = getCartToken();

  try {
    await API.post('/GioHang/them', {
      maSP: sanPham.maSP,
      soLuong: soLuong,
      cartToken: cartToken
    });
    
    window.dispatchEvent(new Event('cartUpdated'));
    toast.success('Đã thêm vào giỏ hàng!');
  } catch (error) {
    console.error('Lỗi khi thêm vào giỏ:', error);
    toast.error(error.response?.data?.message || 'Có lỗi xảy ra khi thêm vào giỏ hàng!');
  }
};
