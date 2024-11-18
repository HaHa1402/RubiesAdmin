// cho phép hệ thống lưu đơn hàng vào cơ sở dữ liệu MongoDB khi quá trình thanh toán của khách hàng hoàn tất trên Stripe
import Customer from "@/lib/models/Customer";
import Order from "@/lib/models/Order";
import { connectToDB } from "@/lib/mongoDB";
import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";

export const POST = async (req: NextRequest) => {
  try {
    const rawBody = await req.text()
    const signature = req.headers.get("Stripe-Signature") as string

    // Xác Thực Webhook từ Stripe
    const event = stripe.webhooks.constructEvent(
      rawBody,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    ) 

    // Nếu sự kiện là "checkout.session.completed", nghĩa là khách hàng đã hoàn tất thanh toán, thì đoạn mã tiếp tục xử lý.
    if (event.type === "checkout.session.completed") {
      const session = event.data.object

      // Lấy Thông Tin Khách Hàng
      const customerInfo = {
        clerkId: session?.client_reference_id,
        name: session?.customer_details?.name,
        email: session?.customer_details?.email,
      }
      // Lấy Địa Chỉ Giao Hàng
      const shippingAddress = {
        street: session?.shipping_details?.address?.line1,
        city: session?.shipping_details?.address?.city,
        state: session?.shipping_details?.address?.state,
        postalCode: session?.shipping_details?.address?.postal_code,
        country: session?.shipping_details?.address?.country,
      }

      // Lấy Danh Sách Sản Phẩm từ Session
      const retrieveSession = await stripe.checkout.sessions.retrieve(
        session.id,
        { expand: ["line_items.data.price.product"]}
      )

      const lineItems = await retrieveSession?.line_items?.data

      const orderItems = lineItems?.map((item: any) => {
        return {
          product: item.price.product.metadata.productId,
          color: item.price.product.metadata.color || "N/A",
          size: item.price.product.metadata.size || "N/A",
          quantity: item.quantity,
        }
      })

      // Kết Nối và Lưu Đơn Hàng vào Cơ Sở Dữ Liệu
      await connectToDB()

      // Tạo một đối tượng newOrder gồm(customerClerkId, products, shippingAddress, shippingRate, và totalAmoun)
      const newOrder = new Order({
        customerClerkId: customerInfo.clerkId,
        products: orderItems,
        shippingAddress,
        shippingRate: session?.shipping_cost?.shipping_rate,
        totalAmount: session.amount_total ? session.amount_total / 100 : 0,
      })

      // lưu đối tượng newOrder vào cơ sở dữ liệu.
      await newOrder.save()

      // Kiểm Tra và Cập Nhật Khách Hàng
      // Tìm Customer theo clerkId. Nếu tìm thấy, thêm newOrder._id vào mảng orders của khách hàng.
      let customer = await Customer.findOne({ clerkId: customerInfo.clerkId })

      // Nếu khách hàng chưa tồn tại, tạo một bản ghi mới trong Customer với thông tin khách hàng và đơn hàng đầu tiên.
      if (customer) {
        customer.orders.push(newOrder._id)
      } else {
        customer = new Customer({
          ...customerInfo,
          orders: [newOrder._id],
        })
      }
      // lưu khách hàng vào cơ sở dữ liệu
      await customer.save()
    }

    return new NextResponse("Đã tạo đơn hàng", { status: 200 })
  } catch (err) {
    console.log("[webhooks_POST]", err)
    return new NextResponse("Không tạo được đơn hàng", { status: 500 })
  }
}