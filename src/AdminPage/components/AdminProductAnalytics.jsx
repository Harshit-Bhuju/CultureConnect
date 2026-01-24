import React from "react";
import {
  DollarSign,
  ShoppingCart,
  Users2,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";

export const AdminProductAnalytics = ({ data, timeframe }) => {
  const {
    salesData = [],
    topProducts = [],
    metrics = {}
  } = data || {};

  const totalRevenue = metrics?.totalRevenue || 0;
  const totalSales = metrics?.totalSales || 0;
  const activeSellers = metrics?.activeSellers || 0;

  const maxSales = salesData.length > 0 ? Math.max(...salesData.map((d) => parseFloat(d.sales) || 0)) : 0;

  return (
    <div className="space-y-6">
      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          {
            title: "Total Product Revenue",
            value: `Rs. ${parseFloat(totalRevenue).toLocaleString()}`,
            change: metrics?.growthChange || "+0%",
            positive: metrics?.growthPositive !== false,
            icon: DollarSign,
          },
          {
            title: "Product Sales",
            value: totalSales.toString(),
            change: metrics?.growthChange || "+0%",
            positive: metrics?.growthPositive !== false,
            icon: ShoppingCart,
          },
          {
            title: "Active Sellers",
            value: activeSellers.toString(),
            change: metrics?.sellerGrowthChange || "+0%",
            positive: metrics?.sellerGrowthPositive !== false,
            icon: Users2,
          },
        ].map((metric, i) => {
          const Icon = metric.icon;
          return (
            <div
              key={i}
              className="bg-white rounded-xl shadow-sm p-6 border border-gray-200 hover:border-gray-300 transition-colors">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">
                    {metric.title}
                  </p>
                  <h3 className="text-2xl font-extrabold text-gray-900">
                    {metric.value}
                  </h3>
                </div>
                <div className="w-12 h-12 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center text-gray-700">
                  <Icon size={24} />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span
                  className={`flex items-center gap-1 text-sm font-bold ${metric.positive ? "text-green-600" : "text-red-600"
                    }`}>
                  {metric.positive ? (
                    <ArrowUpRight size={16} />
                  ) : (
                    <ArrowDownRight size={16} />
                  )}
                  {metric.change}
                </span>
                <span className="text-xs text-gray-400 font-medium">
                  vs last period
                </span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sales Chart */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <h3 className="text-lg font-bold text-gray-900 mb-8 border-b border-gray-100 pb-4">
            Sales Performance
          </h3>
          <div className="space-y-6">
            {salesData.length > 0 ? salesData.map((item, i) => (
              <div key={i} className="group">
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="font-bold text-gray-500">{item.day}</span>
                  <span className="font-extrabold text-gray-900">
                    Rs. {parseFloat(item.sales).toLocaleString()}
                  </span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-4 overflow-hidden">
                  <div
                    className="h-full bg-gray-900 rounded-full transition-all duration-1000 ease-out"
                    style={{ width: `${maxSales > 0 ? (parseFloat(item.sales) / maxSales) * 100 : 0}%` }}
                  />
                </div>
              </div>
            )) : (
              <p className="text-center text-gray-400 py-10">No sales data for this period</p>
            )}
          </div>
        </div>

        {/* Top Products */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <h3 className="text-lg font-bold text-gray-900 mb-8 border-b border-gray-100 pb-4">
            Top Selling Products
          </h3>
          <div className="space-y-4">
            {topProducts.length > 0 ? topProducts.map((item, i) => (
              <div
                key={i}
                className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl hover:bg-white hover:shadow-md border border-transparent hover:border-gray-200 transition-all cursor-default">
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center font-black text-lg ${i === 0
                    ? "bg-yellow-100 text-yellow-700"
                    : i === 1
                      ? "bg-gray-200 text-gray-700"
                      : "bg-orange-100 text-orange-700"
                    }`}>
                  #{i + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-gray-900 truncate">
                    {item.name}
                  </p>
                  <p className="text-sm text-gray-500 font-medium">
                    {item.sales} units sold
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-black text-gray-900 text-lg">
                    Rs. {parseFloat(item.revenue).toLocaleString()}
                  </p>
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter">
                    Gross revenue
                  </p>
                </div>
              </div>
            )) : (
              <p className="text-center text-gray-400 py-10">No products found</p>
            )}
          </div>
        </div>
      </div>

      {/* Market Activity */}
      <div className="bg-gray-900 rounded-2xl shadow-xl p-8 border border-gray-800">
        <div className="flex items-center justify-between mb-8">
          <h3 className="text-xl font-bold text-white">
            Marketplace Active Users
          </h3>
          <Users2 className="text-gray-500" />
        </div>
        <div className="grid grid-cols-4 md:grid-cols-7 gap-4">
          {salesData.length > 0 ? salesData.slice(-7).map((item, i) => (
            <div key={i} className="flex flex-col items-center gap-4">
              <div className="w-full relative h-48 bg-white/10 rounded-xl flex items-end justify-center group p-1">
                <div
                  className="w-full bg-blue-600 rounded-lg transition-all duration-700 group-hover:opacity-100 opacity-60"
                  style={{ height: `${(parseInt(item.users) / (Math.max(...salesData.map(d => parseInt(d.users))) || 1)) * 100}%` }}>
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 -mt-10 bg-white text-gray-900 px-2 py-1 rounded text-xs font-black opacity-0 group-hover:opacity-100 transition-opacity">
                    {item.users}
                  </div>
                </div>
              </div>
              <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest truncate w-full text-center">
                {item.day}
              </span>
            </div>
          )) : (
            <div className="col-span-full py-10 text-center text-gray-500">No user activity recorded</div>
          )}
        </div>
      </div>
    </div>
  );
};
