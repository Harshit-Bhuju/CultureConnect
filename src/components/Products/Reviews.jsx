// src/components/Reviews.jsx
import React from "react";
import { Star, StarHalf, MessageCircle, Edit, Trash2, Store } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import API, { BASE_URL } from "../../Configs/ApiEndpoints";
import { useNavigate } from "react-router-dom";
const Reviews = ({ product, openReviewForm, openDeleteModal,sellerId }) => {
  const { user } = useAuth();
const navigate = useNavigate();
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

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      return "Today";
    } else if (diffDays === 1) {
      return "Yesterday";
    } else if (diffDays < 7) {
      return `${diffDays} days ago`;
    } else if (diffDays < 30) {
      const weeks = Math.floor(diffDays / 7);
      return `${weeks} ${weeks === 1 ? 'week' : 'weeks'} ago`;
    } else {
      return dateString;
    }
  };

  const hasUserReviewed = product?.reviews?.some((r) => r.userId === user?.id);
  const currentUserReview = product?.reviews?.find((r) => r.userId === user?.id);

  // Sort reviews by date (newest first)
  const sortedReviews = [...(product?.reviews || [])].sort((a, b) => {
    return new Date(b.date) - new Date(a.date);
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <span className="text-4xl font-bold">{product.averageRating?.toFixed(1) || '0.0'}</span>
            <div>
              <div className="flex">{renderStars(product.averageRating || 0)}</div>
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

      {sortedReviews.length > 0 ? (
        <div className="space-y-6">
          {sortedReviews.map((review) => {
            const isMyReview = review.userId === user?.id;
            const avatar =
              review.userImage && review.userImage.startsWith("http")
                ? review.userImage
                : review.userImage
                  ? `${API.UPLOADS}/${review.userImage}`
                  : `${API.UPLOADS}/default-image.jpg`;

            return (
              <div
                key={review.id}
                className={`border-b pb-6 last:border-b-0 ${isMyReview ? "bg-blue-50/30 rounded-lg p-4 -m-4" : ""}`}
              >
                {/* Main Review */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={avatar}
                      alt={review.author}
                      className="w-10 h-10 rounded-full object-cover"
                      onError={(e) => {
                        e.target.src = `${API.UPLOADS}/default-image.jpg`;
                      }}
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-semibold text-gray-900">{review.author}</p>
                        {isMyReview && (
                          <span className="text-xs bg-blue-600 text-white px-2 py-1 rounded-full">You</span>
                        )}
                      </div>
                      <p className="text-sm text-gray-500">{formatDate(review.date)}</p>
                    </div>
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
                <p className="text-gray-700">{review.comment}</p>

                {/* Seller Replies */}
                {review.replies && review.replies.length > 0 && (
                  <div className="mt-4 ml-8 space-y-3">
                    {review.replies.map((reply) => {

                      return (
                        <div
                          key={reply.id}
                          className="bg-gray-50 border border-gray-200 rounded-lg p-4"
                        >
                          <div className="flex items-start gap-3">
                            <div className="flex-shrink-0">

                              {reply.storeLogo ? (
                                <img
                                  src={`${BASE_URL}/seller_img_datas/seller_logos/${reply.storeLogo}`}
                                  alt={reply.storeName}
                                  className="w-8 h-8 rounded-full object-cover"
                                />
                              ) : (
                                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                                  <Store className="w-4 h-4 text-blue-600" />
                                </div>
                              )}
                            </div>

                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <p className="font-semibold text-gray-900 cursor-pointer"  onClick={() => navigate(`/sellerprofile/${sellerId}`)}>
                                  {reply.storeName || 'Seller'}
                                </p>
                                <span className="text-xs bg-blue-600 text-white px-2 py-0.5 rounded-full">
                                  Seller
                                </span>
                                <span className="text-xs text-gray-500">
                                  • {formatDate(reply.createdAt)}
                                  {reply.updatedAt !== reply.createdAt && ' (edited)'}
                                </span>
                              </div>
                              <p className="text-gray-700 text-sm">{reply.replyText}</p>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
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