// xử lý thanh toán sử dụng Stripe để tạo phiên thanh toán (checkout session) dựa trên giỏ hàng của khách hàng (cartItems) và thông tin khách hàng (customer).
import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";

// cho phép ứng dụng chấp nhận các yêu cầu từ các nguồn khác nhau
const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export async function OPTIONS() {
    return NextResponse.json({}, { headers: corsHeaders });
}

// Hàm POST xử lý yêu cầu thanh toán
export async function POST(req: NextRequest) {
    try {
        // lấy dữ liệu tcartItems,customer dưới dạng JSON
        const { cartItems, customer } = await req.json();

        if (!cartItems || !customer) {
            return new NextResponse("Không đủ dữ liệu để kiểm tra", { status: 400 });
        }

        // Tạo phiên thanh toán với Stripe
        const session = await stripe.checkout.sessions.create({
            // chỉ cho phép thanh toán qua thẻ.
            payment_method_types: ["card"],
            //   ở chế độ thanh toán (payment).
            mode: "payment",
            shipping_address_collection: {
                // chỉ chấp nhận địa chỉ từ Hoa Kỳ (US) 
                allowed_countries: ["US", "VN"],
            },
            //   chỉ định các mức phí vận chuyển bằng ID của chúng trong Stripe.
            shipping_options: [
                { shipping_rate: "shr_1QKDOgEbPMNnd0toF9xnXtRG" },
                { shipping_rate: "shr_1QKDOJEbPMNnd0toLbERjpea" },
                { shipping_rate: "shr_1QKDNtEbPMNnd0to2iq04yIH" },
                { shipping_rate: "shr_1QKDN5EbPMNnd0tojLiBuqFg" },

            ],


            // Tạo danh sách sản phẩm thanh toán:
            line_items: cartItems.map((cartItem: any) => {
                // Kiểm tra xem giá trị price có phải là số không
                if (typeof cartItem.item.price !== "number") {
                    throw new Error("Giá trị price phải là số.");
                }

                return {
                    price_data: {
                        currency: "vnd",
                        // chứa tên và thông tin bổ sung như kích cỡ, màu sắc.
                        product_data: {
                            name: cartItem.item.title,
                            metadata: {
                                productId: cartItem.item._id,
                                ...(cartItem.size && { size: cartItem.size }),
                                ...(cartItem.color && { color: cartItem.color }),
                            },
                        },
                        unit_amount: Math.round(cartItem.item.price*1 ), // làm tròn để tránh lỗi
                    },
                    quantity: cartItem.quantity,
                };
            }),

            // Thêm thông tin khách hàng và URL chuyển hướng:
            client_reference_id: customer.clerkId,
            success_url: `${process.env.ECOMMERCE_STORE_URL}/payment_success`,
            cancel_url: `${process.env.ECOMMERCE_STORE_URL}/cart`,
        });

        return NextResponse.json(session, { headers: corsHeaders });
    } catch (err) {
        console.log("[checkout_POST]", err);
        return new NextResponse("Lỗi máy chủ nội bộ", { status: 500 });
    }
}











// import { NextRequest, NextResponse } from "next/server";
// import { stripe } from "@/lib/stripe";

// const corsHeaders = {
//   "Access-Control-Allow-Origin": "*",
//   "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
//   "Access-Control-Allow-Headers": "Content-Type, Authorization",
// };

// export async function OPTIONS() {
//   return NextResponse.json({}, { headers: corsHeaders });
// }

// export async function POST(req: NextRequest) {
//   try {
//     const { cartItems, customer } = await req.json();

//     if (!cartItems || !customer) {
//       return new NextResponse("Not enough data to checkout", { status: 400 });
//     }

//     const session = await stripe.checkout.sessions.create({
//       payment_method_types: ["card"],
//       mode: "payment",
//       shipping_address_collection: {
//         allowed_countries: ["US", "VN"],
//       },
//       shipping_options: [
//         // { shipping_rate: "shr_1QKOhh2LUAJfTfxste1qqHou" },
//         // { shipping_rate: "shr_1QKOj92LUAJfTfxsuv2tTN9M" },
//         // { shipping_rate: "shr_1QKOjx2LUAJfTfxsMQIziOsd" },

//         { shipping_rate: "shr_1QKDOJEbPMNnd0toLbERjpea" },
//         { shipping_rate: "shr_1QKDNtEbPMNnd0to2iq04yIH" },
//         { shipping_rate: "shr_1QKDN5EbPMNnd0tojLiBuqFg" },
//       ],
//       line_items: cartItems.map((cartItem: any) => ({
//         price_data: {
//           currency: "vnd",
//           product_data: {
//             name: cartItem.item.title,
//             metadata: {
//               productId: cartItem.item._id,
//               ...(cartItem.size && { size: cartItem.size }),
//               ...(cartItem.color && { color: cartItem.color }),
//             },
//           },
//           unit_amount: cartItem.item.price * 1,
//         },
//         quantity: cartItem.quantity,
//       })),
//       client_reference_id: customer.clerkId,
//       success_url: `${process.env.ECOMMERCE_STORE_URL}/payment_success`,
//       cancel_url: `${process.env.ECOMMERCE_STORE_URL}/cart`,
//     });

//     return NextResponse.json(session, { headers: corsHeaders });
//   } catch (err) {
//     console.log("[checkout_POST]", err);
//     return new NextResponse("Internal Server Error", { status: 500 });
//   }
// }