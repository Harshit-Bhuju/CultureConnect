import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, Package, Trash2, ShoppingCart, AlertCircle, Sparkles, Star, ChevronDown } from 'lucide-react';
import { BASE_URL } from '../Configs/ApiEndpoints';

const Wishlist = ({ selectedPeriod, wishlistItems, removeFromWishlist, addToCart, loading }) => {
  const navigate = useNavigate();
  const [sortOrder, setSortOrder] = useState('newest');

  // Sort wishlist items
  const sortedWishlist = useMemo(() => {
    const sorted = [...wishlistItems];
    sorted.sort((a, b) => {
      const dateA = new Date(a.addedAt);
      const dateB = new Date(b.addedAt);
      return sortOrder === 'newest' ? dateB - dateA : dateA - dateB;
    });
    return sorted;
  }, [wishlistItems, sortOrder]);

  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-sm p-5">
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm p-5">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 bg-gradient-to-br from-pink-500 to-rose-500 rounded-xl flex items-center justify-center shadow-md">
            <Heart className="w-5 h-5 text-white fill-white" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-900">Wishlist</h2>
            <p className="text-xs text-gray-500">{wishlistItems.length} saved items</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {wishlistItems.length > 0 && (
            <>
              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-pink-50 rounded-full">
                <Star className="w-3.5 h-3.5 text-pink-500 fill-pink-500" />
                <span className="text-xs font-semibold text-pink-700">Favorites</span>
              </div>
              <div className="relative">
                <select
                  value={sortOrder}
                  onChange={(e) => setSortOrder(e.target.value)}
                  className="appearance-none pl-3 pr-8 py-1.5 bg-gray-50 border border-gray-300 rounded-lg text-xs font-medium text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-pink-500 cursor-pointer transition-colors"
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                </select>
                <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-gray-500 pointer-events-none" />
              </div>
            </>
          )}
        </div>
      </div>

      {sortedWishlist.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gradient-to-br from-pink-100 to-rose-100 rounded-2xl flex items-center justify-center mx-auto mb-3 relative">
            <Heart className="w-8 h-8 text-pink-500" />
            <div className="absolute -top-1 -right-1 w-5 h-5 bg-pink-500 rounded-full flex items-center justify-center animate-pulse">
              <Sparkles className="w-2.5 h-2.5 text-white" />
            </div>
          </div>
          <p className="text-gray-900 font-semibold mb-1">Nothing saved yet</p>
          <p className="text-xs text-gray-500 mb-4">Start adding your favorites</p>
          <button className="px-5 py-2 bg-gradient-to-r from-pink-500 to-rose-500 text-white text-sm font-medium rounded-lg hover:shadow-lg transition-all">
            Browse Products
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3.5">
          {sortedWishlist.map(item => (
            <div
              key={item.id}
              className="group relative bg-gradient-to-b from-gray-50 to-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg hover:border-pink-200 transition-all duration-300"
            >
              {/* Remove Button */}
              <button
                onClick={() => removeFromWishlist(item.id)}
                className="absolute top-2 right-2 z-10 w-7 h-7 bg-white/90 backdrop-blur-sm text-rose-500 hover:bg-rose-500 hover:text-white rounded-full shadow-md transition-all opacity-0 group-hover:opacity-100 flex items-center justify-center"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>

              {/* Status Badge */}
              {!item.inStock && (
                <div className="absolute top-2 left-2 z-10 bg-red-500/90 backdrop-blur-sm text-white text-xs font-medium px-2 py-0.5 rounded-full">
                  Unavailable
                </div>
              )}

              {/* Product Image */}
              <div
                onClick={() => navigate(`/products/${item.sellerId}/${item.productId}`)}
                className={`relative w-full h-40 bg-gray-50 flex items-center justify-center cursor-pointer border-b border-gray-100 overflow-hidden ${!item.inStock ? 'opacity-50' : ''}`}
              >
                {item.productImage ? (
                  <img
                    src={`${BASE_URL}/uploads/product_images/${item.productImage}`}
                    alt={item.productName}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                ) : (
                  <Package className="w-10 h-10 text-gray-400 group-hover:scale-110 transition-transform duration-300" />
                )}
                {item.inStock && (
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                )}
              </div>

              {/* Product Info */}
              <div className="p-3">
                <h3
                  onClick={() => navigate(`/products/${item.sellerId}/${item.productId}`)}
                  className="text-sm font-semibold text-gray-900 line-clamp-2 mb-1 min-h-[2.5rem] leading-tight cursor-pointer hover:text-pink-600 transition-colors"
                >
                  {item.productName}
                </h3>

                <div className="flex items-baseline gap-1.5 mb-3">
                  <span className="text-base font-bold text-pink-600">
                    Rs. {item.price.toLocaleString()}
                  </span>
                </div>

                {/* Action Button */}
                {item.inStock ? (
                  <button
                    onClick={() => addToCart(item)}
                    className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white text-xs font-semibold py-2 rounded-lg transition-all shadow-sm hover:shadow-md flex items-center justify-center gap-1.5"
                  >
                    <ShoppingCart className="w-3.5 h-3.5" />
                    Add to Cart
                  </button>
                ) : (
                  <button
                    className="w-full bg-gray-100 text-gray-400 text-xs font-semibold py-2 rounded-lg cursor-not-allowed flex items-center justify-center gap-1.5"
                  >
                    <AlertCircle className="w-3.5 h-3.5" />
                    Out of Stock
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Footer Tip */}
      {sortedWishlist.length > 0 && (
        <div className="mt-4 flex items-start gap-2 p-3 bg-gradient-to-r from-pink-50 to-rose-50 rounded-xl">
          <Sparkles className="w-4 h-4 text-pink-500 flex-shrink-0 mt-0.5" />
          <p className="text-xs text-gray-600">
            <span className="font-semibold text-gray-900">Quick Tip:</span> Items may sell out fast. Add to cart to secure them!
          </p>
        </div>
      )}
    </div>
  );
};

export default Wishlist;