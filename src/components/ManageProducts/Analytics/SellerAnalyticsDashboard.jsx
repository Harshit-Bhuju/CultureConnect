import React, { useState, useMemo } from "react";
import {
  ArrowLeft,
  DollarSign,
  Package,
  ShoppingCart,
  TrendingUp,
} from "lucide-react";
import AnalyticsStatsCard from "./Stats/AnalyticsStatsCard";
import { initialProducts } from "../Data/data";
import AnalyticsStatsCards from "./Stats/AnalyticsStatsCards";
import TopSellingChart from "./Chart and Orders/TopSellingChart";
import RecentOrders from "./Chart and Orders/RecentOrders";
import TransactionHistory from "./Chart and Orders/TransactionHistory";
import { useNavigate } from "react-router-dom";
import CancelledOrders from "./Chart and Orders/CancelledOrders";


const SellerAnalyticsDashboard = () => {
  const navigate = useNavigate();
  const [selectedPeriod, setSelectedPeriod] = useState("This month");
  const [activeTab, setActiveTab] = useState("overview"); // overview, orders, history

  const periods = ["This month", "This year", "Until now"];

  // Calculate analytics based on the product data and selected period
  const analytics = useMemo(() => {
    let productsSold = 0;
    let totalRevenue = 0;

    initialProducts.forEach((product) => {
      if (!product.sales || product.sales.length === 0) return;

      const salesData = product.sales[0];

      if (selectedPeriod === "This month") {
        productsSold += salesData.thisMonth;
        totalRevenue += product.price * salesData.thisMonth;
      } else if (selectedPeriod === "This year") {
        productsSold += salesData.thisYear;
        totalRevenue += product.price * salesData.thisYear;
      } else if (selectedPeriod === "Until now") {
        productsSold += salesData.totalSales;
        totalRevenue += product.price * salesData.totalSales;
      }
    });

    // Calculate total orders (assuming each sale could be multiple items)
    const totalOrders = Math.ceil(productsSold * 0.65); // Approximate orders

    const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

    return {
      totalRevenue,
      productsSold,
      totalOrders,
      avgOrderValue,
    };
  }, [selectedPeriod]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-8 py-6 shadow-sm">
        <div className="max-w-7xl mx-auto">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 transition-colors group"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Back</span>
          </button>

          <div className="flex justify-between items-center mb-6">
            <div>
              <p className="text-sm text-gray-500 font-medium mb-1">
                DASHBOARD
              </p>
              <h1 className="text-4xl font-bold text-gray-900">
                Seller Analytics
              </h1>
            </div>

            {/* Period Selector */}
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600 font-medium">PERIOD</span>
              <select
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 font-medium focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent cursor-pointer hover:bg-gray-50 transition-colors"
              >
                {periods.map((period) => (
                  <option key={period} value={period}>
                    {period}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex gap-1 bg-gray-100 p-1 rounded-lg w-fit">
            <button
              onClick={() => setActiveTab("overview")}
              className={`px-6 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === "overview"
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab("orders")}
              className={`px-6 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === "orders"
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Active Orders
            </button>
              <button
              onClick={() => setActiveTab("cancelled")}
              className={`px-6 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === "cancelled"
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Cancelled Orders
            </button>
            <button
              onClick={() => setActiveTab("history")}
              className={`px-6 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === "history"
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Transaction History
            </button>
          
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-8 py-8">
        {/* Overview Tab */}
        {activeTab === "overview" && (
          <>
            <AnalyticsStatsCards
              totalRevenue={analytics.totalRevenue.toLocaleString()}
              productsSold={analytics.productsSold.toLocaleString()}
              totalOrders={analytics.totalOrders.toLocaleString()}
            />
            
            <div className="mt-10">
              <TopSellingChart selectedPeriod={selectedPeriod} />
            </div>
          </>
        )}

        {/* Active Orders Tab */}
        {activeTab === "orders" && (
          <div className="mt-2">
            <RecentOrders />
          </div>
        )}

        {/* Transaction History Tab */}
        {activeTab === "history" && (
          <div className="mt-2">
            <TransactionHistory />
          </div>
        )}

          {activeTab === "cancelled" && (
  <div className="mt-2">
    <CancelledOrders />
  </div>
)}
    
      </main>
    </div>
  );
};

export default SellerAnalyticsDashboard;