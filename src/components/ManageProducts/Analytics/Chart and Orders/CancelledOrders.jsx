import React, { useState, useMemo } from 'react';
import { XCircle, ChevronDown, Package, AlertCircle, MapPin, Clock, Hash, CreditCard } from 'lucide-react';
import useOrders from '../../../../hooks/useOrders';
import { BASE_URL } from '../../../../Configs/ApiEndpoints';


const CancelledOrders = ({ selectedPeriod }) => {
  const { cancelledOrders: allCancelledOrders, loading } = useOrders(selectedPeriod);

  const [sortOrder, setSortOrder] = useState('newest');
  const [paymentStatusFilter, setPaymentStatusFilter] = useState('all');

  const cancelledOrders = useMemo(() => {
    let orders = [...allCancelledOrders];

    if (paymentStatusFilter !== 'all') {
      orders = orders.filter(order => order.payment_status === paymentStatusFilter);
    }

    orders.sort((a, b) => {
      const dateA = new Date(a.updatedAt);
      const dateB = new Date(b.updatedAt);
      return sortOrder === 'newest' ? dateB - dateA : dateA - dateB;
    });

    return orders;
  }, [allCancelledOrders, sortOrder, paymentStatusFilter]);

  const formatDateLabel = (dateString, selectedPeriod) => {
    const date = new Date(dateString);

    if (selectedPeriod === 'This month') {
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } else {
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long'
      });
    }
  };

  const groupedOrders = useMemo(() => {
    const groups = {};

    cancelledOrders.forEach(order => {
      const date = new Date(order.updatedAt);
      const dateKey = formatDateLabel(date, selectedPeriod);

      if (!groups[dateKey]) {
        groups[dateKey] = [];
      }
      groups[dateKey].push(order);
    });

    return groups;
  }, [cancelledOrders, selectedPeriod]);

  const getPaymentStatusColor = (status) => {
    switch (status) {
      case 'Refunded':
        return 'bg-blue-100 text-blue-700';
      case 'Pending_refund':
      case 'pending_refund':
      case 'Pending':
      case 'pending':
        return 'bg-yellow-100 text-yellow-700';
      case 'Failed':
        return 'bg-red-100 text-red-700';
      case 'no_payment':
        return 'bg-blue-100 text-blue-700 font-medium px-4';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getPeriodLabel = () => {
    switch (selectedPeriod) {
      case 'This month':
        return 'this month';
      case 'This year':
        return 'this year';
      default:
        return 'all time';
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
              <XCircle className="w-6 h-6 text-red-600" />
              Cancelled Orders
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Orders that were cancelled or rejected - {getPeriodLabel()}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative">
              <select
                value={paymentStatusFilter}
                onChange={(e) => setPaymentStatusFilter(e.target.value)}
                className="appearance-none pl-4 pr-10 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-red-500 cursor-pointer transition-colors"
              >
                <option value="all">All Payment</option>
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
                className="appearance-none pl-4 pr-10 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-red-500 cursor-pointer transition-colors"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
            </div>
          </div>
        </div>
      </div>

      {cancelledOrders.length > 0 && (
        <div className="mt-6 mb-4 pt-4 border-t border-gray-200">
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900">
                {cancelledOrders.length}
              </p>
              <p className="text-xs text-gray-500 mt-1">Cancelled Orders</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-red-600">
                {cancelledOrders.reduce((sum, order) => sum + order.quantity, 0)}
              </p>
              <p className="text-xs text-gray-500 mt-1">Items Lost</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900">
                Rs. {cancelledOrders.reduce((sum, order) => sum + order.totalAmount, 0).toLocaleString()}
              </p>
              <p className="text-xs text-gray-500 mt-1">Lost Revenue</p>
            </div>
          </div>
        </div>
      )}

      {cancelledOrders.length > 0 && (
        <div className="mt-6 pt-4 border-t border-gray-200">
          <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-lg p-4">
            <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-amber-900">
                Understanding Cancelled Orders
              </p>
              <p className="text-xs text-amber-700 mt-1">
                These orders were cancelled either by the customer or due to inventory/payment issues.
                Review patterns to improve your order fulfillment process.
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-6">
        {Object.keys(groupedOrders).length === 0 ? (
          <div className="text-center py-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
              <Package className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-gray-500 font-medium">No cancelled orders</p>
            <p className="text-sm text-gray-400 mt-1">
              {selectedPeriod === 'This month'
                ? 'No cancelled orders this month'
                : selectedPeriod === 'This year'
                  ? 'No cancelled orders this year'
                  : 'Cancelled orders will appear here'}
            </p>
          </div>
        ) : (
          Object.entries(groupedOrders).map(([date, orders]) => (
            <div key={date}>
              <div className="flex items-center mb-4">
                <div className="text-sm font-semibold text-gray-900 bg-red-50 border border-red-200 px-3 py-1 rounded-full">
                  {date}
                </div>
                <div className="flex-1 h-px bg-gray-200 ml-4"></div>
                <div className="text-xs text-gray-500 ml-4">
                  {orders.length} order{orders.length !== 1 ? 's' : ''}
                </div>
              </div>

              <div className="space-y-3">
                {orders.map((order) => (
                  <div
                    key={order.order_id}
                    className="border border-red-200 rounded-lg p-5 hover:shadow-md transition-shadow bg-red-50/30"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-start gap-4">
                          <div className="flex-shrink-0 w-12 h-12 rounded-lg flex items-center justify-center overflow-hidden">
                            <img
                              src={`${BASE_URL}/uploads/product_images/${order.productImage}`}
                              alt={order.productName}
                              className="w-full h-full object-cover"
                            />
                          </div>

                          <div className="flex-1">
                            <div className="flex items-start justify-between mb-2">
                              <div>
                                <h3 className="text-gray-900 font-semibold text-lg">
                                  {order.productName}
                                </h3>
                                {order.size && (
                                  <p className="text-sm text-gray-600 mt-1">
                                    Size: {order.size}
                                  </p>
                                )}
                                <p className="text-xs text-gray-500 font-mono mt-1">
                                  Order ID: {order.order_number}
                                </p>
                              </div>
                            </div>

                            <div className="grid grid-cols-2 gap-x-6 gap-y-3 mt-3">
                              <div>
                                <p className="text-xs text-gray-500 font-medium">Customer Name</p>
                                <p className="text-sm text-gray-900">{order.customerName}</p>
                              </div>
                              <div>
                                <p className="text-xs text-gray-500 font-medium">Email</p>
                                <p className="text-sm text-gray-900">{order.customerEmail}</p>
                              </div>
                              <div>
                                <p className="text-xs text-gray-500 font-medium flex items-center gap-1">
                                  <MapPin className="w-3 h-3" />
                                  Delivery Location
                                </p>
                                <p className="text-sm text-gray-900">{order.delivery_location}</p>
                              </div>
                              <div>
                                <p className="text-xs text-gray-500 font-medium flex items-center gap-1">
                                  <Clock className="w-3 h-3" />
                                  Cancelled On
                                </p>
                                <p className="text-sm text-gray-900">{order.updatedAt}</p>
                              </div>
                              {order.transaction_uuid && (
                                <div className="col-span-2">
                                  <p className="text-xs text-gray-500 font-medium flex items-center gap-1">
                                    <Hash className="w-3 h-3" />
                                    Transaction UUID
                                  </p>
                                  <p className="text-sm text-gray-900 font-mono">{order.transaction_uuid}</p>
                                </div>
                              )}
                            </div>

                            {(order.cancellation_reason || order.cancellation_description) && (
                              <div className="mt-4 p-3 bg-white rounded-lg border border-red-200">
                                {order.cancelled_by && (
                                  <div className="mb-2 pb-2 border-b border-gray-200">
                                    <p className="text-xs text-gray-500 font-medium">Cancelled By</p>
                                    <p className="text-sm text-gray-900 mt-1 capitalize">
                                      {order.cancelled_by === 'buyer' ? 'You (Buyer)' : order.cancelled_by === 'seller' ? 'Seller' : order.cancelled_by}
                                    </p>
                                  </div>
                                )}
                                {order.cancellation_reason && (
                                  <div className="mb-2">

                                    <p className="text-xs text-gray-500 font-medium">Cancellation Reason</p>
                                    <p className="text-sm text-gray-900 mt-1">{order.cancellation_reason}</p>
                                  </div>
                                )}
                                {order.cancellation_description && (
                                  <div>
                                    <p className="text-xs text-gray-500 font-medium">Additional Details</p>
                                    <p className="text-sm text-gray-700 mt-1">{order.cancellation_description}</p>
                                  </div>
                                )}
                              </div>
                            )}

                            <div className="grid grid-cols-4 gap-4 mt-4 pt-4 border-t border-red-100">
                              <div>
                                <p className="text-xs text-gray-500 font-medium">Unit Price</p>
                                <p className="text-sm text-gray-900  opacity-60">Rs. {order.productPrice?.toLocaleString()}</p>
                              </div>
                              <div>
                                <p className="text-xs text-gray-500 font-medium">Quantity</p>
                                <p className="text-sm text-gray-900">{order.quantity}</p>
                              </div>
                              <div>
                                <p className="text-xs text-gray-500 font-medium">Delivery Charge</p>
                                <p className="text-sm text-gray-900  opacity-60">Rs. {order.delivery_charge}</p>
                              </div>
                              <div>
                                <p className="text-xs text-gray-500 font-medium">Total Amount</p>
                                <p className="text-lg font-bold text-gray-900  opacity-60">
                                  Rs. {order.totalAmount.toLocaleString()}
                                </p>
                              </div>
                            </div>

                            <div className="flex items-center gap-4 mt-4 pt-3 border-t border-red-100">
                              <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-800">
                                <XCircle className="w-3 h-3 mr-1" />
                                Cancelled
                              </span>
                              <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${getPaymentStatusColor(order.payment_status)}`}>
                                <CreditCard className="w-3 h-3 mr-1" />
                                {order.payment_status?.toLowerCase() === 'refunded' ? 'Refunded' :
                                  (order.payment_status?.toLowerCase() === 'pending_refund' || (order.payment_method?.toLowerCase() !== 'cod' && order.payment_status?.toLowerCase() === 'pending')) ? 'Refund Pending' :
                                    (order.payment_method?.toLowerCase() === 'cod' || order.payment_status?.toLowerCase() === 'no_payment') ? 'No Payment Needed' : 'Refund Failed'}
                              </span>
                              <div className="text-xs text-gray-500">
                                {order.payment_method}
                              </div>
                              <div className="text-xs text-gray-500">
                                Ordered at {order.orderDate || new Date(order.createdAt).toLocaleDateString()}
                              </div>
                            </div>
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

export default CancelledOrders;