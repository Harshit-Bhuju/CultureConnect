import { useState, useEffect, useMemo } from 'react';
import toast from 'react-hot-toast';
import API from '../Configs/ApiEndpoints';

export const useOrders = (selectedPeriod = 'Until now') => {
  const [allOrders, setAllOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);

  const fetchOrders = async () => {
    try {
      setLoading(true);

      const response = await fetch(API.GET_ALL_ORDERS, {
        method: 'GET',
        credentials: 'include',
      });

      const data = await response.json();

      if (data.success) {
        setAllOrders(data.orders);
        setStats(data.stats);
      } else {
        toast.error(data.error || 'Failed to fetch orders');
      }
    } catch (err) {
      console.error('Error fetching orders:', err);
      toast.error('Network error while fetching orders');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const updateOrderStatus = async (orderNumber, newStatus) => {
    try {
      const formData = new URLSearchParams();
      formData.append('order_number', orderNumber);
      formData.append('new_status', newStatus);

      const response = await fetch(API.UPDATE_ORDER_STATUS, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formData.toString(),
      });

      const data = await response.json();

      if (data.success) {
        toast.success('Order status updated successfully!');
        fetchOrders(); // Refresh orders
        return true;
      } else {
        toast.error(data.error || 'Failed to update order status');
        return false;
      }
    } catch (err) {
      console.error('Error updating order:', err);
      toast.error('Network error while updating order');
      return false;
    }
  };

  // Helper function to filter orders by period
  const filterOrdersByPeriod = (orders, dateField) => {
    if (selectedPeriod === 'Until now') {
      return orders;
    }

    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth();

    return orders.filter(order => {
      // Parse the date string (format: "13 December 2024 3:45 PM")
      const orderDate = new Date(order[dateField]);
      
      if (selectedPeriod === 'This month') {
        return orderDate.getFullYear() === currentYear && 
               orderDate.getMonth() === currentMonth;
      } else if (selectedPeriod === 'This year') {
        return orderDate.getFullYear() === currentYear;
      }
      
      return true;
    });
  };

  // Separate orders by type with period filtering
  const recentOrders = useMemo(() => {
    const orders = allOrders.filter(order => 
      order.status === 'processing' || order.status === 'shipped'
    );
    // Use orderDate (created_at) for recent orders
    return filterOrdersByPeriod(orders, 'orderDate');
  }, [allOrders, selectedPeriod]);

  const completedOrders = useMemo(() => {
    const orders = allOrders.filter(order => order.status === 'completed');
    // Use updatedAt for completed orders
    return filterOrdersByPeriod(orders, 'updatedAt');
  }, [allOrders, selectedPeriod]);

  const cancelledOrders = useMemo(() => {
    const orders = allOrders.filter(order => order.status === 'cancelled');
    // Use updatedAt for cancelled orders
    return filterOrdersByPeriod(orders, 'updatedAt');
  }, [allOrders, selectedPeriod]);

  return {
    allOrders,
    recentOrders,
    completedOrders,
    cancelledOrders,
    stats,
    loading,
    updateOrderStatus,
    refreshOrders: fetchOrders
  };
};

export default useOrders;