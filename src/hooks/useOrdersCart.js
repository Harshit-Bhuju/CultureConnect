import { useState, useEffect, useMemo } from 'react';
import API from '../Configs/ApiEndpoints';
import toast from 'react-hot-toast';

const useOrders = (selectedPeriod = 'Until now') => {
  const [allOrders, setAllOrders] = useState([]);
  const [wishlistItems, setWishlistItems] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch all data from API
  const fetchOrders = async (silent = false) => {
    try {
      if (!silent) setLoading(true);
      setError(null);

      const params = new URLSearchParams({ period: selectedPeriod });

      // Fetch cart items
      const cartResponse = await fetch(`${API.GET_CART_ITEMS}?${params}`, {
        credentials: 'include'
      });
      const cartData = await cartResponse.json();

      // Fetch wishlist items
      const wishlistResponse = await fetch(`${API.GET_WISHLIST_ITEMS}?${params}`, {
        credentials: 'include'
      });
      const wishlistData = await wishlistResponse.json();

      // Fetch recent orders (processing + shipped)
      const recentOrdersResponse = await fetch(`${API.GET_RECENT_ORDERS}?${params}`, {
        credentials: 'include'
      });
      const recentOrdersData = await recentOrdersResponse.json();

      // Fetch completed orders
      const completedOrdersResponse = await fetch(`${API.GET_COMPLETED_ORDERS}?${params}`, {
        credentials: 'include'
      });
      const completedOrdersData = await completedOrdersResponse.json();

      // Fetch cancelled orders
      const cancelledOrdersResponse = await fetch(`${API.GET_CANCELLED_ORDERS}?${params}`, {
        credentials: 'include'
      });
      const cancelledOrdersData = await cancelledOrdersResponse.json();

      // Set cart items
      if (cartData.success) {
        setCartItems(cartData.cartItems || []);
      } else {
        console.error('Failed to fetch cart items:', cartData.error);
        setCartItems([]);
      }

      // Set wishlist items
      if (wishlistData.success) {
        setWishlistItems(wishlistData.wishlistItems || []);
      } else {
        console.error('Failed to fetch wishlist items:', wishlistData.error);
        setWishlistItems([]);
      }

      // Combine all orders
      const combinedOrders = [
        ...(recentOrdersData.success ? recentOrdersData.orders : []),
        ...(completedOrdersData.success ? completedOrdersData.orders : []),
        ...(cancelledOrdersData.success ? cancelledOrdersData.orders : [])
      ];

      setAllOrders(combinedOrders);

    } catch (err) {
      console.error('Error fetching data:', err);
      setError(err.message);
      setAllOrders([]);
      setWishlistItems([]);
      setCartItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [selectedPeriod]);

  // Recent orders (processing + shipped) - NO CLIENT-SIDE FILTERING
  const recentOrders = useMemo(() => {
    return allOrders.filter(
      o => o.status === 'processing' || o.status === 'shipped'
    );
  }, [allOrders]);

  // Cancelled orders - NO CLIENT-SIDE FILTERING
  const cancelledOrders = useMemo(() => {
    return allOrders.filter(o => o.status === 'cancelled');
  }, [allOrders]);

  // Completed orders - NO CLIENT-SIDE FILTERING
  const completedOrders = useMemo(() => {
    return allOrders.filter(o => o.status === 'completed');
  }, [allOrders]);

  // Cart operations
  const updateCartQuantity = async (itemId, change) => {
    try {
      const formData = new FormData();
      formData.append('cartId', itemId);
      formData.append('change', change);

      const response = await fetch(API.UPDATE_CART_QUANTITY, {
        method: 'POST',
        credentials: 'include',
        body: formData
      });

      const data = await response.json();

      if (data.success) {
        // Update local state
        setCartItems(items =>
          items.map(item =>
            item.id === itemId
              ? { ...item, quantity: data.newQuantity }
              : item
          )
        );
        console.log('Updated cart quantity:', data);
      } else {
        console.error('Failed to update cart quantity:', data.error);
        toast.error(data.error || 'Failed to update quantity');
      }
    } catch (error) {
      console.error('Error updating cart quantity:', error);
      toast.error('Failed to update quantity. Please try again.');
    }
  };

  const removeFromCart = async (itemId) => {
    try {
      const formData = new FormData();
      formData.append('cartId', itemId);

      const response = await fetch(API.REMOVE_FROM_CART, {
        method: 'POST',
        credentials: 'include',
        body: formData
      });

      const data = await response.json();

      if (data.success) {
        // Update local state
        setCartItems(items => items.filter(item => item.id !== itemId));
        toast.success('Item removed from cart!');
      } else {
        console.error('Failed to remove from cart:', data.error);
        toast.error(data.error || 'Failed to remove item');
      }
    } catch (error) {
      console.error('Error removing from cart:', error);
      toast.error('Failed to remove item. Please try again.');
    }
  };

  // Wishlist operations
  const removeFromWishlist = async (id) => {
    try {
      const formData = new FormData();
      formData.append('wishlistId', id);

      const response = await fetch(API.REMOVE_FROM_WISHLIST, {
        method: 'POST',
        credentials: 'include',
        body: formData
      });

      const data = await response.json();

      if (data.success) {
        // Update local state
        setWishlistItems(prev => prev.filter(item => item.id !== id));
        toast.success('Item removed from wishlist!');
      } else {
        toast.error(data.error || 'Failed to remove from wishlist');
      }
    } catch (error) {
      toast.error('Failed to remove from wishlist. Please try again.');
    }
  };

  const addToCart = async (item) => {
    try {
      const formData = new FormData();
      formData.append('productId', item.productId);
      formData.append('quantity', 1);

      const response = await fetch(API.ADD_TO_CART, {
        method: 'POST',
        credentials: 'include',
        body: formData
      });

      const data = await response.json();

      if (data.success) {
        // Refresh cart items silently
        await fetchOrders(true);
        toast.success(`${item.productName} ${data.updated ? 'quantity updated' : 'added to cart'}!`);
      } else {
        console.error('Failed to add to cart:', data.error);
        toast.error(data.error || 'Failed to add to cart');
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast.error('Failed to add to cart. Please try again.');
    }
  };

  // Debug logging
  console.log('useOrders hook returning:', {
    allOrders: allOrders.length,
    wishlistItems: wishlistItems.length,
    cartItems: cartItems.length,
    completedOrders: completedOrders.length,
    cancelledOrders: cancelledOrders.length,
    recentOrders: recentOrders.length,
    loading,
    error,
    selectedPeriod
  });

  return {
    allOrders,
    recentOrders,
    completedOrders,
    cancelledOrders,
    wishlistItems,
    cartItems,
    loading,
    error,
    refreshOrders: fetchOrders,
    removeFromWishlist,
    addToCart,
    updateCartQuantity,
    removeFromCart
  };
};

export default useOrders;