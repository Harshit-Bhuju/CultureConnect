import React, { useState, useMemo } from 'react';
import { Filter, ChevronDown, Package, MapPin, Clock, Hash, CreditCard ,CheckCircle2} from 'lucide-react';
import toast from 'react-hot-toast';
import useOrders from '../../../../hooks/useOrders';
import { BASE_URL } from '../../../../Configs/ApiEndpoints';

const RecentOrders = ({ selectedPeriod }) => {
  const { recentOrders: allRecentOrders, loading, updateOrderStatus } = useOrders(selectedPeriod);

  const [statusFilter, setStatusFilter] = useState('all');
  const [sortOrder, setSortOrder] = useState('newest');

  const handleMarkAsShipped = (orderNumber) => {
    updateOrderStatus(orderNumber, 'shipped').then(success => {
      if (success) {
        toast.success('Order marked as shipped successfully!');
      } else {
        toast.error('Failed to update order status');
      }
    });
  };

  const filteredOrders = useMemo(() => {
    let orders = [...allRecentOrders];

    if (statusFilter !== 'all') {
      orders = orders.filter(order => order.status === statusFilter);
    }

    orders.sort((a, b) => {
      const dateA = new Date(a.orderDate);
      const dateB = new Date(b.orderDate);
      return sortOrder === 'newest' ? dateB - dateA : dateA - dateB;
    });

    return orders;
  }, [allRecentOrders, statusFilter, sortOrder]);
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

    filteredOrders.forEach(order => {
      const date = new Date(order.orderDate);
          const dateKey = formatDateLabel(date, selectedPeriod);


      if (!groups[dateKey]) {
        groups[dateKey] = [];
      }
      groups[dateKey].push(order);
    });

    return groups;
  }, [filteredOrders]);

  const getPaymentStatusColor = (status) => {
    switch (status) {
      case 'Paid':
        return 'bg-green-100 text-green-700';
      case 'Pending':
        return 'bg-yellow-100 text-yellow-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

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
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-semibold text-gray-800">Recent Orders</h2>
            <p className="text-sm text-gray-500 mt-1">
              Active orders (Processing & Shipped) - {getPeriodLabel()}
            </p>
          </div>
          <div className="flex items-center gap-3">
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

      {filteredOrders.length > 0 && (
        <div className="mt-6 mb-4 pt-4 border-t border-gray-200">
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900">
                {filteredOrders.length}
              </p>
              <p className="text-xs text-gray-500 mt-1">Active Orders</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-orange-600">
                {filteredOrders.reduce((sum, order) => sum + order.quantity, 0)}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {statusFilter === 'shipped' ? 'Items Shipped' : 'Items Processing'}
              </p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900">
                Rs. {filteredOrders.reduce((sum, order) => sum + order.totalAmount, 0).toLocaleString()}
              </p>
              <p className="text-xs text-gray-500 mt-1">Active Revenue</p>
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
              {selectedPeriod === 'This month' 
                ? 'No active orders this month'
                : selectedPeriod === 'This year'
                ? 'No active orders this year'
                : 'Try adjusting your filters'}
            </p>
          </div>
        ) : (
          Object.entries(groupedOrders).map(([date, orders]) => (
            <div key={date}>
              <div className="flex items-center mb-3">
                <div className="text-sm font-semibold text-gray-900 bg-orange-50 border border-orange-200 px-3 py-1 rounded-full">
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
                    key={order.order_number}
                    className="border border-gray-200 rounded-lg p-5 hover:shadow-md transition-shadow bg-white"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-shrink-0 w-12 h-12  rounded-lg flex items-center justify-center">
                          <img
                           src={`${BASE_URL}/product_images/${order.productImage}`}
                           alt={order.productName} />
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
                          {order.status === 'processing' && (
                            <button
                              onClick={() => handleMarkAsShipped(order.order_number)}
                              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg transition-colors flex items-center gap-2"
                            >
                              <Package className="w-4 h-4" />
                              Mark as Shipped
                            </button>
                          )}
                        </div>

                        <div className="grid grid-cols-2 gap-x-6 gap-y-3 mt-4">
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
                              Estimated Delivery
                            </p>
                            <p className="text-sm text-gray-900">{order.estimated_delivery_time}</p>
                            <p className="text-xs text-gray-400 mt-0.5">(Includes 2 days for packaging & processing)</p>
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

                        <div className="grid grid-cols-4 gap-4 mt-4 pt-4 border-t border-gray-100">
                          <div>
                            <p className="text-xs text-gray-500 font-medium">Unit Price</p>
                            <p className="text-sm text-gray-900">Rs. {order.productPrice?.toLocaleString()}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500 font-medium">Quantity</p>
                            <p className="text-sm text-gray-900">{order.quantity}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500 font-medium">Delivery Charge</p>
                            <p className="text-sm text-gray-900">Rs. {order.delivery_charge}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500 font-medium">Total Amount</p>
                            <p className="text-lg font-bold text-gray-900">Rs. {order.totalAmount.toLocaleString()}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-4 mt-4 pt-3 border-t border-gray-100">
                          <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${getStatusColor(order.status)}`}>
                            {getStatusDisplay(order.status)}
                          </span>
                          <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${getPaymentStatusColor(order.payment_status)}`}>
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
  );
};

export default RecentOrders;