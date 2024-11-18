// hiển thị danh sách các bộ sưu tập 
"use client";

import { ColumnDef } from "@tanstack/react-table";
import Delete from "../custom ui/Delete";
import Link from "next/link";

export const columns: ColumnDef<CollectionType>[] = [
  {
    //Hiển thị cột tiêu đề (title) 
    accessorKey: "title",
    header: "Tiêu đề",
    //nhấp vào tiêu đề,sẽ chuyển đến trang chi tiết của bộ sưu tập cụ thể đó dựa trên ID của bộ sưu tập (_id).
    cell: ({ row }) => (
      <Link
        href={`/collections/${row.original._id}`}
        className="hover:text-red-1"
      >
        {row.original.title}
      </Link>
    ),
  },

  {
    // Hiển thị cột(products):số lượng sản phẩm 
    accessorKey: "products",
    header: "Sản phẩm",
    cell: ({ row }) => <p>{row.original.products.length}</p>,
  },
  
  {
    // Hiển thị một nút Delete cho mỗi bộ sưu tập
    id: "actions",
    cell: ({ row }) => <Delete item="collection" id={row.original._id} />,
  },
];
