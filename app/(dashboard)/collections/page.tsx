"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";

import { columns } from "@/components/collections/CollectionColumns";
import { DataTable } from "@/components/custom ui/DataTable";
import { Button } from "@/components/ui/button";
// separator :dấu phẩy, dấu gạch chéo(dùng để tách các phần tử trong một chuỗi)
import { Separator } from "@/components/ui/separator";
import Loader from "@/components/custom ui/Loader";

const Collections = () => {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [collections, setCollections] = useState([]);

  // gọi API để lấy danh sách các bộ sưu tập từ đường dẫn /api/collections.
  const getCollections = async () => {
    try {
      const res = await fetch("/api/collections", {
        method: "GET",
      });
      const data = await res.json();
      setCollections(data);
      setLoading(false);
    } catch (err) {
      console.log("[collections_GET]", err);
    }
  };

  useEffect(() => {
    getCollections();
  }, []);

  return loading ? <Loader /> : (
    // Tạo giao diện cho phần hiển thị danh sách bộ sưu tập.
    <div className="px-10 py-5">
      <div className="flex items-center justify-between">
        <p className="text-heading2-bold">Bộ sưu tập</p>

        {/* Nút "Create Collection" */}
        <Button className="bg-blue-1 text-white" onClick= {() => router.push("/collections/new")}>
        {/* Plus: Biểu tượng dấu cộng hiển thị trước chữ "Create Collection". */}
          <Plus className="h-4 w-4 mr-2" />
          Tạo bộ sưu tập
        </Button>

      </div>
      {/* Separator:phân cách giữa phần tiêu đề và bảng dữ liệu, class:tạo màu và khoảng cách (bg-grey-1 my-4). */}
      <Separator className="bg-grey-1 my-4" />
      {/* DataTable: Component để hiển thị dữ liệu dưới dạng bảng. */}
      <DataTable columns={columns} data={collections} searchKey="title" />
    </div>
  );
};

export default Collections;
