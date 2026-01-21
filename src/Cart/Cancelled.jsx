// components/BuyerCancelledOrders.jsx
import React, { useState, useMemo } from "react";
import {
  XCircle,
  ChevronDown,
  Package,
  MapPin,
  Clock,
  Hash,
  CreditCard,
  Filter,
} from "lucide-react";

import { BASE_URL } from "../Configs/ApiEndpoints";

const BuyerCancelledOrders = ({ cancelledOrders, loading, selectedPeriod }) => {
  const [sortOrder, setSortOrder] = useState("newest");
  const [paymentStatusFilter, setPaymentStatusFilter] = useState("all");

  // Helper function to format date labels based on period
  const formatDateLabel = (date, period) => {
    if (period === "This month") {
      // Show full date: "December 16, 2025"
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } else {
      // Show month and year: "December 2025"
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
      });
    }
  };

  const filteredOrders = useMemo(() => {
    let orders = [...cancelledOrders];

    if (paymentStatusFilter !== "all") {
      orders = orders.filter(
        (order) => order.payment_status === paymentStatusFilter,
      );
    }

    orders.sort((a, b) => {
      const dateA = new Date(a.updatedAt);
      const dateB = new Date(b.updatedAt);
      return sortOrder === "newest" ? dateB - dateA : dateA - dateB;
    });

    return orders;
  }, [cancelledOrders, sortOrder, paymentStatusFilter]);

  const groupedOrders = useMemo(() => {
    const groups = {};

    filteredOrders.forEach((order) => {
      const date = new Date(order.updatedAt);
      const dateKey = formatDateLabel(date, selectedPeriod);

      if (!groups[dateKey]) {
        groups[dateKey] = [];
      }
      groups[dateKey].push(order);
    });

    return groups;
  }, [filteredOrders, selectedPeriod]);

  const getPaymentStatusColor = (status) => {
    switch (status) {
      case "Refunded":
        return "bg-green-100 text-green-700";
      case "Pending":
      case "pending_refund":
      case "pending":
        return "bg-yellow-100 text-yellow-700";
      case "Failed":
        return "bg-red-100 text-red-700";
      case "no_payment":
        return "bg-blue-100 text-blue-700 font-medium px-4";
      default:
        return "bg-gray-100 text-gray-700";
    }
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
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-semibold text-gray-800">
              Cancelled Orders
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              View your cancelled orders and refund status - {getPeriodLabel()}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <select
                value={paymentStatusFilter}
                onChange={(e) => setPaymentStatusFilter(e.target.value)}
                className="appearance-none pl-4 pr-10 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer transition-colors">
                <option value="all">All</option>
                <option value="Refunded">Refunded</option>
                <option value="Pending">Pending</option>
                <option value="Failed">Failed</option>
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
              <p className="text-xs text-gray-500 mt-1">Cancelled Orders</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">
                {filteredOrders.reduce((sum, order) => sum + order.quantity, 0)}
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
              <p className="text-xs text-gray-500 mt-1">Refund Amount</p>
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
            <p className="text-gray-500 font-medium">
              No cancelled orders found
            </p>
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
                    key={order.id}
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
                            {order.size && (
                              <p className="text-sm text-gray-600 mb-1">
                                Size: {order.size}
                              </p>
                            )}
                            <p className="text-xs text-gray-500 font-mono">
                              Order ID: {order.order_number}
                            </p>
                          </div>
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
                              Cancelled On
                            </p>
                            <p className="text-sm text-gray-900">
                              {order.updatedAt}
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

                        {(order.cancellation?.reason ||
                          order.cancellation?.description ||
                          order.cancellation?.cancelled_by) && (
                            <div className="mt-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
                              {order.cancellation?.cancelled_by && (
                                <div className="mb-2 pb-2 border-b border-gray-200">
                                  <p className="text-xs text-gray-500 font-medium">
                                    Cancelled By
                                  </p>
                                  <p className="text-sm text-gray-900 mt-1 capitalize">
                                    {order.cancellation.cancelled_by === "buyer"
                                      ? "You (Buyer)"
                                      : order.cancellation.cancelled_by ===
                                        "seller"
                                        ? "Seller"
                                        : order.cancellation.cancelled_by}
                                  </p>
                                </div>
                              )}
                              {order.cancellation?.reason && (
                                <div
                                  className={
                                    order.cancellation?.description ? "mb-2" : ""
                                  }>
                                  <p className="text-xs text-gray-500 font-medium">
                                    Cancellation Reason
                                  </p>
                                  <p className="text-sm text-gray-900 mt-1">
                                    {order.cancellation.reason}
                                  </p>
                                </div>
                              )}
                              {order.cancellation?.description && (
                                <div>
                                  <p className="text-xs text-gray-500 font-medium">
                                    Additional Details
                                  </p>
                                  <p className="text-sm text-gray-700 mt-1">
                                    {order.cancellation.description}
                                  </p>
                                </div>
                              )}
                            </div>
                          )}

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
                          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-800 border border-gray-300">
                            <XCircle className="w-3 h-3 mr-1" />
                            Cancelled
                          </span>
                          <span
                            className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${getPaymentStatusColor(order.payment_status)}`}>
                            <CreditCard className="w-3 h-3 mr-1" />
                            {order.payment_status?.toLowerCase() === "refunded"
                              ? "Refunded"
                              : order.payment_status?.toLowerCase() === "pending_refund" || (order.payment_method?.toLowerCase() !== "cod" && order.payment_status?.toLowerCase() === "pending")
                                ? "Refund Pending (3-7 days)"
                                : order.payment_method?.toLowerCase() === "cod" || order.payment_status?.toLowerCase() === "no_payment"
                                  ? "No Payment Needed"
                                  : "Refund Failed"}
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
  );
};

export default BuyerCancelledOrders;
