// src/components/Reviews.jsx
import React from "react";
import { Star, StarHalf, MessageCircle, Edit, Trash2 } from "lucide-react";

const CURRENT_USER_ID = "user_123";

const Reviews = ({ product, openReviewForm, openDeleteModal }) => {
  const renderStars = (rating = 0) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      const filled = i <= rating;
      const isHalf = i === Math.ceil(rating) && rating % 1 !== 0;
      if (isHalf) {
        stars.push(<StarHalf key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />);
      } else {
        stars.push(
          <Star
            key={i}
            className={`w-5 h-5 ${filled ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
          />
        );
      }
    }
    return stars;
  };

  const hasUserReviewed = product?.reviews?.some((r) => r.userId === CURRENT_USER_ID);
  const currentUserReview = product?.reviews?.find((r) => r.userId === CURRENT_USER_ID);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <span className="text-4xl font-bold">{product.rating || 0}</span>
            <div>
              <div className="flex">{renderStars(product.rating)}</div>
              <p className="text-sm text-gray-600">{product.totalReviews || 0} reviews</p>
            </div>
          </div>
        </div>
        {!hasUserReviewed ? (
          <button
            onClick={() => openReviewForm()}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition font-semibold shadow-md"
          >
            Write a Review
          </button>
        ) : (
          <button
            onClick={() => openReviewForm(currentUserReview)}
            className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition font-semibold shadow-md flex items-center gap-2"
          >
            <Edit className="w-4 h-4" /> Edit Your Review
          </button>
        )}
      </div>
      {product.reviews?.length > 0 ? (
        <div className="space-y-6">
          {product.reviews.map((review) => {
            const isMyReview = review.userId === CURRENT_USER_ID;
            return (
              <div
                key={review.id}
                className={`border-b pb-6 last:border-b-0 ${isMyReview ? "bg-blue-50/30 rounded-lg p-4 -m-4" : ""}`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-semibold text-gray-900">{review.author}</p>
                      {isMyReview && (
                        <span className="text-xs bg-blue-600 text-white px-2 py-1 rounded-full">You</span>
                      )}
                    </div>
                    <p className="text-sm text-gray-500">{review.date}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex">{renderStars(review.rating)}</div>
                    {isMyReview && (
                      <div className="flex gap-2">
                        <button
                          onClick={() => openReviewForm(review)}
                          className="text-blue-600 hover:bg-blue-100 p-2 rounded-lg transition"
                          title="Edit"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => openDeleteModal(review.id)}
                          className="text-red-600 hover:bg-red-100 p-2 rounded-lg transition"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
                {review.title && <h4 className="font-semibold text-gray-800 mb-1">{review.title}</h4>} {/* New: Show title */}
                <p className="text-gray-700">{review.comment}</p>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-12">
          <MessageCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 text-lg mb-4">No reviews yet. Be the first to review!</p>
          <button
            onClick={() => openReviewForm()}
            className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition font-bold"
          >
            Write a Review
          </button>
        </div>
      )}
    </div>
  );
};

export default Reviews;