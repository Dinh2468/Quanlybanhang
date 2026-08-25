import axios from 'axios';
import toast from 'react-hot-toast';

// Tạo API service
const API = axios.create({
  baseURL: 'https://localhost:7224/api', // Lấy đúng cổng từ Swagger của bạn
  headers: {
    'Content-Type': 'application/json',
  },
});

// Tự động cấu hình gắn kèm token JWT vào Header nếu có lưu trong localStorage
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Xử lý tự động khi nhận về lỗi từ server (Đặc biệt là 401 Unauthorized)
API.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Bắt lỗi 401 (Chưa đăng nhập hoặc phiên/Token hết hạn)
    if (error.response && error.response.status === 401) {
      // Xóa thông tin đăng nhập cũ
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      
      // Chống hiển thị thông báo nhiều lần nếu có nhiều API gọi cùng lúc bị 401
      if (!window.hasShown401Toast) {
        window.hasShown401Toast = true;
        toast.error('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại!', { duration: 3000 });
        
        // Chờ 1.5 giây để người dùng đọc thông báo rồi chuyển hướng
        setTimeout(() => {
          window.location.href = '/dangnhap';
        }, 1500);
      }
    }
    return Promise.reject(error);
  }
);

export default API;