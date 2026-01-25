import React from "react";
import { Edit2, Trash2, AlertTriangle, Upload } from "lucide-react";
import API, { BASE_URL } from "../../../Configs/ApiEndpoints";
import Rating from "../../Rating/Rating";

const CourseListRow = ({
  course,
  onView,
  onEdit,
  onDelete,
  onPublish,
  isDraftMode,
}) => {
  const handleRowClick = () => {
    onView(course);
  };

  const handleEdit = (e) => {
    e.stopPropagation();
    onEdit(course);
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    onDelete(course);
  };

  const handlePublish = (e) => {
    e.stopPropagation();
    onPublish(course);
  };

  // Average rating calculation
  const calculateAverageRating = () => {
    if (!course.reviews || course.reviews.length === 0) {
      return course.rating || course.average_rating || 0;
    }
    const total = course.reviews.reduce((sum, r) => sum + r.rating, 0);
    return Math.round((total / course.reviews.length) * 10) / 10;
  };

  const avgRating = calculateAverageRating();
  const reviewCount =
    course.reviews?.length ||
    course.totalReviews ||
    course.total_reviews ||
    (course.rating || course.average_rating ? 1 : 0); // Fallback if we have a rating but no count

  // Image

  // Image
  const courseImage = course.images?.[0] || course.thumbnail || course.image;
  const imageUrl = courseImage
    ? courseImage.startsWith("http")
      ? courseImage
      : `${BASE_URL}/uploads/teacher_datas/course_thumbnails/${courseImage}`
    : "/placeholder-image.png";

  const courseTitle = course.courseTitle || course.title || "Unnamed Course";

  return (
    <div
      onClick={handleRowClick}
      className="grid grid-cols-12 gap-4 px-6 py-4 items-center hover:bg-orange-50 transition-colors cursor-pointer group relative">
      {/* Image */}
      <div className="col-span-1 relative">
        <img
          src={imageUrl}
          alt={courseTitle}
          className="w-16 h-16 object-cover rounded-lg shadow-sm group-hover:shadow-md transition-shadow"
          onError={(e) => {
            e.target.src = "/placeholder-image.png";
          }}
        />
      </div>

      {/* Course Details */}
      <div className="col-span-4">
        <h3 className="font-semibold text-gray-900 mb-1 line-clamp-1 group-hover:text-orange-600 transition-colors">
          {courseTitle}
        </h3>
        <p className="text-xs text-gray-500 line-clamp-1">
          {course.description}
        </p>
      </div>

      {/* Category */}
      <div className="col-span-2">
        <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-700 group-hover:bg-orange-100 group-hover:text-orange-700 transition-colors">
          {course.category}
        </span>
      </div>

      {/* Price */}
      <div className="col-span-1">
        <span className="font-bold text-orange-600 text-base">
          Rs.{" "}
          {typeof course.price === "number"
            ? course.price.toLocaleString()
            : parseFloat(course.price).toLocaleString()}
        </span>
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
          className={`inline-flex px-2.5 py-1 rounded-full text-xs font-semibold ${course.status === "Active"
            ? "bg-green-100 text-green-700"
            : course.status === "Draft"
              ? "bg-gray-100 text-gray-700"
              : "bg-yellow-100 text-yellow-700"
            }`}>
          {course.status}
        </span>
      </div>

      {/* Actions */}
      <div className="col-span-1">
        <div className="flex gap-2 justify-end">
          {isDraftMode && (
            <button
              onClick={handlePublish}
              className="p-2 rounded-lg text-gray-400 hover:text-green-600 hover:bg-green-100 transition-all"
              title="Publish Course">
              <Upload className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={handleEdit}
            className="p-2 rounded-lg text-gray-400 hover:text-orange-600 hover:bg-orange-100 transition-all"
            title="Edit Course">
            <Edit2 className="w-4 h-4" />
          </button>
          <button
            onClick={handleDelete}
            className="p-2 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-100 transition-all"
            title="Delete Course">
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CourseListRow;
