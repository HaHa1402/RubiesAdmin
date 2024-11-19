// import Customer from "@/lib/models/Customer";
// import Order from "@/lib/models/Order";
// import { connectToDB } from "@/lib/mongoDB";

// import { NextRequest, NextResponse } from "next/server";
// import { format } from "date-fns";

// export const GET = async (req: NextRequest) => {
//   try {
//     await connectToDB()

//     const orders = await Order.find().sort({ createdAt: "desc" })

//     const orderDetails = await Promise.all(orders.map(async (order) => {
//       const customer = await Customer.findOne({ clerkId: order.customerClerkId })
//       return {
//         _id: order._id,
//         customer: customer.name,
//         products: order.products.length,
//         totalAmount: order.totalAmount,
//         createdAt: format(order.createdAt, "MMM do, yyyy")
//       }
//     }))

//     return NextResponse.json(orderDetails, { status: 200 });
//   } catch (err) {
//     console.log("[orders_GET]", err)
//     return new NextResponse("Internal Server Error", { status: 500 });
//   }
// }

// export const dynamic = "force-dynamic";





import Customer from "@/lib/models/Customer";
import Order from "@/lib/models/Order";
import { connectToDB } from "@/lib/mongoDB";
import { NextRequest, NextResponse } from "next/server";
import { format } from "date-fns";
import { vi } from "date-fns/locale"; // Import locale tiếng Việt

export const GET = async (req: NextRequest) => {
  try {
    await connectToDB();

    const orders = await Order.find().sort({ createdAt: "desc" });

    const orderDetails = await Promise.all(
      orders.map(async (order) => {
        const customer = await Customer.findOne({
          clerkId: order.customerClerkId,
        });

      
        const formattedTotalAmount = new Intl.NumberFormat("vi-VN", {
          style: "currency",
          currency: "VND",
        }).format(order.totalAmount * 100); 
        // Định dạng thời gian theo tiếng Việt
        const formattedDate = format(order.createdAt, "PPP", { locale: vi });

        return {
          _id: order._id,
          customer: customer.name,
          products: order.products.length,
          totalAmount: formattedTotalAmount, // Giá tiền đã định dạng
          createdAt: formattedDate, // Thời gian đã định dạng
        };
      })
    );

    return NextResponse.json(orderDetails, { status: 200 });
  } catch (err) {
    console.log("[orders_GET]", err);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};

export const dynamic = "force-dynamic";
