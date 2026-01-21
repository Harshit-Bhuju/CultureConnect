import React from "react";
import { Edit2, Trash2, AlertTriangle, Star } from "lucide-react";
import { BASE_URL } from "../../../Configs/ApiEndpoints";

// Course Card Component - Merging CardLayout visuals with Teacher Actions
const CourseCard = ({ course, onEdit, onDelete, onView }) => {
  const handleCardClick = (e) => {
    // Prevent navigation if clicking actions
    if (e.target.closest(".action-button")) {
      return;
    }
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

  // Data normalization
  const courseTitle = course.courseTitle || course.title || "Unnamed Course";
  const teacherName = course.teacherName || course.teacher_name || "You"; // Default to 'You' for teacher dashboard
  const description = course.description || "";
  const rating = course.averageRating || course.average_rating || 0;
  const students = course.enrolled_students || course.totalStudents || 0;
  const stock = parseInt(course.stock || course.seats || 0);

  // Status & Stock Logic
  const isLowStock = stock <= 10 && stock > 0;
  const isOutOfStock = stock === 0;

  // Image handling
  const getFirstImage = () => {
    const img = course.images?.[0] || course.thumbnail || course.image;
    if (img) return img;
    return null;
  };

  const rawImage = getFirstImage();
  const imageUrl = rawImage
    ? rawImage.startsWith("http")
      ? rawImage
      : `${BASE_URL}/uploads/course_images/${rawImage}` // Adjusted path for courses if needed, or check where images are stored
    : "https://images.unsplash.com/photo-1516321497487-e288fb19713f?w=800";

  // Price formatting
  const price = (() => {
    const p = course.price;
    if (typeof p === "number") return `Rs. ${p.toLocaleString()}`;
    if (typeof p === "string") {
      if (p.includes("Rs") || p.includes("€") || p.includes("$")) return p;
      return `Rs. ${parseFloat(p || 0).toLocaleString()}`;
    }
    return "Rs. 0";
  })();

  return (
    <div
      className="bg-white rounded-2xl overflow-hidden border border-gray-100 hover:border-gray-200 transition-all duration-300 h-full flex flex-col group shadow-sm cursor-pointer relative"
      onClick={handleCardClick}>
      {/* TEACHER DASHBOARD OVERLAYS */}
      <div className="absolute top-3 left-3 z-20 flex flex-col gap-1">
        {/* Status Badge */}
        <span
          className={`px-2 py-1 text-xs font-semibold rounded shadow-sm backdrop-blur-md ${
            course.status === "Active" || course.status === "published"
              ? "bg-green-100/90 text-green-700"
              : course.status === "Draft" || course.status === "draft"
                ? "bg-gray-100/90 text-gray-700"
                : "bg-yellow-100/90 text-yellow-700"
          }`}>
          {course.status || "Draft"}
        </span>
        {isLowStock && (
          <span className="px-2 py-1 text-xs font-semibold rounded bg-orange-100/90 text-orange-700 shadow-sm flex items-center gap-1 backdrop-blur-md">
            <AlertTriangle size={10} />
            Few Seats
          </span>
        )}
        {isOutOfStock && (
          <span className="px-2 py-1 text-xs font-semibold rounded bg-red-100/90 text-red-700 shadow-sm flex items-center gap-1 backdrop-blur-md">
            <AlertTriangle size={10} />
            Full
          </span>
        )}
      </div>

      {/* Edit/Delete Actions */}
      <div className="absolute top-3 right-3 z-20 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={handleEdit}
          className="action-button bg-white p-2 rounded-full shadow-md hover:bg-gray-50 transition-colors border border-gray-100"
          title="Edit">
          <Edit2 className="w-4 h-4 text-gray-700" />
        </button>
        <button
          onClick={handleDelete}
          className="action-button bg-white p-2 rounded-full shadow-md hover:bg-red-50 transition-colors border border-gray-100"
          title="Delete">
          <Trash2 className="w-4 h-4 text-red-600" />
        </button>
      </div>

      {/* Course Image */}
      <div className="relative aspect-video bg-gradient-to-br from-slate-100 to-slate-50 overflow-hidden">
        <img
          src={imageUrl}
          alt={courseTitle}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          onError={(e) => {
            e.target.src =
              "https://images.unsplash.com/photo-1516321497487-e288fb19713f?w=800";
          }}
        />
      </div>

      {/* Course Content */}
      <div className="p-5 space-y-1 flex-1 flex flex-col">
        {/* Title */}
        <h3 className="text-gray-900 text-base font-semibold leading-snug line-clamp-1">
          {courseTitle}
        </h3>

        {/* Instructor/Category fallback */}
        <p className="text-gray-500 text-sm font-medium">
          {course.category || teacherName}
        </p>

        {/* Description */}
        <p className="text-gray-600 text-sm leading-relaxed line-clamp-1 flex-1">
          {description}
        </p>

        {/* Rating & Stock */}
        <div className="flex items-center justify-between pt-2 border-t border-gray-100 mt-2">
          <div className="flex items-center gap-2">
            <span className="text-gray-900 text-sm font-bold">{rating}</span>
            <div className="flex items-center gap-0.5">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={14}
                  fill={i < Math.floor(rating) ? "#f59e0b" : "none"}
                  className={
                    i < Math.floor(rating) ? "text-amber-500" : "text-gray-300"
                  }
                />
              ))}
            </div>
            <span className="text-gray-400 text-sm">({students})</span>
          </div>

          {/* Stock display for manager */}
          <span
            className={`text-xs font-semibold ${isLowStock ? "text-orange-600" : isOutOfStock ? "text-red-600" : "text-gray-500"}`}>
            {stock} seats
          </span>
        </div>

        {/* Price */}
        <div className="flex items-baseline gap-2 pt-1">
          <span className="text-gray-900 text-xl font-bold">{price}</span>
        </div>
      </div>
    </div>
  );
};

export default CourseCard;
