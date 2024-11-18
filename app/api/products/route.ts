
import { NextRequest, NextResponse } from "next/server";

import { connectToDB } from "@/lib/mongoDB";
import Product from "@/lib/models/Product";
import Collection from "@/lib/models/Collection";
import { auth } from "@clerk/nextjs/server";

// 2.POST : tạo mới một product
export const POST = async (req: NextRequest) => {
  try {
    const { userId } = auth(); 

    if (!userId) {
      return new NextResponse("Người dùng chưa đăng nhập tài khoản", { status: 401 });
    }

    await connectToDB();
    // Lấy thông tin (title,description,...)
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

    if (!title || !description || !media || !category || !price || !expense) {
      return new NextResponse("Không đủ dữ liệu để tạo ra sản phẩm", {
        status: 400,
      });
    }

     // Tạo một Product mới 
    const newProduct = await Product.create({
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
    });
    // Lưu Product mới vào cơ sở dữ liệu.
    await newProduct.save();

    // Lưu sản phẩm vào bộ sưa tập nếu có IdCollection tương ứng
    if (collections) {
      for (const collectionId of collections) {
        const collection = await Collection.findById(collectionId);
        if (collection) {
          collection.products.push(newProduct._id);
          await collection.save();
        }
      }
    }

    return NextResponse.json(newProduct, { status: 200 });
  } catch (err) {
    console.log("[products_POST]", err);
    return new NextResponse("Lỗi nội bộ", { status: 500 });
  }
};





// 1.GET : lấy danh sách các Product 
export const GET = async (req: NextRequest) => {
  try {
    await connectToDB();

    // Lấy toàn bộ các product từ cơ sở dữ liệu và sắp xếp theo thứ tự từ mới nhất đến cũ nhất 
    const products = await Product.find()
      .sort({ createdAt: "desc" })
      .populate({ path: "collections", model: Collection });

        // nếu thành công: trả trạng thái 200
    return NextResponse.json(products, { status: 200 });
  } catch (err) {
    console.log("[products_GET]", err);
    return new NextResponse("Lỗi nội bộ", { status: 500 });
  }
};

export const dynamic = "force-dynamic";

