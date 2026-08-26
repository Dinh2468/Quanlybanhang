# Quanlybanhang - Hệ Thống Quản Lý Bán Hàng

Đây là kho lưu trữ chính cho dự án "Quản lý Bán hàng". Dự án được chia làm hai phần riêng biệt: Frontend (Giao diện người dùng) và Backend (Máy chủ xử lý).

## 🗂 Cấu trúc thư mục
- 📂 **`/API_WebBDDHT`**: Chứa toàn bộ mã nguồn Backend (ASP.NET Core 8).
- 📂 **`/WebBDDHT/frontend`**: Chứa toàn bộ mã nguồn Frontend (ReactJS, Vite).


## 🛠 Công nghệ sử dụng
- **Backend:** C# ASP.NET Core 8.0, Entity Framework Core, SQL Server.
- **Frontend:** ReactJS, Vite, Tailwind CSS.
- **Dịch vụ tích hợp bên thứ ba:** Google OAuth, Cloudinary (Lưu trữ ảnh), Thanh toán MoMo / VNPay, Giao Hàng Nhanh (GHN).

## 🚀 Hướng dẫn chạy dự án
Vì đây là một hệ thống đầy đủ (Fullstack), bạn cần chạy song song cả Backend và Frontend để ứng dụng hoạt động hoàn chỉnh.

Vui lòng xem hướng dẫn chi tiết cách cài đặt ở từng thư mục:
1. 🔗 [Hướng dẫn cài đặt và chạy Backend](./API_WebBDDHT/README.md)
2. 🔗 [Hướng dẫn cài đặt và chạy Frontend](./WebBDDHT/frontend/README.md)
