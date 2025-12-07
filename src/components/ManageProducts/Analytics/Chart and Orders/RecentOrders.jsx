import React, { useState, useMemo } from 'react';
import { getAllRecentOrders, updateOrderStatus } from '../../Data/data';
import { Filter, ChevronDown, Package } from 'lucide-react';
import toast from 'react-hot-toast';

const RecentOrders = () => {
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortOrder, setSortOrder] = useState('newest');
  const [refreshKey, setRefreshKey] = useState(0);

  const handleMarkAsShipped = (userId) => {
    const success = updateOrderStatus(userId, 'shipped');
    if (success) {
      setRefreshKey(prev => prev + 1); // Force re-render
      toast.success('Order marked as shipped successfully!');
    } else {
      toast.error('Failed to update order status');
    }
  };

  const filteredOrders = useMemo(() => {
    let orders = getAllRecentOrders();
    
    orders = orders.filter(order => 
      order.status === 'processing' || order.status === 'shipped'
    );

    // Apply additional filter
    if (statusFilter !== 'all') {
      orders = orders.filter(order => order.status === statusFilter);
    }

    // Sort orders
    orders.sort((a, b) => {
      const dateA = new Date(a.orderDate);
      const dateB = new Date(b.orderDate);
      return sortOrder === 'newest' ? dateB - dateA : dateA - dateB;
    });

    return orders;
  }, [statusFilter, sortOrder, refreshKey]);

  // Group orders by date
  const groupedOrders = useMemo(() => {
    const groups = {};
    
    filteredOrders.forEach(order => {
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
  }, [filteredOrders]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'processing':
        return 'border border-orange-500 text-orange-600 bg-orange-50';
      case 'shipped':
        return 'bg-blue-500 text-white';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusDisplay = (status) => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

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
            <h2 className="text-xl font-semibold text-gray-800">Recent Orders</h2>
            <p className="text-sm text-gray-500 mt-1">
              Active orders (Processing & Shipped)
            </p>
          </div>
          <div className="flex items-center gap-3">
            {/* Status Filter */}
            <div className="relative">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="appearance-none pl-4 pr-10 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-orange-500 cursor-pointer transition-colors"
              >
                <option value="all">All Status</option>
                <option value="processing">Processing</option>
                <option value="shipped">Shipped</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
            </div>

            {/* Sort Order */}
            <div className="relative">
              <select
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
                className="appearance-none pl-4 pr-10 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-orange-500 cursor-pointer transition-colors"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
            </div>
          </div>
        </div>
      </div>

      {/* Orders List */}
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
              {/* Date Header */}
              <div className="flex items-center mb-3">
                <div className="text-sm font-semibold text-gray-900 bg-gray-100 px-3 py-1 rounded-full">
                  {date}
                </div>
                <div className="flex-1 h-px bg-gray-200 ml-4"></div>
              </div>

              {/* Orders for this date */}
              <div className="space-y-3">
                {orders.map((order) => (
                  <div
                    key={order.user_id}
                    className="flex items-start justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex-1">
                      <div className="flex items-start gap-4">
                        <div className="flex-1">
                          <h3 className="text-gray-900 font-medium mb-1">
                            {order.productName}
                          </h3>
                          <div className="space-y-1">
                            <p className="text-sm text-gray-600">
                              <span className="font-medium">Customer:</span> {order.customerName}
                            </p>
                            <p className="text-sm text-gray-600">
                              <span className="font-medium">Email:</span> {order.customerEmail}
                            </p>
                            <p className="text-xs text-gray-500 mt-2">
                              Order ID: {order.user_id} · {formatTime(order.orderDate)}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-2 ml-4">
                      {order.status === 'processing' ? (
                        <button
                          onClick={() => handleMarkAsShipped(order.user_id)}
                          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg transition-colors flex items-center gap-2"
                        >
                          <Package className="w-4 h-4" />
                          Mark as Shipped
                        </button>
                      ) : (
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(order.status)}`}>
                          {getStatusDisplay(order.status)}
                        </span>
                      )}
                      <div className="text-right">
                        <p className="text-xs text-gray-500">Qty: {order.quantity}</p>
                        <p className="text-lg font-bold text-gray-900 mt-1">
                          Rs. {order.totalAmount.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Footer Stats */}
      {filteredOrders.length > 0 && (
        <div className="mt-6 pt-4 border-t border-gray-200">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">
              Showing {filteredOrders.length} active order{filteredOrders.length !== 1 ? 's' : ''}
            </span>
            <span className="font-semibold text-gray-900">
              Total: Rs. {filteredOrders.reduce((sum, order) => sum + order.totalAmount, 0).toLocaleString()}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default RecentOrders;