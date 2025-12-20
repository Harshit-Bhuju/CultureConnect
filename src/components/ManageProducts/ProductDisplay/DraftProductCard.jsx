import React from 'react';
import { Edit2, Trash2, AlertTriangle, Upload } from 'lucide-react';
import Rating from '../../Products/RatingForProduct';
import { BASE_URL } from '../../../Configs/ApiEndpoints'; // Add this import

// Draft Product Card Component with Publish Button
export default function DraftProductCard({ product, onEdit, onDelete, onView, onPublish }) {
  const handleCardClick = (e) => {
    if (e.target.closest('.action-button')) {
      return;
    }
    onView(product);
  };

  const handleEdit = (e) => {
    e.stopPropagation();
    onEdit(product);
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    onDelete(product);
  };

  const handlePublish = (e) => {
    e.stopPropagation();
    onPublish(product);
  };

  // Calculate precise average rating from reviews (1.0 to 5.0)
  const calculateAverageRating = () => {
    if (!product.reviews || product.reviews.length === 0) {
      return 0;
    }
    
    const totalRating = product.reviews.reduce((sum, review) => sum + review.rating, 0);
    const average = totalRating / product.reviews.length;
    
    // Round to 1 decimal place for display (e.g., 4.7, 3.5)
    return Math.round(average * 10) / 10;
  };

  const avgRating = calculateAverageRating();
  const reviewCount = product.reviews?.length || 0;

  // Check if stock is low (matches ProductManagement threshold of 10)
  const isLowStock = product.stock <= 10;
const isOutOfStock = product.stock === 0;
  // Get the first image from the images array, or use a placeholder
 const productImage = product.images?.[0];
  
  // Construct full image URL
  const imageUrl = productImage 
    ? `${BASE_URL}/product_images/${productImage}` 
    : '/placeholder-image.png'; // fallback placeholder
  
  
  // Get product name (handle both 'name' and 'productName' properties)
  const productName = product.productName || product.name || 'Unnamed Product';

  return (
    <div
      onClick={handleCardClick}
      className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer group relative">
      
      {/* Status and Low Stock Badges */}
      <div className="absolute top-3 left-3 z-10 flex gap-2">
        {/* Draft Badge */}
        <span className="px-2 py-1 text-xs font-medium rounded bg-gray-100 text-gray-700">
          Draft
        </span>
        
        {/* Low Stock Badge */}
        {isLowStock && (
          <span className="px-2 py-1 text-xs font-medium rounded bg-orange-100 text-orange-700 flex items-center gap-1">
            <AlertTriangle className="w-3 h-3" />
            Low Stock
          </span>
        )}
           {isOutOfStock && (
          <span className="px-2 py-1 text-xs font-medium rounded bg-red-100 text-red-700 flex items-center gap-1">
            <AlertTriangle className="w-3 h-3" />
            Out of Stock
          </span>
        )}
      </div>

      {/* Action Buttons */}
      <div className="absolute top-3 right-3 z-10 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={handlePublish}
          className="action-button bg-green-600 p-2 rounded-full shadow-md hover:bg-green-700 transition-colors"
          title="Publish">
          <Upload className="w-4 h-4 text-white" />
        </button>
        <button
          onClick={handleEdit}
          className="action-button bg-white p-2 rounded-full shadow-md hover:bg-gray-50 transition-colors"
          title="Edit">
          <Edit2 className="w-4 h-4 text-gray-700" />
        </button>
        <button
          onClick={handleDelete}
          className="action-button bg-white p-2 rounded-full shadow-md hover:bg-red-50 transition-colors"
          title="Delete">
          <Trash2 className="w-4 h-4 text-red-600" />
        </button>
      </div>

      {/* Product Image */}
      <div className="relative h-48 bg-gray-100 overflow-hidden">
        <img
          src={imageUrl}
          alt={productName}
          className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
        />
      </div>

      {/* Product Info */}
      <div className="p-4">
        {/* Category */}
        <div className="text-xs text-gray-500 font-medium mb-1 uppercase">
          {product.category}
        </div>

        {/* Product Name */}
        <h3 className="text-base font-semibold text-gray-900 mb-2 line-clamp-1">
          {productName}
        </h3>

        {/* Description */}
        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
          {product.description}
        </p>

        {/* Rating - Only show if reviews exist */}
        {reviewCount > 0 && (
          <div className="mb-3">
            <Rating rating={avgRating} reviews={reviewCount} />
          </div>
        )}

        {/* Price and Stock */}
        <div className="flex items-center justify-between mt-auto">
          <span className="text-xl font-bold text-orange-600">
            Rs. {typeof product.price === 'number' ? product.price.toLocaleString() : parseFloat(product.price).toLocaleString()}
          </span>
          <span className={`text-sm font-medium ${
            isLowStock 
              ? 'text-orange-600' 
              : 'text-gray-500'
          }${isOutOfStock ? 'text-red-600' : ''}`}>
            {product.stock} in stock
          </span>
        </div>

        {/* Publish Button - Always visible at bottom */}
        <button
          onClick={handlePublish}
          className="action-button w-full mt-4 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg font-medium transition-colors flex items-center justify-center gap-2">
          <Upload className="w-4 h-4" />
          Publish Product
        </button>
      </div>
    </div>
  );
}