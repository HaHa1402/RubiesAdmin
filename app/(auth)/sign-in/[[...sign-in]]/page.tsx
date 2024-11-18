// trang được viết bằng ngôn ngữ javascrip, dùng thư viện react từ mtruong next.js
// nhập thành phần SignIn từ thư việc đc tích hợp bởi cleck, nextjs

import { SignIn } from "@clerk/nextjs";
// xuất trang Sigh In từ form mẫu default(mặc định)
export default function Page() {
  return (
    // căn chỉnh form nằm giữa màn hình cả theo chiều ngang lẫn chiều dọc.
    <div className="h-screen flex justify-center items-center">
      <SignIn />
    </div>
  );
}
