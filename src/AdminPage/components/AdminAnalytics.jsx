import React, { useState } from "react";
import {
  TrendingUp,
  Users,
  ShoppingCart,
  DollarSign,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";

const AdminAnalytics = () => {
  const [timeframe, setTimeframe] = useState("week");

  const salesData = [
    { day: "Mon", sales: 4200, users: 45 },
    { day: "Tue", sales: 3800, users: 38 },
    { day: "Wed", sales: 5100, users: 52 },
    { day: "Thu", sales: 4600, users: 48 },
    { day: "Fri", sales: 6200, users: 65 },
    { day: "Sat", sales: 7800, users: 82 },
    { day: "Sun", sales: 5900, users: 61 },
  ];

  const topProducts = [
    { name: "Classical Dance Course", sales: 156, revenue: "Rs. 1,24,800" },
    { name: "Madal (Traditional Drum)", sales: 89, revenue: "Rs. 3,11,500" },
    { name: "Nepali Dhaka Topi", sales: 234, revenue: "Rs. 1,17,000" },
    { name: "Sarangi Lessons", sales: 67, revenue: "Rs. 5,36,000" },
  ];

  const maxSales = Math.max(...salesData.map((d) => d.sales));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              Analytics & Insights
            </h2>
            <p className="text-gray-600 mt-1">
              Track your platform performance
            </p>
          </div>
          <div className="flex gap-2">
            {["day", "week", "month", "year"].map((period) => (
              <button
                key={period}
                onClick={() => setTimeframe(period)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  timeframe === period
                    ? "bg-gray-900 text-white shadow-sm"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}>
                {period.charAt(0).toUpperCase() + period.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          {
            title: "Total Revenue",
            value: "Rs. 4,56,789",
            change: "+23%",
            positive: true,
            icon: DollarSign,
          },
          {
            title: "Total Sales",
            value: "1,234",
            change: "+18%",
            positive: true,
            icon: ShoppingCart,
          },
          {
            title: "New Users",
            value: "456",
            change: "+12%",
            positive: true,
            icon: Users,
          },
          {
            title: "Growth Rate",
            value: "24.5%",
            change: "-2%",
            positive: false,
            icon: TrendingUp,
          },
        ].map((metric, i) => {
          const Icon = metric.icon;
          return (
            <div
              key={i}
              className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-600 mb-1">
                    {metric.title}
                  </p>
                  <h3 className="text-2xl font-bold text-gray-900">
                    {metric.value}
                  </h3>
                </div>
                <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center">
                  <Icon className="text-gray-700" size={24} />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span
                  className={`flex items-center gap-1 text-sm font-semibold ${
                    metric.positive ? "text-green-600" : "text-red-600"
                  }`}>
                  {metric.positive ? (
                    <ArrowUpRight size={16} />
                  ) : (
                    <ArrowDownRight size={16} />
                  )}
                  {metric.change}
                </span>
                <span className="text-xs text-gray-500">vs last period</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sales Chart */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <h3 className="text-lg font-bold text-gray-900 mb-6">
            Sales Overview
          </h3>
          <div className="space-y-4">
            {salesData.map((item, i) => (
              <div key={i} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium text-gray-700">{item.day}</span>
                  <span className="font-bold text-gray-900">
                    Rs. {item.sales.toLocaleString()}
                  </span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-3">
                  <div
                    className="bg-gradient-to-r from-gray-700 to-gray-900 h-3 rounded-full transition-all"
                    style={{ width: `${(item.sales / maxSales) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Products */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <h3 className="text-lg font-bold text-gray-900 mb-6">
            Top Performing Products
          </h3>
          <div className="space-y-3">
            {topProducts.map((product, i) => (
              <div
                key={i}
                className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <div className="w-10 h-10 rounded-lg bg-gray-900 text-white flex items-center justify-center font-bold">
                  {i + 1}
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{product.name}</p>
                  <p className="text-sm text-gray-600">{product.sales} sales</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-gray-900">{product.revenue}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* User Activity */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
        <h3 className="text-lg font-bold text-gray-900 mb-6">
          User Activity This Week
        </h3>
        <div className="grid grid-cols-7 gap-2">
          {salesData.map((item, i) => (
            <div key={i} className="text-center">
              <p className="text-xs font-medium text-gray-600 mb-2">
                {item.day}
              </p>
              <div className="relative h-32 bg-gray-100 rounded-lg overflow-hidden">
                <div
                  className="absolute bottom-0 w-full bg-gradient-to-t from-gray-700 to-gray-500 transition-all"
                  style={{ height: `${(item.users / 82) * 100}%` }}
                />
              </div>
              <p className="text-sm font-bold text-gray-900 mt-2">
                {item.users}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminAnalytics;
