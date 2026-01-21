import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ShoppingCart,
  Package,
  Heart,
  XCircle,
  CheckCircle2,
  ChevronDown,
  ArrowLeft,
  Calendar,
} from "lucide-react";
import BuyerCancelledOrders from "./Cancelled";
import TransactionHistory from "./TransactionHistory";
import Wishlist from "./Wishlist";
import MyOrders from "./MyOrders";
import CartContent from "./CartContent";
import useOrders from "../hooks/useOrdersCart";

const CustomerCartComponent = () => {
  const [activeTab, setActiveTab] = useState("cart");
  const [selectedPeriod, setSelectedPeriod] = useState("Until now");
  const navigate = useNavigate();

  // Get all data from the hook
  const {
    cartItems = [],
    wishlistItems = [],
    recentOrders = [],
    completedOrders = [],
    cancelledOrders = [],
    updateCartQuantity,
    removeFromCart,
    removeFromWishlist,
    addToCart,
    refreshOrders,
    loading,
  } = useOrders(selectedPeriod);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          {/* Title Row with Back Button and Period Filter */}
          <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate(-1)}
                className="flex items-center gap-2 px-3 py-2 text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
                <ArrowLeft className="w-5 h-5" />
                <span className="font-medium">Back</span>
              </button>
              <div className="h-6 w-px bg-gray-300"></div>
              <h1 className="text-2xl font-bold text-gray-900">
                My Orders & Cart
              </h1>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex gap-2 overflow-x-auto pb-2">
              <button
                onClick={() => setActiveTab("cart")}
                className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-all flex items-center gap-2 whitespace-nowrap ${activeTab === "cart"
                  ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg shadow-orange-500/30"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}>
                <ShoppingCart className="w-4 h-4" />
                Cart
              </button>
              <button
                onClick={() => setActiveTab("wishlist")}
                className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-all flex items-center gap-2 whitespace-nowrap ${activeTab === "wishlist"
                  ? "bg-gradient-to-r from-pink-500 to-pink-600 text-white shadow-lg shadow-pink-500/30"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}>
                <Heart className="w-4 h-4" />
                Wishlist
              </button>
              <button
                onClick={() => setActiveTab("orders")}
                className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-all flex items-center gap-2 whitespace-nowrap ${activeTab === "orders"
                  ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/30"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}>
                <Package className="w-4 h-4" />
                Orders
              </button>
              <button
                onClick={() => setActiveTab("cancelled")}
                className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-all flex items-center gap-2 whitespace-nowrap ${activeTab === "cancelled"
                  ? "bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg shadow-red-500/30"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}>
                <XCircle className="w-4 h-4" />
                Cancelled
              </button>
              <button
                onClick={() => setActiveTab("history")}
                className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-all flex items-center gap-2 whitespace-nowrap ${activeTab === "history"
                  ? "bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg shadow-green-500/30"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}>
                <CheckCircle2 className="w-4 h-4" />
                Transaction History
              </button>
            </div>
            {/* Period Filter */}
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-gray-500" />
              <div className="relative">
                <select
                  value={selectedPeriod}
                  onChange={(e) => {
                    setSelectedPeriod(e.target.value);
                  }}
                  className="appearance-none pl-3 pr-9 py-2 bg-white border-2 border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 cursor-pointer transition-all shadow-sm">
                  <option value="Until now">Until now</option>
                  <option value="This month">This month</option>
                  <option value="This year">This year</option>
                </select>
                <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* MY CART TAB */}
        {activeTab === "cart" && (
          <CartContent
            cartItems={cartItems}
            selectedPeriod={selectedPeriod}
            setSelectedPeriod={setSelectedPeriod}
            updateCartQuantity={updateCartQuantity}
            removeFromCart={removeFromCart}
            loading={loading}
          />
        )}

        {/* MY ORDERS TAB */}
        {activeTab === "orders" && (
          <MyOrders
            recentOrders={recentOrders}
            loading={loading}
            selectedPeriod={selectedPeriod}
            refreshOrders={refreshOrders}
          />
        )}

        {/* WISHLIST TAB */}
        {activeTab === "wishlist" && (
          <Wishlist
            selectedPeriod={selectedPeriod}
            wishlistItems={wishlistItems}
            removeFromWishlist={removeFromWishlist}
            addToCart={addToCart}
            loading={loading}
          />
        )}

        {/* CANCELLED ORDERS TAB */}
        {activeTab === "cancelled" && (
          <BuyerCancelledOrders
            cancelledOrders={cancelledOrders}
            loading={loading}
            selectedPeriod={selectedPeriod}
          />
        )}

        {/* HISTORY TAB */}
        {activeTab === "history" && (
          <TransactionHistory
            completedOrders={completedOrders}
            loading={loading}
            selectedPeriod={selectedPeriod}
          />
        )}
      </main>
    </div>
  );
};

export default CustomerCartComponent;
