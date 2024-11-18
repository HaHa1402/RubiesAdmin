import Customer from "../models/Customer";
import Order from "../models/Order";
import { connectToDB } from "../mongoDB";

// Tính tổng số đơn hàng và tổng doanh thu từ các đơn hàng.
export const getTotalSales = async () => {
  await connectToDB();
  // Lấy danh sách đơn hàng
  const orders = await Order.find();
  // Tính tổng số lượng đơn hàng
  const totalOrders = orders.length;
  // Tính tổng doanh thu
  const totalRevenue = orders.reduce((acc, order) => acc + order.totalAmount, 0);
  return { totalOrders, totalRevenue };
};

// Đếm tổng số khách hàng.
export const getTotalCustomers = async () => {
  await connectToDB();
  const customers = await Customer.find();
  // Đếm tổng số khách hàng
  const totalCustomers = customers.length;
  return totalCustomers;
};

// Tính tổng doanh thu theo từng tháng trong năm.
export const getSalesPerMonth = async () => {
  await connectToDB();
  const orders = await Order.find();

  // Tính doanh thu theo tháng(x)
  const salesPerMonth = orders.reduce((acc, order) => {
    const monthIndex = new Date(order.createdAt).getMonth();
    acc[monthIndex] = (acc[monthIndex] || 0) + order.totalAmount;
    // acc[monthIndex] = (acc[monthIndex] || 0) + 1;
    return acc;
  }, {});

  // Tạo dữ liệu dạng biểu đồ(y)
  const graphData = Array.from({ length: 12 }, (_, i) => {
    const month = new Intl.DateTimeFormat('vi-VN', { month: 'long' }).format(new Date(0, i));
    // Tháng sẽ hiển thị dưới dạng: "Tháng Một", "Tháng Hai", ...
    return { name: month.charAt(0).toUpperCase() + month.slice(1), sales: salesPerMonth[i] || 0 };
  });

  return graphData;
};
