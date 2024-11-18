import SalesChart from "@/components/custom ui/SalesChart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  getSalesPerMonth,
  getTotalCustomers,
  getTotalSales,
} from "@/lib/actions/actions";
import { CircleDollarSign, ShoppingBag, UserRound } from "lucide-react";

import { UserButton } from "@clerk/nextjs";

export default async function Home() {
    // getTotalSales: Gọi API lấy dữ liệu tổng doanh thu và tổng số đơn hàng.
    const totalRevenue = await getTotalSales().then((data) => data.totalRevenue);
    // Gọi API để lấy tổng số đơn hàng 
    const totalOrders = await getTotalSales().then((data) => data.totalOrders);
    // Gọi API để lấy tổng số khách hàng.
    const totalCustomers = await getTotalCustomers();
    // Gọi API để lấy dữ liệu biểu đồ doanh số theo tháng.
    const graphData = await getSalesPerMonth();

  return (
    <div className="px-8 py-10">
      <p className="text-heading2-bold">Thống kê</p>
      <Separator className="bg-grey-1 my-5" />

      <div className="grid grid-cols-2 md:grid-cols-3 gap-10">
        <Card>
          <CardHeader className="flex flex-row justify-between items-center">
            <CardTitle>Tổng doanh thu</CardTitle>
            <CircleDollarSign className="max-sm:hidden" />
          </CardHeader>
          <CardContent>
            <p className="text-body-bold"> {totalRevenue} (đ)</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row justify-between items-center">
            <CardTitle>Tổng số đơn hàng</CardTitle>
            <ShoppingBag className="max-sm:hidden" />
          </CardHeader>
          <CardContent>
            <p className="text-body-bold">{totalOrders}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row justify-between items-center">
            <CardTitle>Tổng số khách hàng</CardTitle>
            <UserRound className="max-sm:hidden" />
          </CardHeader>
          <CardContent>
            <p className="text-body-bold">{totalCustomers}</p>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-10">
        <CardHeader>
          <CardTitle>Biểu đồ doanh thu (Đ)</CardTitle>
        </CardHeader>
        <CardContent>
          <SalesChart data={graphData} />
        </CardContent>
      </Card>
    </div>
  );
}

// import { UserButton } from "@clerk/nextjs";
// export default async function Home() {
//   return(
//     <div>
//       <UserButton/>
//     </div>
//   );
// }