# React + Vite

Mẫu dự án này cung cấp một bộ cài đặt tối giản để chạy React với Vite, bao gồm HMR (Cập nhật module nóng) và một số quy tắc cấu hình ESLint cơ bản.

Hiện tại, có hai plugin chính thức được hỗ trợ:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) sử dụng [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) sử dụng [SWC](https://swc.rs/)

## Hướng dẫn cài đặt và khởi chạy

1. **Cài đặt các gói thư viện (Dependencies):**
   ```bash
   npm install
   ```

2. **Chạy server ở môi trường phát triển (Dev server):**
   ```bash
   npm run dev
   ```

3. **Đóng gói dự án (Build):**
   ```bash
   npm run build
   ```

## Trình biên dịch React (React Compiler)

React Compiler không được bật mặc định trên mẫu dự án này vì nó có thể ảnh hưởng đến hiệu suất khi phát triển và đóng gói. Để bật nó, vui lòng xem [tài liệu hướng dẫn này](https://react.dev/learn/react-compiler/installation).

## Mở rộng cấu hình ESLint

Nếu bạn đang phát triển một ứng dụng để đưa vào sử dụng thực tế (production), chúng tôi khuyên bạn nên dùng TypeScript với các quy tắc kiểm tra lỗi (lint rules) chặt chẽ. Hãy tham khảo [mẫu TypeScript](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) để biết thêm thông tin về cách tích hợp TypeScript và [`typescript-eslint`](https://typescript-eslint.io) vào dự án của bạn.
