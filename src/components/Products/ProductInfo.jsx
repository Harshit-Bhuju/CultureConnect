// src/components/ProductInfo.jsx
import React from "react";
import {
  Star,
  StarHalf,
  ShoppingCart,
  Plus,
  Minus,
  Package,
} from "lucide-react";
import Features from "./Features";
import { BASE_URL } from "../../Configs/ApiEndpoints";
import { useNavigate } from "react-router-dom";

const ProductInfo = ({
  product,
  selectedSize,
  setSelectedSize,
  quantity,
  setQuantity,
  handleAddToCart,
  handleBuyNow,
  sellerId,
}) => {
  const navigate = useNavigate();

  const renderStars = (rating = 0) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      const filled = i <= rating;
      const isHalf = i === Math.ceil(rating) && rating % 1 !== 0;
      if (isHalf) {
        stars.push(
          <StarHalf
            key={i}
            className="w-5 h-5 fill-yellow-400 text-yellow-400"
          />,
        );
      } else {
        stars.push(
          <Star
            key={i}
            className={`w-5 h-5 ${filled ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
          />,
        );
      }
    }
    return stars;
  };

  const getCategoryDisplay = (category) => {
    const categories = {
      "cultural-clothes": "Cultural Clothes",
      "musical-instruments": "Musical Instruments",
      "handicraft-decors": "Handicraft & Decors",
    };
    return categories[category] || category;
  };

  const getAudienceDisplay = (audience) => {
    const audiences = {
      men: "Men",
      women: "Women",
      boy: "Boys",
      girl: "Girls",
    };
    return audiences[audience] || audience;
  };

  const onAddToCart = () => {
    handleAddToCart();
  };

  return (
    <div className="space-y-6 mt-5">
      <div>
        <div
          className="flex items-center gap-3 mb-3 cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors"
          onClick={() => navigate(`/sellerprofile/${sellerId}`)}>
          <div className="flex-shrink-0">
            <img
              src={`${BASE_URL}/uploads/seller_img_datas/seller_logos/${product.storeLogo}`}
              alt={product.storeName}
              className="w-12 h-12 rounded-full object-cover border-2 border-gray-200"
            />
          </div>

          <div className="mb-1">
            <p className="font-semibold text-gray-900 text-lg">
              {product.storeName || "Seller"}
            </p>
            <span className="text-xs bg-blue-600 text-white px-2 py-0.5 rounded-full">
              Seller
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 mb-2">
          <span className="text-sm font-medium text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
            {getCategoryDisplay(product.category)}
          </span>
          {product.productType && (
            <span className="text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
              {product.productType}
            </span>
          )}
        </div>

        <h1 className="text-3xl font-bold text-gray-900">
          {product.productName}
        </h1>

        {product.culture && (
          <p className="text-sm text-gray-600 mt-2">
            Culture: <span className="font-semibold">{product.culture}</span>
          </p>
        )}
      </div>

      <div className="flex items-center gap-3">
        <div className="flex items-center">
          {renderStars(product.averageRating)}
        </div>
        <span className="text-sm text-gray-600">
          {product.rating} ({product.totalReviews} reviews)
        </span>
      </div>

      <div className="flex items-baseline gap-3">
        <span className="text-4xl font-bold text-gray-900">
          Rs {product.price.toLocaleString()}
        </span>
      </div>

      <div
        className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg ${
          product.stock > 20
            ? "bg-green-50 text-green-700"
            : product.stock > 0
              ? "bg-yellow-50 text-yellow-700"
              : "bg-red-50 text-red-700"
        }`}>
        <Package className="w-4 h-4" />
        <span className="font-semibold">
          {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
        </span>
      </div>

      {/* Sizes */}
      {(product.sizes?.length > 0 ||
        product.ageGroups?.length > 0 ||
        product.adultSizes?.length > 0 ||
        product.childAgeGroups?.length > 0) && (
        <div className="space-y-3">
          <div>
            <label className="font-semibold text-gray-900 mb-2 block">
              {product.audience
                ? `Select Size (${getAudienceDisplay(product.audience)}):`
                : "Select Size:"}
            </label>
            <div className="flex flex-wrap gap-2">
              {(product.sizes?.length > 0
                ? product.sizes
                : product.ageGroups?.length > 0
                  ? product.ageGroups
                  : product.adultSizes?.length > 0
                    ? product.adultSizes
                    : product.childAgeGroups
              )?.map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`px-4 py-2 border-2 rounded-lg font-medium transition ${
                    selectedSize === size
                      ? "border-blue-600 bg-blue-50 text-blue-700"
                      : "border-gray-300 hover:border-gray-400 text-gray-700"
                  }`}>
                  {size}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Quantity */}
      <div className="space-y-3">
        <label className="font-semibold text-gray-900">Quantity</label>
        <div className="flex items-center gap-4">
          <div className="flex items-center border-2 border-gray-300 rounded-lg overflow-hidden">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="px-4 py-2 hover:bg-gray-100 transition disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={quantity <= 1}>
              <Minus className="w-5 h-5" />
            </button>
            <span className="px-6 py-2 font-bold border-x-2">{quantity}</span>
            <button
              onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
              className="px-4 py-2 hover:bg-gray-100 transition disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={product.stock === 0 || quantity >= product.stock}>
              <Plus className="w-5 h-5" />
            </button>
          </div>
          <span className="text-gray-600">
            Total:{" "}
            <span className="font-bold text-gray-900">
              Rs {(product.price * quantity).toLocaleString()}
            </span>
          </span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-3 pt-4">
        <button
          onClick={onAddToCart}
          disabled={product.stock === 0}
          className="w-full bg-blue-600 text-white py-4 rounded-lg hover:bg-blue-700 transition flex justify-center items-center gap-2 shadow-md font-semibold text-lg disabled:opacity-50 disabled:cursor-not-allowed">
          <ShoppingCart className="w-5 h-5" /> Add to Cart
        </button>

        <button
          onClick={handleBuyNow}
          disabled={product.stock === 0}
          className="w-full bg-yellow-500 text-gray-900 py-4 rounded-lg hover:bg-yellow-600 transition shadow-md font-semibold text-lg disabled:opacity-50 disabled:cursor-not-allowed">
          Buy Now
        </button>
      </div>

      {/* Features */}
      <Features product={product} />

      {/* Tags */}
      {product.tags?.length > 0 && (
        <div className="pt-4 border-t">
          <p className="text-sm font-semibold text-gray-700 mb-2">Tags:</p>
          <div className="flex flex-wrap gap-2">
            {product.tags.map((tag, idx) => (
              <span
                key={idx}
                className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm hover:bg-gray-200 transition-colors">
                #{tag}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductInfo;
