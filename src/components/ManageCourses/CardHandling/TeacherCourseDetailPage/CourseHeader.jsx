import React from "react";
import {
  Clock,
  BookOpen,
  Globe,
  Tag,
  TrendingUp,
  CheckCircle,
} from "lucide-react";

export default function CourseHeader({ course }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Course Thumbnail */}
        <div className="md:col-span-1">
          <div className="aspect-video md:aspect-square w-full overflow-hidden">
            <img
              src={course.image}
              alt={course.title}
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Course Info */}
        <div className="md:col-span-2 p-6 space-y-4">
          {/* Status Badge */}
          <div className="flex items-center gap-3">
            <span
              className={`px-4 py-1.5 rounded-full text-sm font-semibold ${
                course.status === "Active"
                  ? "bg-green-100 text-green-700"
                  : "bg-gray-100 text-gray-700"
              }`}>
              {course.status}
            </span>
            <span className="px-4 py-1.5 rounded-full text-sm font-semibold bg-indigo-100 text-indigo-700 capitalize">
              {course.category}
            </span>
          </div>

          {/* Title */}
          <h1 className="text-3xl font-bold text-gray-900 leading-tight">
            {course.title}
          </h1>

          {/* Description */}
          <p className="text-gray-600 line-clamp-2">{course.description}</p>

          {/* Meta Info Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-4">
            <div className="flex items-center gap-2 text-sm">
              <Clock className="w-4 h-4 text-indigo-600" />
              <div>
                <p className="text-gray-500 text-xs">Duration</p>
                <p className="font-semibold text-gray-900">{course.duration}</p>
              </div>
            </div>

            <div className="flex items-center gap-2 text-sm">
              <BookOpen className="w-4 h-4 text-indigo-600" />
              <div>
                <p className="text-gray-500 text-xs">Videos</p>
                <p className="font-semibold text-gray-900">
                  {course.numVideos} lessons
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 text-sm">
              <TrendingUp className="w-4 h-4 text-indigo-600" />
              <div>
                <p className="text-gray-500 text-xs">Level</p>
                <p className="font-semibold text-gray-900 capitalize">
                  {course.level}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 text-sm">
              <Globe className="w-4 h-4 text-indigo-600" />
              <div>
                <p className="text-gray-500 text-xs">Language</p>
                <p className="font-semibold text-gray-900">{course.language}</p>
              </div>
            </div>

            <div className="flex items-center gap-2 text-sm">
              <CheckCircle className="w-4 h-4 text-indigo-600" />
              <div>
                <p className="text-gray-500 text-xs">Price</p>
                <p className="font-semibold text-gray-900">
                  {course.price === 0 ? "Free" : `Rs.${course.price}`}
                </p>
              </div>
            </div>

            {course.hoursPerWeek > 0 && (
              <div className="flex items-center gap-2 text-sm">
                <Clock className="w-4 h-4 text-indigo-600" />
                <div>
                  <p className="text-gray-500 text-xs">Study Pace</p>
                  <p className="font-semibold text-gray-900">
                    {course.hoursPerWeek}h/week
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
