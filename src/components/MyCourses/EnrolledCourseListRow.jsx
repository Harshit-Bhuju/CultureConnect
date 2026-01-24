import React from "react";
import { Play, Star } from "lucide-react";
import { BASE_URL } from "../../Configs/ApiEndpoints";

const EnrolledCourseListRow = ({ course, onContinue }) => {
  const handleContinue = (e) => {
    e.stopPropagation();
    onContinue(course);
  };

  // Data normalization
  const courseTitle = course.courseTitle || course.title || "Unnamed Course";
  const teacherName = course.teacherName || course.teacher_name || "Instructor";
  const category = course.category || "General";
  const rating =
    course.averageRating || course.average_rating || course.rating || 0;
  const progress = course.progress || 0;
  const totalVideos = course.totalVideos || course.total_videos || 0;
  const completedVideos =
    course.completedVideos || course.completed_videos || 0;
  const reviewsCount =
    course.reviews || course.totalReviews || course.total_reviews || 0;

  // Image
  const courseImage = course.images?.[0] || course.thumbnail || course.image;
  const imageUrl = courseImage
    ? courseImage.startsWith("http")
      ? courseImage
      : `${BASE_URL}/uploads/teacher_datas/course_thumbnails/${courseImage}`
    : "https://images.unsplash.com/photo-1516321497487-e288fb19713f?w=800";

  return (
    <div
      onClick={handleContinue}
      className="grid grid-cols-12 gap-4 px-6 py-4 items-center hover:bg-blue-50 transition-colors cursor-pointer group">
      {/* Image */}
      <div className="col-span-1">
        <img
          src={imageUrl}
          alt={courseTitle}
          className="w-16 h-16 object-cover rounded-lg shadow-sm group-hover:shadow-md transition-shadow"
          onError={(e) => {
            e.target.src =
              "https://images.unsplash.com/photo-1516321497487-e288fb19713f?w=800";
          }}
        />
      </div>

      {/* Course Details */}
      <div className="col-span-4">
        <h3 className="font-semibold text-gray-900 mb-1 line-clamp-1 group-hover:text-blue-600 transition-colors">
          {courseTitle}
        </h3>
        <p className="text-xs text-gray-500 flex items-center gap-2">
          <span>{teacherName}</span>
          <span className="flex items-center gap-0.5">
            <Star size={12} fill="#f59e0b" className="text-amber-500" />
            {rating.toFixed(1)}
          </span>
          <span className="text-gray-400">({reviewsCount} reviews)</span>
        </p>
      </div>

      {/* Category */}
      <div className="col-span-2">
        <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-700 group-hover:bg-blue-100 group-hover:text-blue-700 transition-colors">
          {category}
        </span>
      </div>

      {/* Progress */}
      <div className="col-span-3">
        <div className="space-y-1">
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span>
              {completedVideos} / {totalVideos} lessons
            </span>
            <span className="font-medium">{progress}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className={`h-2 rounded-full transition-all duration-500 ${progress === 100 ? "bg-green-500" : "bg-blue-500"
                }`}
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>

      {/* Action */}
      <div className="col-span-2 flex justify-end">
        <button
          onClick={handleContinue}
          className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
          <Play size={14} fill="white" />
          {progress > 0 ? "Continue" : "Start"}
        </button>
      </div>
    </div>
  );
};

export default EnrolledCourseListRow;
