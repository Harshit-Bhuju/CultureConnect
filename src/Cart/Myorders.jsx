// components/MyOrders.jsx
import React, { useState, useMemo } from "react";
import {
  Package,
  ChevronDown,
  Filter,
  MapPin,
  Clock,
  Hash,
  CreditCard,
  XCircle,
  X,
} from "lucide-react";
import toast from "react-hot-toast";

import { BASE_URL } from "../Configs/ApiEndpoints";

const MyOrders = ({ recentOrders, loading, selectedPeriod }) => {
  const [paymentStatusFilter, setPaymentStatusFilter] = useState("all");
  const [orderStatusFilter, setOrderStatusFilter] = useState("all");
  const [sortOrder, setSortOrder] = useState("newest");
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [cancelReason, setCancelReason] = useState("");
  const [cancelDescription, setCancelDescription] = useState("");

  const cancelReasons = [
    "Changed my mind",
    "Found a better price elsewhere",
    "Ordered by mistake",
    "Delivery time is too long",
    "Other",
  ];

  const handleOpenCancelModal = (order) => {
    setSelectedOrder(order);
    setCancelReason("");
    setCancelDescription("");
    setShowCancelModal(true);
  };

  const handleCloseCancelModal = () => {
    setShowCancelModal(false);
    setSelectedOrder(null);
    setCancelReason("");
    setCancelDescription("");
  };

  const handleCancelOrder = () => {
    if (!cancelReason) {
      toast.error("Please select a reason for cancellation");
      return;
    }

    // TODO: Backend integration will be added here
    console.log("Cancelling order:", {
      orderNumber: selectedOrder.order_number,
      reason: cancelReason,
      description: cancelDescription,
    });

    toast.success("Order cancellation request submitted!");
    handleCloseCancelModal();
  };

  // Extract date key for grouping (e.g., "December 2024" or "16 December 2024")
  const getDateGroupKey = (orderDateString) => {
    // Parse the formatted date string (e.g., "16 December 2024 3:45 PM")
    const parts = orderDateString.split(" ");

    if (selectedPeriod === "This month") {
      // For "This month", group by full date: "16 December 2024"
      return `${parts[0]} ${parts[1]} ${parts[2]}`;
    } else {
      // For "This year" or "Until now", group by month: "December 2024"
      return `${parts[1]} ${parts[2]}`;
    }
  };

  // Filter and sort recent orders
  const filteredOrders = useMemo(() => {
    let filtered = [...recentOrders];

    if (paymentStatusFilter !== "all") {
      filtered = filtered.filter(
        (order) => order.payment_status === paymentStatusFilter,
      );
    }

    if (orderStatusFilter !== "all") {
      filtered = filtered.filter((order) => order.status === orderStatusFilter);
    }

    // Sort by parsing the date string back to Date object
    filtered.sort((a, b) => {
      const dateA = new Date(a.orderDate);
      const dateB = new Date(b.orderDate);
      return sortOrder === "newest" ? dateB - dateA : dateA - dateB;
    });

    return filtered;
  }, [recentOrders, paymentStatusFilter, orderStatusFilter, sortOrder]);

  // Group orders by date
  const groupedOrders = useMemo(() => {
    const groups = {};
    filteredOrders.forEach((order) => {
      const key = getDateGroupKey(order.orderDate);
      groups[key] = groups[key] || [];
      groups[key].push(order);
    });
    return groups;
  }, [filteredOrders, selectedPeriod]);

  const getPaymentStatusColor = (status) => {
    switch (status) {
      case "Paid":
        return "bg-green-100 text-green-700";
      case "Pending":
        return "bg-yellow-100 text-yellow-700";
      case "Refunded":
        return "bg-blue-100 text-blue-700";
      case "Failed":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "processing":
        return "border border-orange-500 text-orange-600 bg-orange-50";
      case "shipped":
        return "bg-blue-500 text-white";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusDisplay = (status) => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  const getPeriodLabel = () => {
    switch (selectedPeriod) {
      case "This month":
        return "this month";
      case "This year":
        return "this year";
      default:
        return "all time";
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl font-semibold text-gray-800">My Orders</h2>
              <p className="text-sm text-gray-500 mt-1">
                View and manage your orders - {getPeriodLabel()}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="relative">
                <select
                  value={paymentStatusFilter}
                  onChange={(e) => setPaymentStatusFilter(e.target.value)}
                  className="appearance-none pl-4 pr-10 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer transition-colors">
                  <option value="all">All Payments</option>
                  <option value="Paid">Paid</option>
                  <option value="Pending">Pending</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
              </div>

              <div className="relative">
                <select
                  value={orderStatusFilter}
                  onChange={(e) => setOrderStatusFilter(e.target.value)}
                  className="appearance-none pl-4 pr-10 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer transition-colors">
                  <option value="all">All Status</option>
                  <option value="processing">Processing</option>
                  <option value="shipped">Shipped</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
              </div>

              <div className="relative">
                <select
                  value={sortOrder}
                  onChange={(e) => setSortOrder(e.target.value)}
                  className="appearance-none pl-4 pr-10 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer transition-colors">
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
              </div>
            </div>
          </div>
        </div>

        {filteredOrders.length > 0 && (
          <div className="mt-6 mb-4 pt-4 border-t border-gray-200">
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-900">
                  {filteredOrders.length}
                </p>
                <p className="text-xs text-gray-500 mt-1">Total Orders</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-blue-600">
                  {filteredOrders.reduce(
                    (sum, order) => sum + order.quantity,
                    0,
                  )}
                </p>
                <p className="text-xs text-gray-500 mt-1">Total Items</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-900">
                  Rs.{" "}
                  {filteredOrders
                    .reduce((sum, order) => sum + order.totalAmount, 0)
                    .toLocaleString()}
                </p>
                <p className="text-xs text-gray-500 mt-1">Total Amount</p>
              </div>
            </div>
          </div>
        )}

        <div className="space-y-6">
          {Object.keys(groupedOrders).length === 0 ? (
            <div className="text-center py-12">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
                <Filter className="w-8 h-8 text-gray-400" />
              </div>
              <p className="text-gray-500 font-medium">No orders found</p>
              <p className="text-sm text-gray-400 mt-1">
                Try adjusting your filters
              </p>
            </div>
          ) : (
            Object.entries(groupedOrders).map(([date, orders]) => (
              <div key={date}>
                <div className="flex items-center mb-3">
                  <div className="text-sm font-semibold text-gray-900 bg-blue-50 border border-blue-200 px-3 py-1 rounded-full">
                    {date}
                  </div>
                  <div className="flex-1 h-px bg-gray-200 ml-4"></div>
                  <div className="text-xs text-gray-500 ml-4">
                    {orders.length} order{orders.length !== 1 ? "s" : ""}
                  </div>
                </div>

                <div className="space-y-3">
                  {orders.map((order) => (
                    <div
                      key={order.order_number}
                      className="border border-gray-200 rounded-lg p-5 hover:shadow-md transition-shadow bg-white">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-shrink-0 w-12 h-12 rounded-lg flex items-center justify-center overflow-hidden">
                          <img
                            src={`${BASE_URL}/uploads/product_images/${order.productImage}`}
                            alt={order.productName}
                            className="w-full h-full object-cover"
                          />
                        </div>

                        <div className="flex-1">
                          <div className="flex items-start justify-between">
                            <div>
                              <h3 className="text-gray-900 font-semibold text-lg mb-1">
                                {order.productName}
                              </h3>
                              <p className="text-xs text-gray-500 font-mono">
                                Order ID: {order.order_number}
                              </p>
                            </div>
                            {order.status === "processing" && (
                              <button
                                onClick={() => handleOpenCancelModal(order)}
                                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-semibold rounded-lg transition-colors flex items-center gap-2">
                                <XCircle className="w-4 h-4" />
                                Cancel Order
                              </button>
                            )}
                          </div>

                          <div className="grid grid-cols-2 gap-x-6 gap-y-3 mt-4">
                            <div>
                              <p className="text-xs text-gray-500 font-medium flex items-center gap-1">
                                <MapPin className="w-3 h-3" />
                                Delivery Location
                              </p>
                              <p className="text-sm text-gray-900">
                                {order.delivery_location}
                              </p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500 font-medium flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                Estimated Delivery
                              </p>
                              <p className="text-sm text-gray-900">
                                {order.estimated_delivery_time}
                              </p>
                              <p className="text-xs text-gray-400 mt-0.5">
                                (Includes 2 days for packaging & processing)
                              </p>
                            </div>
                            {order.transaction_uuid && (
                              <div className="col-span-2">
                                <p className="text-xs text-gray-500 font-medium flex items-center gap-1">
                                  <Hash className="w-3 h-3" />
                                  Transaction UUID
                                </p>
                                <p className="text-sm text-gray-900 font-mono">
                                  {order.transaction_uuid}
                                </p>
                              </div>
                            )}
                          </div>

                          <div className="grid grid-cols-4 gap-4 mt-4 pt-4 border-t border-gray-100">
                            <div>
                              <p className="text-xs text-gray-500 font-medium">
                                Unit Price
                              </p>
                              <p className="text-sm text-gray-900">
                                Rs. {order.productPrice?.toLocaleString()}
                              </p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500 font-medium">
                                Quantity
                              </p>
                              <p className="text-sm text-gray-900">
                                {order.quantity}
                              </p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500 font-medium">
                                Delivery Charge
                              </p>
                              <p className="text-sm text-gray-900">
                                Rs. {order.delivery_charge}
                              </p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500 font-medium">
                                Total Amount
                              </p>
                              <p className="text-lg font-bold text-gray-900">
                                Rs. {order.totalAmount.toLocaleString()}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-4 mt-4 pt-3 border-t border-gray-100">
                            <span
                              className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${getStatusColor(order.status)}`}>
                              {getStatusDisplay(order.status)}
                            </span>
                            <span
                              className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${getPaymentStatusColor(order.payment_status)}`}>
                              <CreditCard className="w-3 h-3 mr-1" />
                              {order.payment_status}
                            </span>
                            <div className="text-xs text-gray-500">
                              {order.payment_method}
                            </div>
                            <div className="text-xs text-gray-500">
                              Ordered at {order.orderDate}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Cancel Order Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-xl font-bold text-gray-900">Cancel Order</h3>
              <button
                onClick={handleCloseCancelModal}
                className="text-gray-400 hover:text-gray-600 transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6">
              <div className="mb-6">
                <h4 className="text-sm font-semibold text-gray-900 mb-2">
                  {selectedOrder?.productName}
                </h4>
                <p className="text-xs text-gray-500 font-mono">
                  Order ID: {selectedOrder?.order_number}
                </p>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Reason for cancellation{" "}
                  <span className="text-red-500">*</span>
                </label>
                <div className="space-y-2">
                  {cancelReasons.map((reason) => (
                    <label
                      key={reason}
                      className="flex items-center p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                      <input
                        type="radio"
                        name="cancelReason"
                        value={reason}
                        checked={cancelReason === reason}
                        onChange={(e) => setCancelReason(e.target.value)}
                        className="w-4 h-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                      />
                      <span className="ml-3 text-sm text-gray-900">
                        {reason}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Additional details{" "}
                  <span className="text-gray-400">(Optional)</span>
                </label>
                <textarea
                  value={cancelDescription}
                  onChange={(e) => setCancelDescription(e.target.value)}
                  placeholder="Tell us more about why you're cancelling..."
                  rows="3"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-sm"
                />
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleCloseCancelModal}
                  className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors">
                  Keep Order
                </button>
                <button
                  onClick={handleCancelOrder}
                  className="flex-1 px-4 py-2.5 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-colors">
                  Cancel Order
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default MyOrders;
