import React from 'react';
import { Edit2, Trash2, AlertTriangle } from 'lucide-react';
import Rating from '../../Products/RatingForProduct';
import { BASE_URL } from '../../../Configs/ApiEndpoints';

const ProductListRow = ({ product, onView, onEdit, onDelete }) => {
  const handleRowClick = () => {
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

  // Average rating calculation
  const calculateAverageRating = () => {
    if (!product.reviews || product.reviews.length === 0) return 0;
    const total = product.reviews.reduce((sum, r) => sum + r.rating, 0);
    return Math.round((total / product.reviews.length) * 10) / 10;
  };

  const avgRating = calculateAverageRating();
  const reviewCount = product.reviews?.length || 0;

  // Stock status
  const isLowStock = product.stock <= 10 && product.stock > 0;
  const isOutOfStock = product.stock === 0;

  // Image
  const productImage = product.images?.[0];
  const imageUrl = productImage
    ? `${BASE_URL}/product_images/${productImage}`
    : '/placeholder-image.png';

  const productName = product.productName || product.name || 'Unnamed Product';

  return (
    <div
      onClick={handleRowClick}
      className="grid grid-cols-12 gap-4 px-6 py-4 items-center hover:bg-orange-50 transition-colors cursor-pointer group relative"
    >
      {/* Image */}
      <div className="col-span-1 relative">
        <img
          src={imageUrl}
          alt={productName}
          className="w-16 h-16 object-cover rounded-lg shadow-sm group-hover:shadow-md transition-shadow"
          onError={(e) => {
            e.target.src = '/placeholder-image.png';
          }}
        />
        {/* Stock badges */}
        {isLowStock && (
          <div className="absolute -top-1 -right-1 bg-orange-500 rounded-full p-1">
            <AlertTriangle className="w-3 h-3 text-white" />
          </div>
        )}
        {isOutOfStock && (
          <div className="absolute -top-1 -right-1 bg-red-500 rounded-full p-1">
            <AlertTriangle className="w-3 h-3 text-white" />
          </div>
        )}
      </div>

      {/* Product Details */}
      <div className="col-span-3">
        <h3 className="font-semibold text-gray-900 mb-1 line-clamp-1 group-hover:text-orange-600 transition-colors">
          {productName}
        </h3>
        <p className="text-xs text-gray-500 line-clamp-1">{product.description}</p>
      </div>

      {/* Category */}
      <div className="col-span-2">
        <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-700 group-hover:bg-orange-100 group-hover:text-orange-700 transition-colors">
          {product.category}
        </span>
      </div>

      {/* Price */}
      <div className="col-span-1">
        <span className="font-bold text-orange-600 text-base">
          Rs. {typeof product.price === 'number' ? product.price.toLocaleString() : parseFloat(product.price).toLocaleString()}
        </span>
      </div>

      {/* Stock */}
      <div className="col-span-1">
        <div className="flex items-center gap-1">
          <span className={`font-semibold ${isOutOfStock ? 'text-red-600' : isLowStock ? 'text-orange-600' : 'text-gray-900'}`}>
            {product.stock}
          </span>
          {isLowStock && <span className="text-xs text-orange-600 font-medium">Low</span>}
          {isOutOfStock && <span className="text-xs text-red-600 font-medium">Out</span>}
        </div>
      </div>

      {/* Rating */}
      <div className="col-span-2">
        {reviewCount > 0 ? (
          <Rating rating={avgRating} reviews={reviewCount} />
        ) : (
          <span className="text-xs text-gray-400">No reviews</span>
        )}
      </div>

      {/* Status */}
      <div className="col-span-1">
        <span
          className={`inline-flex px-2.5 py-1 rounded-full text-xs font-semibold ${
            product.status === 'Active'
              ? 'bg-green-100 text-green-700'
              : product.status === 'Draft'
              ? 'bg-gray-100 text-gray-700'
              : 'bg-yellow-100 text-yellow-700'
          }`}
        >
          {product.status}
        </span>
      </div>

      {/* Actions */}
      <div className="col-span-1">
        <div className="flex gap-2 justify-end">
          <button
            onClick={handleEdit}
            className="p-2 rounded-lg text-gray-400 hover:text-orange-600 hover:bg-orange-100 transition-all"
            title="Edit Product"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <button
            onClick={handleDelete}
            className="p-2 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-100 transition-all"
            title="Delete Product"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductListRow;
