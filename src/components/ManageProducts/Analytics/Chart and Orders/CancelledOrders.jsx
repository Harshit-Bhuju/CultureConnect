import React, { useState, useMemo } from 'react';
import { getAllRecentOrders } from '../../Data/data';
import { XCircle, ChevronDown, Package, AlertCircle } from 'lucide-react';

const CancelledOrders = () => {
  const [sortOrder, setSortOrder] = useState('newest');

  const cancelledOrders = useMemo(() => {
    let orders = getAllRecentOrders();
    
    orders = orders.filter(order => order.status === 'cancelled');

    orders.sort((a, b) => {
      const dateA = new Date(a.orderDate);
      const dateB = new Date(b.orderDate);
      return sortOrder === 'newest' ? dateB - dateA : dateA - dateB;
    });

    return orders;
  }, [sortOrder]);

  const groupedOrders = useMemo(() => {
    const groups = {};
    
    cancelledOrders.forEach(order => {
      const date = new Date(order.orderDate);
      const dateKey = date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });
      
      if (!groups[dateKey]) {
        groups[dateKey] = [];
      }
      groups[dateKey].push(order);
    });
    
    return groups;
  }, [cancelledOrders]);

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
              <XCircle className="w-6 h-6 text-red-600" />
              Cancelled Orders
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Orders that were cancelled or rejected
            </p>
          </div>
          
          {/* Sort Order */}
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

      {/* Summary Stats */}
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

      {/* Orders List */}
      <div className="space-y-6">
        {Object.keys(groupedOrders).length === 0 ? (
          <div className="text-center py-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
              <Package className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-gray-500 font-medium">No cancelled orders</p>
            <p className="text-sm text-gray-400 mt-1">
              Cancelled orders will appear here
            </p>
          </div>
        ) : (
          Object.entries(groupedOrders).map(([date, orders]) => (
            <div key={date}>
              {/* Date Header */}
              <div className="flex items-center mb-4">
                <div className="text-sm font-semibold text-gray-900 bg-red-50 border border-red-200 px-3 py-1 rounded-full">
                  {date}
                </div>
                <div className="flex-1 h-px bg-gray-200 ml-4"></div>
                <div className="text-xs text-gray-500 ml-4">
                  {orders.length} order{orders.length !== 1 ? 's' : ''}
                </div>
              </div>

              {/* Orders for this date */}
              <div className="space-y-3">
                {orders.map((order) => (
                  <div
                    key={order.user_id}
                    className="border border-red-200 rounded-lg p-4 hover:shadow-md transition-shadow bg-red-50/30"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-start gap-4">
                          {/* Order Icon */}
                          <div className="flex-shrink-0 w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                            <XCircle className="w-6 h-6 text-red-600" />
                          </div>

                          {/* Order Details */}
                          <div className="flex-1">
                            <div className="flex items-start justify-between mb-2">
                              <h3 className="text-gray-900 font-semibold text-lg">
                                {order.productName}
                              </h3>
                              <div className="text-right ml-4">
                                <p className="text-xl font-bold text-gray-900 line-through opacity-60">
                                  Rs. {order.totalAmount.toLocaleString()}
                                </p>
                                <p className="text-xs text-gray-500 mt-1">
                                  Qty: {order.quantity}
                                </p>
                              </div>
                            </div>

                            {/* Customer Info */}
                            <div className="grid grid-cols-2 gap-x-6 gap-y-2 mt-3">
                              <div>
                                <p className="text-xs text-gray-500 font-medium">Customer Name</p>
                                <p className="text-sm text-gray-900">{order.customerName}</p>
                              </div>
                              <div>
                                <p className="text-xs text-gray-500 font-medium">Email</p>
                                <p className="text-sm text-gray-900">{order.customerEmail}</p>
                              </div>
                              <div className="col-span-2">
                                <p className="text-xs text-gray-500 font-medium">Order ID</p>
                                <p className="text-sm text-gray-900 font-mono">{order.user_id}</p>
                              </div>
                            </div>

                            {/* Order Time & Status */}
                            <div className="flex items-center gap-4 mt-3 pt-3 border-t border-red-100">
                              <div className="flex items-center gap-2">
                                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-800">
                                  <XCircle className="w-3 h-3 mr-1" />
                                  Cancelled
                                </span>
                              </div>
                              <div className="text-xs text-gray-500">
                                Cancelled on {formatTime(order.orderDate)}
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

      {/* Info Message */}
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
    </div>
  );
};

export default CancelledOrders;