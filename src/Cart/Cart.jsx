import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingCart, Package, Heart, XCircle, CheckCircle2, Trash2, Plus, Minus, MapPin, Clock, Hash, CreditCard, AlertCircle, ArrowRight, ChevronDown, ArrowLeft, Calendar } from 'lucide-react';
import BuyerCancelledOrders from './Cancelled';
import TransactionHistory from './TransactionHistory';
import Wishlist from './Wishlist';
import MyOrders from './MyOrders';
import useOrders from '../hooks/useOrdersCart';

const CustomerCartComponent = () => {
  const [activeTab, setActiveTab] = useState('cart');
  const [selectedPeriod, setSelectedPeriod] = useState('Until now');
  const [selectedItem, setSelectedItem] = useState(null);
  const [cartSortOrder, setCartSortOrder] = useState('newest');
  const navigate = useNavigate();
  
  // Get all data from the hook
  const { 
    cartItems = [], 
    updateCartQuantity, 
    removeFromCart,
    loading 
  } = useOrders(selectedPeriod);

  // Filter cart items by period
  const filteredCartItems = React.useMemo(() => {
    if (selectedPeriod === 'Until now') {
      return cartItems;
    }
    
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth();
    
    return cartItems.filter((item) => {
      const itemDate = new Date(item.addedAt);
      
      if (selectedPeriod === 'This month') {
        return itemDate.getFullYear() === currentYear && 
               itemDate.getMonth() === currentMonth;
      }
      
      if (selectedPeriod === 'This year') {
        return itemDate.getFullYear() === currentYear;
      }
      
      return true;
    });
  }, [cartItems, selectedPeriod]);

  // Group cart items by store
  const groupedCartItems = React.useMemo(() => {
    const sorted = [...filteredCartItems].sort((a, b) => {
      const dateA = new Date(a.addedAt);
      const dateB = new Date(b.addedAt);
      return cartSortOrder === 'newest' ? dateB - dateA : dateA - dateB;
    });

    const groups = {};
    sorted.forEach(item => {
      const store = item.storeName || 'Unknown Store';
      if (!groups[store]) {
        groups[store] = [];
      }
      groups[store].push(item);
    });
    return groups;
  }, [filteredCartItems, cartSortOrder]);

  const handleSelectItem = (item) => {
    setSelectedItem(item);
  };

  const selectedItemTotal = selectedItem ? selectedItem.price * selectedItem.quantity : 0;
  const deliveryCharge = selectedItem ? 100 : 0;
  const finalTotal = selectedItemTotal + deliveryCharge;

  // Show loading state
  if (loading && activeTab === 'cart') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
      </div>
    );
  }

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
                className="flex items-center gap-2 px-3 py-2 text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                <span className="font-medium">Back</span>
              </button>
              <div className="h-6 w-px bg-gray-300"></div>
              <h1 className="text-2xl font-bold text-gray-900">My Orders & Cart</h1>
            </div>
            
         
          </div>
          
          {/* Navigation Tabs */}
          <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex gap-2 overflow-x-auto pb-2">
            <button
              onClick={() => setActiveTab('cart')}
              className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-all flex items-center gap-2 whitespace-nowrap ${
                activeTab === 'cart'
                  ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg shadow-orange-500/30'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <ShoppingCart className="w-4 h-4" />
              Cart
            </button>
            <button
              onClick={() => setActiveTab('orders')}
              className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-all flex items-center gap-2 whitespace-nowrap ${
                activeTab === 'orders'
                  ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/30'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <Package className="w-4 h-4" />
              Orders
            </button>
            <button
              onClick={() => setActiveTab('wishlist')}
              className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-all flex items-center gap-2 whitespace-nowrap ${
                activeTab === 'wishlist'
                  ? 'bg-gradient-to-r from-pink-500 to-pink-600 text-white shadow-lg shadow-pink-500/30'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <Heart className="w-4 h-4" />
              Wishlist
            </button>
            <button
              onClick={() => setActiveTab('cancelled')}
              className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-all flex items-center gap-2 whitespace-nowrap ${
                activeTab === 'cancelled'
                  ? 'bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg shadow-red-500/30'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <XCircle className="w-4 h-4" />
              Cancelled
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-all flex items-center gap-2 whitespace-nowrap ${
                activeTab === 'history'
                  ? 'bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg shadow-green-500/30'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
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
                    setSelectedItem(null);
                  }}
                  className="appearance-none pl-3 pr-9 py-2 bg-white border-2 border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 cursor-pointer transition-all shadow-sm"
                >
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
        {activeTab === 'cart' && (
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Cart Items Section */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                    <ShoppingCart className="w-6 h-6 text-orange-600" />
                    Shopping Cart
                    {selectedPeriod !== 'Until now' && (
                      <span className="text-sm font-normal text-gray-500">
                        ({selectedPeriod})
                      </span>
                    )}
                  </h2>
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-gray-500">{filteredCartItems.length} items</span>
                    <div className="relative">
                      <select
                        value={cartSortOrder}
                        onChange={(e) => setCartSortOrder(e.target.value)}
                        className="appearance-none pl-3 pr-8 py-1.5 bg-gray-50 border border-gray-300 rounded-lg text-xs font-medium text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-orange-500 cursor-pointer transition-colors"
                      >
                        <option value="newest">Newest First</option>
                        <option value="oldest">Oldest First</option>
                      </select>
                      <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-gray-500 pointer-events-none" />
                    </div>
                  </div>
                </div>
                
                {filteredCartItems.length === 0 ? (
                  <div className="text-center py-16">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-orange-100 to-orange-200 rounded-full mb-4">
                      <ShoppingCart className="w-10 h-10 text-orange-600" />
                    </div>
                    <p className="text-gray-700 font-semibold text-lg">
                      {selectedPeriod === 'Until now' 
                        ? 'Your cart is empty' 
                        : `No items added ${selectedPeriod.toLowerCase()}`}
                    </p>
                    <p className="text-sm text-gray-500 mt-2">
                      {selectedPeriod === 'Until now'
                        ? 'Add items to get started'
                        : 'Try selecting a different time period'}
                    </p>
                    {selectedPeriod !== 'Until now' && cartItems.length > 0 && (
                      <button 
                        onClick={() => setSelectedPeriod('Until now')}
                        className="mt-6 px-6 py-2.5 bg-orange-600 text-white rounded-lg font-medium hover:bg-orange-700 transition-colors"
                      >
                        View All Items
                      </button>
                    )}
                  </div>
                ) : (
                  <div className="space-y-6">
                    {Object.entries(groupedCartItems).map(([storeName, items]) => (
                      <div key={storeName}>
                        {/* Store Header */}
                        <div className="flex items-center mb-3">
                          <div className="flex items-center gap-2 bg-gradient-to-r from-orange-50 to-red-50 border border-orange-200 px-3 py-1.5 rounded-full">
                            <Package className="w-4 h-4 text-orange-600" />
                            <span className="text-sm font-semibold text-gray-800">{storeName}</span>
                          </div>
                          <div className="flex-1 h-px bg-gray-200 ml-3"></div>
                          <span className="text-xs text-gray-500 ml-3 font-medium">
                            {items.length} item{items.length !== 1 ? 's' : ''}
                          </span>
                        </div>

                        {/* Store Items */}
                        <div className="space-y-3">
                          {items.map((item) => (
                            <div 
                              key={item.id} 
                              className={`border-2 rounded-xl p-4 transition-all cursor-pointer ${
                                selectedItem?.id === item.id 
                                  ? 'border-orange-500 bg-orange-50 shadow-md' 
                                  : 'border-gray-200 hover:border-gray-300 hover:shadow-sm'
                              }`}
                              onClick={() => handleSelectItem(item)}
                            >
                              <div className="flex items-center gap-4">
                                {/* Selection Radio */}
                                <div className="flex-shrink-0">
                                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                                    selectedItem?.id === item.id 
                                      ? 'border-orange-500 bg-orange-500' 
                                      : 'border-gray-300'
                                  }`}>
                                    {selectedItem?.id === item.id && (
                                      <div className="w-2 h-2 bg-white rounded-full"></div>
                                    )}
                                  </div>
                                </div>

                                {/* Product Image */}
                                <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center flex-shrink-0">
                                  <Package className="w-8 h-8 text-gray-400" />
                                </div>
                                
                                {/* Product Details */}
                                <div className="flex-1 min-w-0">
                                  <h3 className="font-semibold text-gray-900 truncate">{item.productName}</h3>
                                  <p className="text-xs text-gray-500 mt-0.5">ID: {item.productId}</p>
                                  <p className="text-lg font-bold text-orange-600 mt-1">Rs. {item.price.toLocaleString()}</p>
                                </div>
                                
                                {/* Quantity Controls */}
                                <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      updateCartQuantity(item.id, -1);
                                    }}
                                    className="w-7 h-7 rounded-md bg-white border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors"
                                  >
                                    <Minus className="w-3 h-3" />
                                  </button>
                                  <span className="w-8 text-center font-semibold text-sm">{item.quantity}</span>
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      updateCartQuantity(item.id, 1);
                                    }}
                                    className="w-7 h-7 rounded-md bg-white border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors"
                                  >
                                    <Plus className="w-3 h-3" />
                                  </button>
                                </div>
                                
                                {/* Total */}
                                <div className="text-right flex-shrink-0 w-24">
                                  <p className="text-xs text-gray-500">Subtotal</p>
                                  <p className="font-bold text-gray-900">Rs. {(item.price * item.quantity).toLocaleString()}</p>
                                </div>
                                
                                {/* Remove Button */}
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    removeFromCart(item.id);
                                    if (selectedItem?.id === item.id) {
                                      setSelectedItem(null);
                                    }
                                  }}
                                  className="text-red-500 hover:text-red-700 p-2 hover:bg-red-50 rounded-lg transition-colors"
                                >
                                  <Trash2 className="w-5 h-5" />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {filteredCartItems.length > 0 && (
                  <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-blue-900">Single Item Checkout</p>
                      <p className="text-xs text-blue-700 mt-1">
                        Please select one item from your cart to proceed with checkout. You can make multiple orders separately.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Checkout Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-sm p-6 sticky top-24">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Order Summary</h3>
                
                {!selectedItem ? (
                  <div className="text-center py-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-3">
                      <Package className="w-8 h-8 text-gray-400" />
                    </div>
                    <p className="text-sm text-gray-500">Select an item to checkout</p>
                  </div>
                ) : (
                  <>
                    {/* Selected Item Details */}
                    <div className="mb-4 p-3 bg-orange-50 border border-orange-200 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center flex-shrink-0">
                          <Package className="w-6 h-6 text-orange-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-gray-900 text-sm truncate">{selectedItem.productName}</h4>
                          <p className="text-xs text-gray-600">Qty: {selectedItem.quantity}</p>
                        </div>
                      </div>
                    </div>

                    {/* Price Breakdown */}
                    <div className="space-y-3 mb-4 pb-4 border-b border-gray-200">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Item Subtotal</span>
                        <span className="font-semibold text-gray-900">Rs. {selectedItemTotal.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Delivery Charge</span>
                        <span className="font-semibold text-gray-900">Rs. {deliveryCharge}</span>
                      </div>
                    </div>

                    {/* Total */}
                    <div className="flex justify-between items-center mb-6">
                      <span className="text-base font-semibold text-gray-900">Total Amount</span>
                      <span className="text-2xl font-bold text-orange-600">Rs. {finalTotal.toLocaleString()}</span>
                    </div>

                    {/* Checkout Button */}
                    <button className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold py-3.5 rounded-lg transition-all shadow-lg shadow-orange-500/30 hover:shadow-xl hover:shadow-orange-500/40 flex items-center justify-center gap-2">
                      Proceed to Checkout
                      <ArrowRight className="w-5 h-5" />
                    </button>

                    {/* Additional Info */}
                    <div className="mt-4 space-y-2">
                      <div className="flex items-center gap-2 text-xs text-gray-600">
                        <CheckCircle2 className="w-4 h-4 text-green-600" />
                        <span>Secure checkout</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-gray-600">
                        <CheckCircle2 className="w-4 h-4 text-green-600" />
                        <span>Multiple payment options</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-gray-600">
                        <CheckCircle2 className="w-4 h-4 text-green-600" />
                        <span>Fast delivery</span>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        )}

        {/* MY ORDERS TAB */}
        {activeTab === 'orders' && (
          <MyOrders selectedPeriod={selectedPeriod} />
        )}

        {/* WISHLIST TAB */}
        {activeTab === 'wishlist' && (
          <Wishlist selectedPeriod={selectedPeriod} />
        )}

        {/* CANCELLED ORDERS TAB */}
        {activeTab === 'cancelled' && (
          <BuyerCancelledOrders selectedPeriod={selectedPeriod} />
        )}

        {/* HISTORY TAB */}
        {activeTab === 'history' && (
          <TransactionHistory selectedPeriod={selectedPeriod} />
        )}

      </main>
    </div>
  );
};

export default CustomerCartComponent;