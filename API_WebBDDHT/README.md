# Quanlybanhang - API Backend

Đây là phần Backend cho dự án Quản lý Bán hàng, được xây dựng bằng C# ASP.NET Core 8.

## 📌 Yêu cầu hệ thống
- [.NET 8 SDK](https://dotnet.microsoft.com/download/dotnet/8.0)
- SQL Server (hoặc SQL Server Express)
- Công cụ dòng lệnh của EF Core: `dotnet-ef` (Cài đặt bằng lệnh: `dotnet tool install --global dotnet-ef`)

## 🚀 Hướng dẫn cài đặt

1. **Khôi phục các gói NuGet (Dependencies):**
   Mở terminal, di chuyển vào thư mục `API_WebBDDHT` và chạy lệnh sau để tải các thư viện cần thiết:
   ```bash
   dotnet restore
   ```

2. **Cấu hình Database và Biến môi trường:**
   Mở file `appsettings.json` (hoặc `appsettings.Development.json`) và thiết lập các thông tin của bạn:
   - `ConnectionStrings:DefaultConnection`: Đổi thành chuỗi kết nối (Connection String) trỏ tới SQL Server trên máy bạn.
   - Điền đầy đủ các API Keys & Secrets cho các dịch vụ: Google OAuth, Cloudinary, MoMo, VNPay, Giao Hàng Nhanh (nếu muốn test các chức năng này).

3. **Khởi tạo cơ sở dữ liệu (Database):**
   Dự án sử dụng Entity Framework Core. Chạy lệnh sau để tự động tạo Database và cấu trúc bảng:
   ```bash
   dotnet ef database update
   ```
   *(Hệ thống sẽ tự động tạo cơ sở dữ liệu dựa trên connection string bạn đã cung cấp).*

4. **Chạy Server:**
   ```bash
   dotnet run
   ```
   *Mặc định, server sẽ chạy và cung cấp giao diện Swagger UI giúp bạn dễ dàng xem danh sách các API và test trực tiếp.*
