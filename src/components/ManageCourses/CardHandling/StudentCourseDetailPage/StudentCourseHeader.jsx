import React from "react";
import {
  Clock,
  BookOpen,
  Globe,
  Tag,
  TrendingUp,
  Users,
  Star,
} from "lucide-react";
import { BASE_URL } from "../../../../Configs/ApiEndpoints";

export default function StudentCourseHeader({ course }) {
  const imageUrl = course.image?.startsWith("http")
    ? course.image
    : course.image
      ? `${BASE_URL}/uploads/teacher_datas/course_thumbnails/${course.image}`
      : "https://images.unsplash.com/photo-1516321497487-e288fb19713f?w=800";

  const renderStars = (rating) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-4 h-4 ${
              star <= Math.round(rating)
                ? "fill-yellow-400 text-yellow-400"
                : "text-gray-300"
            }`}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Course Thumbnail */}
        <div className="md:col-span-1">
          <div className="aspect-video md:aspect-square w-full overflow-hidden">
            <img
              src={imageUrl}
              alt={course.title}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.src =
                  "https://images.unsplash.com/photo-1516321497487-e288fb19713f?w=800";
              }}
            />
          </div>
        </div>

        {/* Course Info */}
        <div className="md:col-span-2 p-6 space-y-4">
          {/* Category & Level Badges */}
          <div className="flex items-center gap-3">
            <span className="px-4 py-1.5 rounded-full text-sm font-semibold bg-blue-100 text-blue-700 capitalize">
              {course.category}
            </span>
            <span className="px-4 py-1.5 rounded-full text-sm font-semibold bg-purple-100 text-purple-700 capitalize">
              {course.level}
            </span>
          </div>

          {/* Title */}
          <h1 className="text-3xl font-bold text-gray-900 leading-tight">
            {course.title}
          </h1>

          {/* Rating */}
          {course.averageRating > 0 && (
            <div className="flex items-center gap-3">
              {renderStars(course.averageRating)}
              <span className="text-sm font-medium text-gray-700">
                {course.averageRating.toFixed(1)}
              </span>
              <span className="text-sm text-gray-500">
                ({course.totalReviews} reviews)
              </span>
              <span className="text-sm text-gray-500">
                • {course.enrolled_students} students enrolled
              </span>
            </div>
          )}

          {/* Teacher Info */}
          {course.teacher && (
            <div className="flex items-center gap-3 pt-2">
              <img
                src={course.teacher.profile_picture}
                alt={course.teacher.name}
                className="w-12 h-12 rounded-full object-cover border-2 border-gray-200"
                onError={(e) => {
                  e.target.src =
                    "https://ui-avatars.com/api/?name=" +
                    encodeURIComponent(course.teacher.name);
                }}
              />
            </div>
          )}

          {/* Meta Info Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-4 border-t">
            <div className="flex items-center gap-2 text-sm">
              <Clock className="w-4 h-4 text-blue-600" />
              <div>
                <p className="text-gray-500 text-xs">Duration</p>
                <p className="font-semibold text-gray-900">{course.duration}</p>
              </div>
            </div>

            <div className="flex items-center gap-2 text-sm">
              <BookOpen className="w-4 h-4 text-blue-600" />
              <div>
                <p className="text-gray-500 text-xs">Lessons</p>
                <p className="font-semibold text-gray-900">
                  {course.numVideos} videos
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 text-sm">
              <TrendingUp className="w-4 h-4 text-blue-600" />
              <div>
                <p className="text-gray-500 text-xs">Level</p>
                <p className="font-semibold text-gray-900 capitalize">
                  {course.level}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 text-sm">
              <Globe className="w-4 h-4 text-blue-600" />
              <div>
                <p className="text-gray-500 text-xs">Language</p>
                <p className="font-semibold text-gray-900">{course.language}</p>
              </div>
            </div>

            <div className="flex items-center gap-2 text-sm">
              <Users className="w-4 h-4 text-blue-600" />
              <div>
                <p className="text-gray-500 text-xs">Students</p>
                <p className="font-semibold text-gray-900">
                  {course.enrolled_students}
                </p>
              </div>
            </div>

            {course.hoursPerWeek > 0 && (
              <div className="flex items-center gap-2 text-sm">
                <Clock className="w-4 h-4 text-blue-600" />
                <div>
                  <p className="text-gray-500 text-xs">Time/Week</p>
                  <p className="font-semibold text-gray-900">
                    {course.hoursPerWeek}h
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Tags */}
          {course.tags && course.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 pt-2">
              {course.tags.slice(0, 6).map((tag, index) => (
                <span
                  key={index}
                  className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded-full">
                  <Tag className="w-3 h-3" />
                  {tag}
                </span>
              ))}
              {course.tags.length > 6 && (
                <span className="inline-flex items-center px-3 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded-full">
                  +{course.tags.length - 6} more
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
