// dùng ngôn ngữ javascrip, sử dụng thư viên react trong mtr next.js
// nhập thành phần signUp từ thư viện đc tích hợp giữa clerk vs next(clerk là dịch vụ có chức năng xác thực tk người dùng, đăng nhập và quản ls tk người dùng)
import { SignUp } from "@clerk/nextjs";

export default function Page() {
  return (
    <div className="h-screen flex justify-center items-center">
      <SignUp />
    </div>
  );
}
