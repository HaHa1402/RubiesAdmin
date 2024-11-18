// nhập types(các loại) dữ liệu trong typescrip . lấy siêu dữ liệu(metadata):title, mô tả(description) từ môi trường nextjs
import type { Metadata } from "next";
//nhập font chữ inter từ next đc tích hợp bởi google font
import { Inter } from "next/font/google";
// nhập ngôn ngữ css
import "../globals.css";


import {
  ClerkProvider,
  SignInButton,
  SignedIn,
  SignedOut,
  UserButton
} from '@clerk/nextjs';

// khai báo cỡ chữ inter, lấy tập hợp con(subsets) từ chữ latin để tối ưu hoá tốc độ tải trang, truy xuất dữ liệu nhanh chóng
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Borcelle - Admin Auth",
  description: "Admin dashboard to manage Borcelle's data",
};

// default: mặc định , function: chức năng
export default function RootLayout({
  // những ndung con sẽ nằm ở phần children và nó có thể thay đổi
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
         {/* Cơ thể của trang sử dụng font chữ Inter */}
        <body className={inter.className}>{children}</body>
      </html>
    </ClerkProvider>
  );
}
// ClerkProvider: Đây là thành phần bao bọc toàn bộ ứng dụng ,quản lý việc xác thực người dùng.