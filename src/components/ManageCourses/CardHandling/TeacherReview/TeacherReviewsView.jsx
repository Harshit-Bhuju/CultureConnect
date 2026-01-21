import React, { useState } from "react";
import {
  Star,
  StarHalf,
  MessageCircle,
  Reply,
  Send,
  X,
  Edit as EditIcon,
  Trash2,
  Store,
  Check,
  User,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import DeleteReviewModal from "./DeleteReviewModal";
import API, { BASE_URL } from "../../../../Configs/ApiEndpoints";

const TeacherReviewsView = ({
  course,
  onSubmitReply,
  onDeleteReply,
  teacherId,
}) => {
  const [replyingTo, setReplyingTo] = useState(null);
  const [editingReply, setEditingReply] = useState(null);
  const [reviewToDelete, setReviewToDelete] = useState(null);
  const [replyText, setReplyText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [localReviews, setLocalReviews] = useState(course?.reviews || []);
  const navigate = useNavigate();

  // Update local reviews when course prop changes
  React.useEffect(() => {
    if (course?.reviews) {
      setLocalReviews(course.reviews);
    }
  }, [course?.reviews]);

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

  const formatDate = (dateString) => {
    try {
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
        return `${weeks} ${weeks === 1 ? "week" : "weeks"} ago`;
      } else {
        return date.toLocaleDateString();
      }
    } catch (error) {
      console.error("Error formatting date:", dateString, error);
      return "Unknown date";
    }
  };

  const handleReplySubmit = async (reviewId, isEdit = false) => {
    if (!replyText.trim() || replyText.trim().length < 10) {
      return;
    }

    setIsSubmitting(true);
    try {
      const replyId = isEdit ? editingReply?.id : null;

      // Call parent handler but DON'T await it if it's just optimistic, but usually we await logic
      await onSubmitReply(reviewId, replyText.trim(), replyId);

      // Optimistically update local state immediately (or rely on parent fetch)
      setLocalReviews((prevReviews) =>
        prevReviews.map((review) => {
          if (review.id === reviewId) {
            if (isEdit) {
              // Update existing reply
              return {
                ...review,
                replies: review.replies.map((r) =>
                  r.id === editingReply.id
                    ? {
                        ...r,
                        replyText: replyText.trim(),
                        updatedAt: new Date().toISOString(),
                      }
                    : r,
                ),
              };
            } else {
              // Add new reply (Mock ID)
              const newReply = {
                id: Date.now(),
                replyText: replyText.trim(),
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                teacherName: "Your Profile", // Using generic for optimistic update
                teacherImage: null,
              };
              return {
                ...review,
                replies: [newReply],
              };
            }
          }
          return review;
        }),
      );

      setReplyText("");
      setReplyingTo(null);
      setEditingReply(null);
    } catch (error) {
      console.error("Error submitting reply:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditReply = (reply, reviewId) => {
    setEditingReply({ ...reply, reviewId });
    setReplyText(reply.replyText);
  };

  const handleCancelEdit = () => {
    setEditingReply(null);
    setReplyText("");
  };

  const handleCancelReply = () => {
    setReplyingTo(null);
    setReplyText("");
  };

  const handleDeleteClick = (replyId, reviewId) => {
    setReviewToDelete({ replyId, reviewId });
  };

  const handleConfirmDelete = async () => {
    if (!reviewToDelete) return;

    const { replyId, reviewId } = reviewToDelete;

    try {
      await onDeleteReply(replyId);

      // Optimistically update local state immediately
      setLocalReviews((prevReviews) =>
        prevReviews.map((review) => {
          if (review.id === reviewId) {
            return {
              ...review,
              replies: [],
            };
          }
          return review;
        }),
      );
    } catch (error) {
      console.error("Error deleting reply:", error);
    } finally {
      setReviewToDelete(null);
    }
  };

  // Sort reviews by date (newest first)
  // const sortedReviews = [...localReviews].sort((a, b) => {
  //   return new Date(b.date) - new Date(a.date);
  // });
  // Assuming reviews might not have date field in mock, protect sort
  const sortedReviews = localReviews;

  if (!course) {
    return (
      <div className="text-center py-16 bg-yellow-50 rounded-lg border-2 border-yellow-200">
        <MessageCircle className="w-20 h-20 text-yellow-500 mx-auto mb-4" />
        <p className="text-yellow-700 text-xl font-semibold mb-2">
          ⚠️ No Course Data
        </p>
        <p className="text-yellow-600">Course object is null or undefined.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Summary Section */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg border border-blue-200">
        <div className="flex items-center gap-4">
          <div className="text-center">
            <span className="text-5xl font-bold text-blue-600">
              {course.averageRating?.toFixed(1) || "0.0"}
            </span>
            <div className="flex justify-center mt-2">
              {renderStars(course.averageRating || 0)}
            </div>
          </div>
          <div className="border-l-2 border-blue-300 pl-4">
            <p className="text-2xl font-semibold text-gray-800">
              {course.totalReviews || 0}{" "}
              {course.totalReviews === 1 ? "Review" : "Reviews"}
            </p>
            <p className="text-sm text-gray-600 mt-1">
              Student feedback for your course
            </p>
          </div>
        </div>
      </div>

      {/* Reviews List */}
      {sortedReviews.length > 0 ? (
        <div className="space-y-6">
          {sortedReviews.map((review) => {
            const avatar =
              review.userImage && review.userImage.startsWith("http")
                ? review.userImage
                : review.userImage
                  ? `${API.UPLOADS}/${review.userImage}`
                  : `${API.UPLOADS}/default-image.jpg`;

            const replies = review.replies || [];
            const hasReply = replies.length > 0;
            const teacherReply = replies[0];
            const isReplying = replyingTo === review.id;
            const isEditingThisReply = editingReply?.reviewId === review.id;

            return (
              <div
                key={review.id}
                className="border border-gray-200 rounded-xl p-6 bg-white shadow-sm hover:shadow-md transition-all duration-200">
                {/* Review Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <img
                      src={avatar}
                      alt={review.author || "Student"}
                      className="w-12 h-12 rounded-full object-cover border-2 border-gray-200"
                      onError={(e) => {
                        e.target.src = `${API.UPLOADS}/default-image.jpg`;
                      }}
                    />
                    <div>
                      <p className="font-semibold text-gray-900 text-lg">
                        {review.author || "Anonymous"}
                      </p>
                      <p className="text-sm text-gray-500">
                        {formatDate(review.date || new Date().toISOString())}
                      </p>
                    </div>
                  </div>
                  <div className="flex">{renderStars(review.rating || 0)}</div>
                </div>

                {/* Review Content */}
                <p className="text-gray-700 mb-5 leading-relaxed">
                  {review.comment || "No comment provided"}
                </p>

                {/* Teacher Reply Display/Edit Section */}
                {hasReply && !isEditingThisReply && (
                  <div className="mt-4 border-l-4 border-blue-500 bg-gradient-to-r from-blue-50 to-transparent rounded-r-lg p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          {teacherReply.teacherImage ? (
                            <img
                              src={`${BASE_URL}/uploads/teacher_images/${teacherReply.teacherImage}`}
                              alt={teacherReply.teacherName}
                              className="w-7 h-7 rounded-full object-cover"
                            />
                          ) : (
                            <div className="w-7 h-7 bg-blue-600 rounded-full flex items-center justify-center">
                              <User className="w-4 h-4 text-white" />
                            </div>
                          )}
                          <div className="flex items-center gap-2">
                            <p
                              className="font-semibold text-gray-900 text-sm cursor-pointer hover:text-blue-600 transition"
                              onClick={() =>
                                navigate(`/teacher/profile/${teacherId}`)
                              }>
                              {teacherReply.teacherName || "You"}
                            </p>
                            <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">
                              Teacher
                            </span>
                            <span className="text-xs text-gray-500">
                              {formatDate(teacherReply.createdAt)}
                              {teacherReply.updatedAt &&
                                teacherReply.updatedAt !==
                                  teacherReply.createdAt &&
                                " • Edited"}
                            </span>
                          </div>
                        </div>
                        <p className="text-gray-700 text-sm leading-relaxed ml-9">
                          {teacherReply.replyText}
                        </p>
                      </div>
                      <div className="flex gap-1 ml-3">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            handleEditReply(teacherReply, review.id);
                          }}
                          className="text-blue-600 hover:bg-blue-100 p-2 rounded-lg transition"
                          title="Edit reply">
                          <EditIcon className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            handleDeleteClick(teacherReply.id, review.id);
                          }}
                          className="text-red-600 hover:bg-red-100 p-2 rounded-lg transition"
                          title="Delete reply">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Inline Edit Mode */}
                {isEditingThisReply && (
                  <div className="mt-4 border-l-4 border-blue-500 bg-gradient-to-r from-blue-50 to-transparent rounded-r-lg p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <EditIcon className="w-4 h-4 text-blue-600" />
                      <span className="text-sm font-semibold text-blue-900">
                        Editing your reply
                      </span>
                    </div>
                    <textarea
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      placeholder="Update your response..."
                      className="w-full px-4 py-3 border-2 border-blue-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none resize-none transition-all"
                      rows="3"
                      maxLength={500}
                      autoFocus
                    />
                    <div className="flex items-center justify-between mt-3">
                      <p className="text-sm text-gray-600">
                        {replyText.length} / 500 characters
                        {replyText.length < 10 && replyText.length > 0 && (
                          <span className="text-red-500 ml-2 font-medium">
                            • Min 10 characters required
                          </span>
                        )}
                      </p>
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            handleCancelEdit();
                          }}
                          className="flex items-center gap-2 px-4 py-2 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-medium"
                          disabled={isSubmitting}>
                          <X className="w-4 h-4" />
                          Cancel
                        </button>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            handleReplySubmit(review.id, true);
                          }}
                          disabled={
                            !replyText.trim() ||
                            replyText.trim().length < 10 ||
                            isSubmitting
                          }
                          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold disabled:opacity-50 disabled:cursor-not-allowed">
                          <Check className="w-4 h-4" />
                          {isSubmitting ? "Updating..." : "Update Reply"}
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* New Reply Form */}
                {!hasReply && !isReplying ? (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      setReplyingTo(review.id);
                    }}
                    className="flex items-center gap-2 text-blue-600 hover:bg-blue-50 px-4 py-2.5 rounded-lg transition font-semibold border-2 border-transparent hover:border-blue-200">
                    <Reply className="w-4 h-4" />
                    Reply to Student
                  </button>
                ) : isReplying && !isEditingThisReply ? (
                  <div className="mt-4 border-l-4 border-green-500 bg-gradient-to-r from-green-50 to-transparent rounded-r-lg p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <Reply className="w-4 h-4 text-green-600" />
                      <span className="text-sm font-semibold text-green-900">
                        Writing your reply
                      </span>
                    </div>
                    <textarea
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      placeholder="Write a professional and helpful response to this review..."
                      className="w-full px-4 py-3 border-2 border-green-300 rounded-lg focus:border-green-500 focus:ring-2 focus:ring-green-200 focus:outline-none resize-none transition-all"
                      rows="3"
                      maxLength={500}
                      autoFocus
                    />
                    <div className="flex items-center justify-between mt-3">
                      <p className="text-sm text-gray-600">
                        {replyText.length} / 500 characters
                        {replyText.length < 10 && replyText.length > 0 && (
                          <span className="text-red-500 ml-2 font-medium">
                            • Min 10 characters required
                          </span>
                        )}
                      </p>
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            handleCancelReply();
                          }}
                          className="flex items-center gap-2 px-4 py-2 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-medium"
                          disabled={isSubmitting}>
                          <X className="w-4 h-4" />
                          Cancel
                        </button>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            handleReplySubmit(review.id, false);
                          }}
                          disabled={
                            !replyText.trim() ||
                            replyText.trim().length < 10 ||
                            isSubmitting
                          }
                          className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-semibold disabled:opacity-50 disabled:cursor-not-allowed">
                          <Send className="w-4 h-4" />
                          {isSubmitting ? "Sending..." : "Send Reply"}
                        </button>
                      </div>
                    </div>
                  </div>
                ) : null}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-16 bg-gray-50 rounded-lg">
          <MessageCircle className="w-20 h-20 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 text-xl font-semibold mb-2">
            No Reviews Yet
          </p>
          <p className="text-gray-400">
            Your course hasn't received any student reviews yet.
          </p>
        </div>
      )}

      <DeleteReviewModal
        isOpen={!!reviewToDelete}
        onClose={() => setReviewToDelete(null)}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
};

export default TeacherReviewsView;
