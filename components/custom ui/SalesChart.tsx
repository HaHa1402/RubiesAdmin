"use client";

import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";

// Hàm định dạng tiền Việt
const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(value);
};

const SalesChart = ({ data }: { data: any[] }) => {
  return (
    <ResponsiveContainer width="100%" height={380}>
      <LineChart className="w-full h-full" data={data} margin={{ top: 5, right: 20, bottom: 5, left: 40 }}>
        <Line type="monotone" dataKey="sales" stroke="#8884d8" />
        <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
        <XAxis dataKey="name" />
        <YAxis
          tickFormatter={(value) => formatCurrency(value)} // Định dạng giá trị trục Y
        />
        <Tooltip
          formatter={(value: number) => formatCurrency(value)} // Định dạng giá trị trong tooltip
          labelFormatter={(label: string) => `Tháng: ${label}`} // Tùy chỉnh nhãn trong tooltip
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default SalesChart;
