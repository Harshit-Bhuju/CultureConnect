import React from "react";
import {
  DollarSign,
  ShoppingCart,
  Users2,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";

export const AdminProductAnalytics = ({ data, timeframe }) => {
  const maxSales = Math.max(...data.salesData.map((d) => d.sales));

  return (
    <div className="space-y-6">
      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          {
            title: "Total Product Revenue",
            value: "Rs. 4,56,789",
            change: "+23%",
            positive: true,
            icon: DollarSign,
          },
          {
            title: "Product Sales",
            value: "1,234",
            change: "+18%",
            positive: true,
            icon: ShoppingCart,
          },
          {
            title: "Active Sellers",
            value: "45",
            change: "+4%",
            positive: true,
            icon: Users2,
          },
          {
            title: "Market Growth",
            value: "14.5%",
            change: "+2.1%",
            positive: true,
            icon: TrendingUp,
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
                  className={`flex items-center gap-1 text-sm font-bold ${
                    metric.positive ? "text-green-600" : "text-red-600"
                  }`}>
                  {metric.positive ? (
                    <ArrowUpRight size={16} />
                  ) : (
                    <ArrowDownRight size={16} />
                  )}
                  {metric.change}
                </span>
                <span className="text-xs text-gray-400 font-medium">
                  vs last month
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
            Daily Sales Performance
          </h3>
          <div className="space-y-6">
            {data.salesData.map((item, i) => (
              <div key={i} className="group">
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="font-bold text-gray-500">{item.day}</span>
                  <span className="font-extrabold text-gray-900">
                    Rs. {item.sales.toLocaleString()}
                  </span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-4 overflow-hidden">
                  <div
                    className="h-full bg-gray-900 rounded-full transition-all duration-1000 ease-out"
                    style={{ width: `${(item.sales / maxSales) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Products */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <h3 className="text-lg font-bold text-gray-900 mb-8 border-b border-gray-100 pb-4">
            Top Selling Products
          </h3>
          <div className="space-y-4">
            {data.topProducts.map((item, i) => (
              <div
                key={i}
                className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl hover:bg-white hover:shadow-md border border-transparent hover:border-gray-200 transition-all cursor-default">
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center font-black text-lg ${
                    i === 0
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
                    {item.revenue}
                  </p>
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter">
                    Gross revenue
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Market Activity */}
      <div className="bg-gray-900 rounded-2xl shadow-xl p-8 border border-gray-800">
        <div className="flex items-center justify-between mb-8">
          <h3 className="text-xl font-bold text-white">
            Marketplace Active Users
          </h3>
          <TrendingUp className="text-gray-500" />
        </div>
        <div className="grid grid-cols-7 gap-4">
          {data.salesData.map((item, i) => (
            <div key={i} className="flex flex-col items-center gap-4">
              <div className="w-full relative h-48 bg-white/10 rounded-xl flex items-end justify-center group p-1">
                <div
                  className="w-full bg-royal-blue rounded-lg transition-all duration-700 group-hover:opacity-100 opacity-60"
                  style={{ height: `${(item.users / 82) * 100}%` }}>
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 -mt-10 bg-white text-gray-900 px-2 py-1 rounded text-xs font-black opacity-0 group-hover:opacity-100 transition-opacity">
                    {item.users}
                  </div>
                </div>
              </div>
              <span className="text-xs font-black text-gray-500 uppercase tracking-widest">
                {item.day}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
