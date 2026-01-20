import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Star } from "lucide-react";
import { BASE_URL } from "../../Configs/ApiEndpoints";
import { useAuth } from "../../context/AuthContext";

const CourseCard = ({ course, teacherId, teacherName }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const courseData = course;
  console.log(courseData);
  // Early return if no data
  if (!courseData) {
    console.error("CourseCard: No course/product data provided");
    return null;
  }

  // Handle various ID formats from API or mocks
  const instructorId = teacherId;
  const courseId = courseData.id;

  const courseLink = `/courses/${instructorId}/${courseId}`;

  // Flexible image handling
  const getFirstImage = () => {
    if (courseData.images?.length > 0) {
      return Array.isArray(courseData.images)
        ? courseData.images[0]
        : courseData.images;
    }
    return (
      courseData.image || courseData.image_url || courseData.imageUrl || null
    );
  };

  const rawImage = getFirstImage();
  const imageUrl = rawImage
    ? rawImage.startsWith("http")
      ? rawImage
      : `${BASE_URL}/uploads/teacher_datas/course_thumbnails/${rawImage}`
    : "https://images.unsplash.com/photo-1516321497487-e288fb19713f?w=800";

  // Course title fallback
  const courseTitle = courseData.title;

  // Instructor name fallback
  const instructorName = teacherName || courseData.teacher_name;

  // Description fallback
  const description = courseData.description;

  // Price formatting
  const price = (() => {
    const p = courseData.price;
    if (typeof p === "number") return `Rs. ${p.toLocaleString()}`;
    if (typeof p === "string") {
      if (p.includes("Rs") || p.includes("€") || p.includes("$")) return p;
      return `Rs. ${parseFloat(p || 0).toLocaleString()}`;
    }
    return "Rs. 14,99";
  })();

  // Rating normalization
  const rating = courseData.average_rating;
  const students = courseData.enrolled_students;

  const handleCardClick = () => {
    // Validate required IDs before navigation
    if (!courseId || !instructorId) {
      console.error("Missing required IDs for navigation:", {
        courseId,
        instructorId,
        courseData,
      });
      return;
    }

    const currentLocation = location.pathname + (location.search || "");
    console.log("Navigating to:", courseLink);
    navigate(courseLink, { state: { from: currentLocation } });
  };

  return (
    <div
      className="bg-white rounded-2xl overflow-hidden border border-gray-100 hover:border-gray-200 transition-all duration-300 h-full flex flex-col group shadow-sm cursor-pointer"
      onClick={handleCardClick}>
      {/* Course Image */}
      <div className="relative aspect-video bg-gradient-to-br from-slate-100 to-slate-50 overflow-hidden">
        <img
          src={imageUrl}
          alt={courseTitle}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>

      {/* Course Content */}
      <div className="p-5 space-y-1 flex-1 flex flex-col">
        {/* Title */}
        <h3 className="text-gray-900 text-base font-semibold leading-snug line-clamp-1">
          {courseTitle}
        </h3>

        {/* Instructor */}
        <p className="text-gray-500 text-sm font-medium">{instructorName}</p>

        {/* Description */}
        <p className="text-gray-600 text-sm leading-relaxed line-clamp-1 flex-1">
          {description}
        </p>

        {/* Rating */}
        <div className="flex items-center gap-2 pt-2 border-t border-gray-100">
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

        {/* Price */}
        <div className="flex items-baseline gap-2 pt-1">
          <span className="text-gray-900 text-xl font-bold">{price}</span>
        </div>
      </div>
    </div>
  );
};

export default CourseCard;
