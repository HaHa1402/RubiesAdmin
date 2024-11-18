// route để thao tác với 1 collection cụ thể, thông qua collectionId động được truyền trong URL.

import { NextRequest, NextResponse } from "next/server";


import { connectToDB } from "@/lib/mongoDB";
import Collection from "@/lib/models/Collection";
import Product from "@/lib/models/Product";
import { auth } from "@clerk/nextjs/server";

// 1.GET:lấy thông tin của 1 Collection dựa trên collectionId.
export const GET = async (
  req: NextRequest,
  { params }: { params: { collectionId: string } }
) => {
  try {
    // Kết nối tới cơ sở dữ liệu.
    await connectToDB();
    // Tìm kiếm Collection theo collectionId và populate(lấy chi tiết) thông tin của các sản phẩm (products) liên quan.
    const collection = await Collection.findById(params.collectionId).populate({ path: "products", model: Product });

    // Nếu không tìm thấy Collection
    if (!collection) {
      return new NextResponse(
        JSON.stringify({ message: "Không tìm thấy bộ sưu tập" }),
        { status: 404 }
      );
    }

    // Nếu thành công, trả về Collection 
    return NextResponse.json(collection, { status: 200 });
  } 
  // Bắt lỗi
    catch (err) {
    console.log("[collectionId_GET]", err);
    return new NextResponse("Internal error", { status: 500 });
  }
};




// 2: POST : Cập nhật Collection với dữ liệu mới.
export const POST = async (
  req: NextRequest,
  { params }: { params: { collectionId: string } }
) => {
  try {
    // Xác thực người dùng: Lấy thông tin userId từ phiên đăng nhập.
    const { userId } = auth();

    // Nếu người dùng chưa đăng nhập
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Kết nối tới cơ sở dữ liệu.
    await connectToDB();

    // Tìm kiếm Collection theo collectionId.
    let collection = await Collection.findById(params.collectionId);

    // Nếu không tìm thấy Collection
    if (!collection) {
      return new NextResponse("Không tìm thấy bộ sưu tập", { status: 404 });
    }

    // Lấy dữ liệu từ yêu cầu POST, bao gồm title, description, và image.
    const { title, description, image } = await req.json();

    // Kiểm tra xem title và image có được cung cấp không.. Nếu thiếu, trả về phản hồi 400
    if (!title || !image) {
      return new NextResponse("Title và image là bắt buộc", { status: 400 });
    }

    // Cập nhật Collection với các thông tin mới 
    collection = await Collection.findByIdAndUpdate(
      params.collectionId,
      { title, description, image },
      { new: true }
    );

    // Lưu Collection sau khi cập nhật.
    await collection.save();

    // Nếu thành công, trả về Collection đã cập nhật dưới dạng JSON. Nếu lỗi, ghi log và trả về 500
    return NextResponse.json(collection, { status: 200 });
  } catch (err) {
    console.log("[collectionId_POST]", err);return new NextResponse("Lỗi nội bộ", { status: 500 });
  }
};




// 3.DELETE : xóa một Collection theo collectionId và cập nhật các sản phẩm liên quan.
export const DELETE = async (
  req: NextRequest,
  { params }: { params: { collectionId: string } }
) => {
  try {
    // Xác thực người dùng, nếu không có userId, trả về 401 
    const { userId } = auth();
    if (!userId) {
      return new NextResponse("Yêu cầu xác thực người dùng", { status: 401 });
    }

    // Kết nối tới cơ sở dữ liệu.
    await connectToDB();

    // Xóa Collection theo collectionId.
    await Collection.findByIdAndDelete(params.collectionId);

    // Xoá collection -> xoá lun collection đó trong sản phẩm
    await Product.updateMany(
      { collections: params.collectionId },
      { $pull: { collections: params.collectionId } }
    );
    
    // Nếu thành công
    return new NextResponse("Bộ sưu tập đã bị xoá", { status: 200 });
    // Nếu lỗi
  } catch (err) {
    console.log("[collectionId_DELETE]", err);
    return new NextResponse("lỗi nội bộ", { status: 500 });
  }
};

// Bắt buộc route này phải được render động.
export const dynamic = "force-dynamic";