"use client"

import { useState } from "react";
import { Trash } from "lucide-react";
// https://ui.shadcn.com/docs/components/alert-dialog
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "../ui/button";
import toast from "react-hot-toast";

interface DeleteProps {
  item: string;
  id: string;
}

// trạng thái loading để kiểm soát khi xóa đang trong quá trình xử lý.
const Delete: React.FC<DeleteProps> = ({ item, id }) => {
  const [loading, setLoading] = useState(false);

  // thực hiện thao tác xóa khi người dùng xác nhận
  const onDelete = async () => {
    try {
      // Bắt đầu trạng thái loading khi quá trình xóa bắt đầu.
      setLoading(true)
      // Xác định loại tài nguyên cần xóa (nếu item là "product" thì chọn "products", nếu không chọn "collections").
      const itemType = item === "product" ? "products" : "collections"
      // Gửi yêu cầu xóa đến API bằng phương thức DELETE với đường dẫn dựa trên itemType và id.
      const res = await fetch(`/api/${itemType}/${id}`, {
        method: "DELETE",
      })

      // Nếu yêu cầu thành công
      if (res.ok) {
        // Kết thúc trạng thái loading.
        setLoading(false)
        window.location.href = (`/${itemType}`)
        // Hiển thị thông báo thành công.
        toast.success(`${item} deleted`)
      }
    } catch (err) {
      console.log(err)
      toast.error("Đã xảy ra lỗi! Vui lòng thử lại. ")
    }
  }
  return (
    <AlertDialog>
      <AlertDialogTrigger>
        <Button className="bg-red-1 text-white">
          <Trash className="h-4 w-4" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="bg-white text-grey-1">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-red-1">Bạn có chắc chắn không?</AlertDialogTitle>
          <AlertDialogDescription>
          Hành động này không thể hoàn tác. Thao tác này sẽ xóa vĩnh viễn {item}.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Hủy bỏ</AlertDialogCancel>
          <AlertDialogAction className="bg-red-1 text-white" onClick={onDelete}>Xoá</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default Delete;
