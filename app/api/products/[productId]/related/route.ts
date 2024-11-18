// related(có liên quan)-Tính năng gợi ý: Ở trang chi tiết sản phẩm, phần related sẽ trả về danh sách các sản phẩm có liên quan để gợi ý cho người dùng, giúp họ khám phá thêm các sản phẩm tương tự.

import Product from "@/lib/models/Product";
import { connectToDB } from "@/lib/mongoDB";
import { NextRequest, NextResponse } from "next/server";

// GET: lấy sản phẩm từ tham số(params) chứa productId của sản phẩm hiện tại mà người dùng đang xem.
export const GET = async (req: NextRequest, { params }: { params: { productId: string } }) => {
  try {
    await connectToDB()

    // Tìm kiếm sản phẩm hiện tại theo productId
    const product = await Product.findById(params.productId)

    // Nếu không tìm thấy sản phẩm, trả về thông báo lỗi 404.
    if (!product) {
      return new NextResponse(JSON.stringify({ message: "Không tìm thấy sản phẩm" }), { status: 404 })
    }

    // Tìm kiếm các sản phẩm liên quan
    // Tìm kiếm các sản phẩm có cùng category(loại) or cùng collections(bộ sưu tập)
    const relatedProducts = await Product.find({
      $or: [
        { category: product.category },
        { collections: { $in: product.collections }}
      ],
      _id: { $ne: product._id } // loại bỏ sản phẩm hiện tại khỏi danh sách kết quả.
    })

    // Nếu không tìm thấy sản phẩm nào, trả về thông báo lỗi 404.
    if (!relatedProducts) {
      return new NextResponse(JSON.stringify({ message: "Không tìm thấy sản phẩm liên quan" }), { status: 404 })
    }
    // Nếu tìm thấy các sản phẩm liên quan, trả về trạng thái 200.
    return NextResponse.json(relatedProducts, { status: 200 })

    // Xử lý lỗi máy chủ
  } catch (err) {
    console.log("[related_GET", err)
    return new NextResponse("lỗi máy chủ nội bộ", { status: 500 })
  }
}

export const dynamic = "force-dynamic";
