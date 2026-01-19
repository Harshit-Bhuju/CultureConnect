import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Clock,
  Users,
  Star,
  
  Award,
  CheckCircle2,
  TrendingUp,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import API from "../../Configs/ApiEndpoints";
import CultureConnectLogo from "../../assets/logo/cultureconnect__fav.png";

const CourseCard = ({ product, teacherId, variant = "default" }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Extract course data
  const {
    id,
    title,
    image,
    price,
    video_count,
    duration,
    enrolled_students,
    rating,
    averageRating,
    level,
    category,
    instructor,
    teacher,
  } = product;

  const courseId = id;
  const instructorId =
    teacherId ||
    product.instructorId ||
    product.instructor_id ||
    product.teacherId;

  // Check if it's instructor's own course
  const isOwnCourse =
    user?.instructor_id && instructorId && user.instructor_id === instructorId;

  const courseLink = isOwnCourse
    ? `/instructor/courses/${user.instructor_id}/${courseId}`
    : `/courses/${instructorId}/${courseId}`;

  // Get full image URL
  const getImageUrl = () => {
    if (!image || image === "default-course-thumbnail.jpg") {
      return CultureConnectLogo;
    }
    if (image.startsWith("http")) {
      return image;
    }
    return `${API.COURSE_THUMBNAILS}/${image}`;
  };

  const imageUrl = getImageUrl();
  const courseName =
    title || product.name || product.courseName || "Unnamed Course";
  const instructorName = instructor || teacher || "Instructor";
  const isFree = price === 0;

  const displayPrice = (() => {
    if (isFree) return "0";
    if (typeof price === "number") return price.toLocaleString();
    if (typeof price === "string") {
      const cleanPrice = price.replace(/Rs\.\s*/i, "").replace(/,/g, "");
      return parseFloat(cleanPrice || 0).toLocaleString();
    }
    return "0";
  })();

  const courseRating = averageRating ?? rating ?? 4.5;
  const students = enrolled_students || 0;
  const courseDuration = duration || "Self-paced";
  const videos = video_count || 0;
  const courseLevel = level || "All Levels";
  const courseCategory = category || "Course";

  const handleCardClick = (e) => {
    e?.preventDefault();

    if (!courseId || !instructorId) {
      console.error("Missing required IDs for navigation:", {
        courseId,
        instructorId,
        product,
      });
      return;
    }

    const currentLocation = location.pathname + (location.search || "");
    navigate(courseLink, { state: { from: currentLocation } });
  };

  // YouTube-Style Vertical Card (Default)
  return (
    <motion.div
      className="group w-full bg-white rounded-xl overflow-hidden cursor-pointer hover:shadow-lg transition-shadow duration-300"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      onClick={handleCardClick}>
      {/* Thumbnail Section - YouTube Style 16:9 */}
      <div className="relative w-full aspect-video overflow-hidden bg-gray-900 rounded-t-xl">
        <motion.img
          src={imageUrl}
          alt={courseName}
          className="w-full h-full object-cover"
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.3 }}
          onError={(e) => {
            e.target.src =
              "https://via.placeholder.com/1280x720?text=Course+Thumbnail";
          }}
        />

        {/* Dark overlay on hover */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300" />

      

        {/* Top Badges Row */}
        <div className="absolute top-3 left-3 right-3 flex justify-between items-start">
          {/* Category Badge */}
          <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg backdrop-blur-sm">
            {courseCategory}
          </div>

          {/* Free/Level Badge */}
          {isFree ? (
            <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg backdrop-blur-sm">
              FREE
            </div>
          ) : (
            <div className="bg-white/90 backdrop-blur-sm text-gray-900 text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">
              {courseLevel}
            </div>
          )}
        </div>

        {/* Duration Badge - Bottom Right */}
        <div className="absolute bottom-3 right-3 bg-black/80 backdrop-blur-sm text-white text-xs font-semibold px-2.5 py-1 rounded flex items-center gap-1">
          <Clock className="w-3 h-3" />
          {courseDuration}
        </div>

        {/* Popular Badge - Top Right (conditional) */}
        {students > 100 && (
          <div className="absolute top-3 right-3">
            <div className="bg-gradient-to-br from-yellow-400 to-yellow-600 text-white px-2.5 py-1 rounded-full text-xs font-bold shadow-lg flex items-center gap-1">
              <TrendingUp className="w-3 h-3" />
              Popular
            </div>
          </div>
        )}

        {/* Stats Overlay - Bottom Left */}
        <div className="absolute bottom-3 left-3 flex items-center gap-2">
          <div className="flex items-center gap-1.5 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-lg text-white">
            <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
            <span className="font-semibold text-xs">{courseRating}</span>
          </div>
          {students > 0 && (
            <div className="flex items-center gap-1.5 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-lg text-white">
              <Users className="w-3.5 h-3.5" />
              <span className="text-xs font-medium">{students}</span>
            </div>
          )}
        </div>
      </div>

      {/* Content Section - YouTube Style */}
      <div className="p-4">
        {/* Instructor Avatar + Title */}
        <div className="flex gap-3 mb-3">
          {/* Instructor Avatar */}
          <div className="flex-shrink-0 mt-1">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center text-white font-semibold shadow-md">
              {instructorName.charAt(0).toUpperCase()}
            </div>
          </div>

          {/* Title and Instructor */}
          <div className="flex-1 min-w-0">
            {/* Course Title */}
            <h3 className="font-bold text-base text-gray-900 line-clamp-2 mb-1 group-hover:text-orange-600 transition-colors leading-snug">
              {courseName}
            </h3>

            {/* Instructor Name */}
            <p className="text-sm text-gray-600 font-medium">
              {instructorName}
            </p>
          </div>
        </div>

        {/* Course Stats Grid */}
        <div className="grid grid-cols-3 gap-2 mb-3 bg-gray-50 rounded-lg p-2">
          <div className="flex flex-col items-center">
            <span className="text-xs font-semibold text-gray-900">
              {videos}
            </span>
            <span className="text-xs text-gray-500">Videos</span>
          </div>
          <div className="flex flex-col items-center border-x border-gray-200">
            <span className="text-xs font-semibold text-gray-900">
              {students}
            </span>
            <span className="text-xs text-gray-500">Students</span>
          </div>
          <div className="flex flex-col items-center">
            <Award className="w-3.5 h-3.5 text-yellow-600 mb-0.5" />
            <span className="text-xs text-gray-500">Certificate</span>
          </div>
        </div>

        {/* What You'll Learn */}
        <div className="mb-3 p-2.5 bg-gradient-to-br from-orange-50 to-red-50 rounded-lg border border-orange-100">
          <p className="text-xs font-semibold text-gray-700 mb-1.5">
            What you'll learn:
          </p>
          <div className="space-y-1">
            <div className="flex items-start gap-1.5">
              <CheckCircle2 className="w-3 h-3 text-orange-600 mt-0.5 flex-shrink-0" />
              <span className="text-xs text-gray-600 leading-tight">
                Master traditional techniques
              </span>
            </div>
            <div className="flex items-start gap-1.5">
              <CheckCircle2 className="w-3 h-3 text-orange-600 mt-0.5 flex-shrink-0" />
              <span className="text-xs text-gray-600 leading-tight">
                Create authentic artworks
              </span>
            </div>
          </div>
        </div>

        {/* Price and CTA */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-200">
          <div>
            <p className="text-xl font-bold text-gray-900">
              {isFree ? "Free" : `Rs. ${displayPrice}`}
            </p>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-5 py-2.5 bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold rounded-lg hover:from-orange-600 hover:to-red-600 transition-all shadow-md hover:shadow-lg text-sm"
            onClick={(e) => {
              e.stopPropagation();
              handleCardClick(e);
            }}>
            {isFree ? "Enroll Free" : "Enroll Now"}
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default CourseCard;
