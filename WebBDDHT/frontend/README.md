# Quanlybanhang - Frontend

Đây là phần Frontend (Giao diện người dùng) cho dự án Quản lý Bán hàng, được xây dựng bằng thư viện ReactJS kết hợp công cụ build Vite giúp trải nghiệm phát triển nhanh chóng.

## 📌 Yêu cầu hệ thống
- [Node.js](https://nodejs.org/) (Khuyến nghị phiên bản LTS mới nhất - từ 18.x trở lên)

## 🚀 Hướng dẫn cài đặt

1. **Cài đặt các gói thư viện (Dependencies):**
   Mở terminal, di chuyển vào thư mục `frontend` và chạy lệnh:
   ```bash
   npm install
   ```

2. **Cấu hình môi trường (Nếu có):**
   Đảm bảo rằng Backend đang chạy để Frontend có thể gửi các yêu cầu API thành công (Thường API sẽ được gọi tới cổng mặc định của Backend, hãy kiểm tra lại file cấu hình API trong thư mục `src/services`).

3. **Chạy server ở môi trường phát triển (Dev server):**
   ```bash
   npm run dev
   ```
   *Server Frontend mặc định sẽ chạy ở địa chỉ `http://localhost:5173`. Mở trình duyệt và truy cập vào đường dẫn này.*

4. **Đóng gói dự án (Build for Production):**
   Khi cần triển khai (deploy), chạy lệnh sau để tạo bản build rút gọn tối ưu nhất:
   ```bash
   npm run build
   ```

## 👤 Đăng nhập và Test
- Hệ thống yêu cầu đăng nhập để sử dụng các chức năng chính.
- Sau khi khởi động thành công cả Frontend và Backend, bạn có thể tự mình **Đăng ký** một tài khoản mới trực tiếp trên giao diện trang web để dùng thử.
