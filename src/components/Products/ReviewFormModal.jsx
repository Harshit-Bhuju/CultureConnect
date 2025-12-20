// src/components/ReviewFormModal.jsx
import React, { useState } from "react"; // Note: Added useState for hoverRating inside the modal
import { Star, X } from "lucide-react";
import { BASE_URL } from '../../Configs/ApiEndpoints';


const ReviewFormModal = ({
  isOpen,
  onClose,
  product,
  editingReviewId,
  reviewRating,
  setReviewRating,
  reviewTitle,
  setReviewTitle,
  reviewText,
  setReviewText,
  isSubmitting,
  handleSubmitReview,
}) => {
  const [hoverRating, setHoverRating] = useState(0); // Local state for hover

  if (!isOpen) return null;

  const renderStars = (rating = 0, interactive = false, onRate = null) => {
    const stars = [];
    const displayRating = interactive ? (hoverRating || reviewRating) : rating;

    for (let i = 1; i <= 5; i++) {
      const filled = i <= displayRating;
      if (interactive) {
        stars.push(
          <button
            key={i}
            type="button"
            onClick={() => onRate(i)}
            onMouseEnter={() => setHoverRating(i)}
            onMouseLeave={() => setHoverRating(0)}
            className="focus:outline-none transition-transform hover:scale-110"
          >
            <Star
              className={`w-8 h-8 ${filled ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
            />
          </button>
        );
      } else {
        // Non-interactive not used here
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

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">
            {editingReviewId ? "Edit Your Review" : "Write a Review"}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        <form onSubmit={handleSubmitReview} className="p-6 space-y-6">
          {/* Product Info */}
          <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
            <img
              src={`${BASE_URL}/product_images/${product.images?.[0]}`}
              alt={product.productName}
              className="w-20 h-20 object-cover rounded-lg"
            />
            <div>
              <h3 className="font-semibold text-gray-900">{product.productName}</h3>
              <p className="text-sm text-gray-600">{getCategoryDisplay(product.category)}</p>
            </div>
          </div>
          {/* Rating */}
          <div className="space-y-2">
            <label className="block font-semibold text-gray-900">
              Your Rating <span className="text-red-500">*</span>
            </label>
            <div className="flex items-center gap-2">
              {renderStars(reviewRating, true, setReviewRating)}
            </div>
          </div>
          
          {/* Review Text */}
          <div className="space-y-2">
            <label className="block font-semibold text-gray-900">
              Your Review <span className="text-red-500">*</span>
            </label>
            <textarea
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              placeholder="Share your detailed experience with this product..."
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-600 focus:outline-none resize-none"
              rows="6"
              required
              minLength={10}
              maxLength={500}
            />
            <p className="text-sm text-gray-500">
              {reviewText.length} / 500 characters {reviewText.length < 10 && "(minimum 10)"}
            </p>
          </div>
          {/* Guidelines */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-semibold text-blue-900 mb-2">Review Guidelines:</h4>
            <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
              <li>Be honest and respectful</li>
              <li>Focus on product features and quality</li>
              <li>Share specific details about your experience</li>
              <li>Review: Minimum 10 characters</li>
            </ul>
          </div>
          {/* Submit Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-semibold"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Submitting..." : editingReviewId ? "Update Review" : "Submit Review"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReviewFormModal;