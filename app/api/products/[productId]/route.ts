import Collection from "@/lib/models/Collection";
import Product from "@/lib/models/Product";
import { connectToDB } from "@/lib/mongoDB";
import { auth } from "@clerk/nextjs/server";


import { NextRequest, NextResponse } from "next/server";

// 1. GET - Lấy thông tin của một sản phẩm
export const GET = async (
  req: NextRequest,
  { params }: { params: { productId: string } }
) => {
  try {
    await connectToDB();

    // Tìm kiếm sản phẩm bằng productId và populate để lấy thông tin các bộ sưu tập liên quan (collections).
    const product = await Product.findById(params.productId).populate({
      path: "collections",
      model: Collection,
    });

    // Nếu không tìm thấy sản phẩm, trả về mã lỗi 404.
    if (!product) {
      return new NextResponse(
        JSON.stringify({ message: "Không tìm thấy sản phẩm" }),
        { status: 404 }
      );
    }
    // Trả về sản phẩm dưới dạng JSON nếu thành công
    return new NextResponse(JSON.stringify(product), {
      status: 200,
      headers: {
        "Access-Control-Allow-Origin": `${process.env.ECOMMERCE_STORE_URL}`,
        "Access-Control-Allow-Methods": "GET",
        "Access-Control-Allow-Headers": "Content-Type",
      },
    });
  } catch (err) {
    console.log("[productId_GET]", err);
    return new NextResponse("internal error:lỗi nội bộ", { status: 500 });
  }
};

// 2.POST - Cập nhật thông tin sản phẩm
export const POST = async (
  req: NextRequest,
  { params }: { params: { productId: string } }
) => {
  try {
    // Xác thực người dùng 
    const { userId } = auth();

    // nếu người dùng chưa đăng nhập trả về lỗi 401
    if (!userId) {
      return new NextResponse("Yêu cầu xác thực người dùng", { status: 401 });
    }

    await connectToDB();

    // Tìm kiếm product theo productId.
    const product = await Product.findById(params.productId);

    // Nếu không tìm thấy product
    if (!product) {
      return new NextResponse(
        JSON.stringify({ message: "Không tìm thấy sản phẩm" }),
        { status: 404 }
      );
    }

    // Lấy dữ liệu từ yêu cầu POST bao gồm các trường như title, description, media, category, collections, tags, sizes, colors, price, và expense.
    const {
      title,
      description,
      media,
      category,
      collections,
      tags,
      sizes,
      colors,
      price,
      expense,
    } = await req.json();

    // Kiểm tra các trường người dùng có điền thiếu k
    if (!title || !description || !media || !category || !price || !expense) {
      return new NextResponse("Không đủ dữ liệu để tạo sản phẩm mới", {
        status: 400,
      });
    }

    // *thêm sản phẩm -> thêm sản phẩm vào các bộ sưu tập mới 
    const addedCollections = collections.filter(
      (collectionId: string) => !product.collections.includes(collectionId)
    );

    //* Xoá sản phẩm->loại bỏ sản phẩm đó khỏi bộ sưu tập
    const removedCollections = product.collections.filter(
      (collectionId: string) => !collections.includes(collectionId)
    );
   
    // sửa lại bộ sưu tập
    await Promise.all([
      // Cập nhật: thêm sản phẩm ở trong bộ sưu tập đó
      ...addedCollections.map((collectionId: string) =>
        Collection.findByIdAndUpdate(collectionId, {
          $push: { products: product._id },
        })
      ),

      // Cập nhật: xoá sản phẩm ở trong bộ sưu tập đó
      ...removedCollections.map((collectionId: string) =>
        Collection.findByIdAndUpdate(collectionId, {
          $pull: { products: product._id },
        })
      ),
    ]);

    // Update product
    const updatedProduct = await Product.findByIdAndUpdate(
      product._id,
      {
        title,
        description,
        media,
        category,
        collections,
        tags,
        sizes,
        colors,
        price,
        expense,
      },
      { new: true }
    ).populate({ path: "collections", model: Collection });

    await updatedProduct.save();

    return NextResponse.json(updatedProduct, { status: 200 });
  } catch (err) {
    console.log("[productId_POST]", err);
    return new NextResponse("Internal error", { status: 500 });
  }
};

// 3. DELETE - Xóa bộ sưu tập
export const DELETE = async (
  req: NextRequest,
  { params }: { params: { productId: string } }
) => {
  try {
     // Xác thực người dùng, nếu chưa đăng nhập trả về 401 
    const { userId } = auth();
    if (!userId) {
      return new NextResponse("Người dùng chưa đăng nhập tài khoản", { status: 401 });
    }

    await connectToDB();

    const product = await Product.findById(params.productId);

    if (!product) {
      return new NextResponse(
        JSON.stringify({ message: "không tìm thấy sản phẩm" }),
        { status: 404 }
      );
    }
  // Xóa Product theo ProductId.
    await Product.findByIdAndDelete(product._id);

    // Sau khi xóa Collection, cũng cập nhật các sản phẩm liên quan
    await Promise.all(
      product.collections.map((collectionId: string) =>
        Collection.findByIdAndUpdate(collectionId, {
          $pull: { products: product._id },
        })
      )
    );

    return new NextResponse(JSON.stringify({ message: "Sản phẩm đã xóa" }), {
      status: 200,
    });
  } catch (err) {
    console.log("[productId_DELETE]", err);
    return new NextResponse("lỗi nội bộ", { status: 500 });
  }
};

export const dynamic = "force-dynamic";

