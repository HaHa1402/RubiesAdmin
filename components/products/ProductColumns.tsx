"use client";

import { ColumnDef } from "@tanstack/react-table";
import Delete from "../custom ui/Delete";
import Link from "next/link";

export const columns: ColumnDef<ProductType>[] = [
  {
    //Hiển thị cột tiêu đề (title) 
    accessorKey: "title",
    header: "Tiêu đề",
    //nhấp vào tiêu đề,sẽ chuyển đến trang chi tiết sản phẩm cụ thể đó dựa trên ID của sản phẩm(_id).
    cell: ({ row }) => (
      <Link
        href={`/products/${row.original._id}`}
        className="hover:text-red-1"
      >
        {row.original.title}
      </Link>
    ),
  },

  //Hiển thị cột loại (category) 
  {
    accessorKey: "category",
    header: "Loại",
  },

  //Hiển thị cột bộ sưu tập (collections) 
  {
    accessorKey: "collections",
    header: "Bộ sưu tập",
    cell: ({ row }) => row.original.collections.map((collection) => collection.title).join(", "),
  },
 

  // Hiển thị cột giá tiền bán ra (price)
  {
    accessorKey: "price",
    header: "Giá tiền ",
    cell: ({ row }) => new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(row.original.price),
  },



  // Hiển thị cột chi phí sản xuất hoặc mua vào (giá gốc)
  {
    accessorKey: "expense",
    header: "Giá gốc ",
    cell: ({ row }) => new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(row.original.expense),
  },

   // Hiển thị một nút Delete cho mỗi sản phẩm
   {
    id: "actions",
    cell: ({ row }) => <Delete item="product" id={row.original._id} />,
  },


];