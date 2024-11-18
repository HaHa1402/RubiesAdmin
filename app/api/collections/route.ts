// Route dùng để làm việc với danh sách các collections, chứ không phải một collection cụ thể.
import { connectToDB } from "@/lib/mongoDB";
import { NextRequest, NextResponse } from "next/server";
import Collection from "@/lib/models/Collection";
import { auth } from "@clerk/nextjs/server";


// 2.POST : tạo mới một collection
export const POST = async (req: NextRequest) => {
  try {
    // Xác thực người dùng qua phương thức auth().
    const { userId } = auth()
    // nếu người dùng chưa đăng nhập, trả về 403
    if (!userId) {
      return new NextResponse("Người dùng chưa đăng nhập tài khoản", { status: 403 })
    }

    // Kết nối tới cơ sở dữ liệu.
    await connectToDB()

    // Lấy thông tin của title, description, và image từ phần thân yêu cầu req (được gửi từ phía client).
    const { title, description, image } = await req.json()

    // Kiểm tra xem trong cơ sở dữ liệu :title mới gửi có bị trùng lặp vs title cũ nào k
    const existingCollection = await Collection.findOne({ title })

    if (existingCollection) {
      return new NextResponse("Bộ sưu tập đã tồn tại", { status: 400 })
    }

    // Nếu thiếu title hoặc image, trả về 400
    if (!title || !image) {
      return new NextResponse("Tiêu đề và hình ảnh là bắt buộc", { status: 400 })
    }

    // Tạo một "collection" mới với dữ liệu title, description, và image.
    const newCollection = await Collection.create({
      title,
      description,
      image,
    })

    // Lưu "collection" mới vào cơ sở dữ liệu.
    await newCollection.save()

    // nếu thành công: có bộ sưu tập mới và trả về trạng thái 200
    return NextResponse.json(newCollection, { status: 200 })
    // nếu thất bại
  } catch (err) {
    console.log("[collections_POST]", err)
    return new NextResponse("Lỗi máy chủ nội bộ", { status: 500 })
  }
}






// 1.GET : lấy danh sách các "collections".
export const GET = async (req: NextRequest) => {
  try {
    // Kết nối tới cơ sở dữ liệu.
    await connectToDB()

    // Lấy toàn bộ các "collection" từ cơ sở dữ liệu và sắp xếp theo thứ tự từ mới nhất đến cũ nhất 
    const collections = await Collection.find().sort({ createdAt: "desc" })

    // nếu thành công: trả trạng thái 200
    return NextResponse.json(collections, { status: 200 })
    // nếu thất bại: trả trạng thái 500
  } catch (err) {
    console.log("[collections_GET]", err)
    return new NextResponse("Lỗi máy chủ nội bộ", { status: 500 })
  }
}




// Đặt route này luôn được render động (force-dynamic),
//  tức là dữ liệu sẽ luôn được cập nhật mỗi khi có yêu cầu từ phía người dùng.
export const dynamic = "force-dynamic";