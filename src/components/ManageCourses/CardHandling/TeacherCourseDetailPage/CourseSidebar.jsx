import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Edit,
  Share2,
  Eye,
  Save,
  Users,
  DollarSign,
  TrendingUp,
  PlayCircle,
  Calendar,
  Globe,
  BookOpen,
  CheckCircle,
  AlertCircle,
} from "lucide-react";

export default function CourseSidebar({
  course,
  teacherId,
  handleShare,
  handlePublish,
  handleDraft,
}) {
  const navigate = useNavigate();

  return (
    <div className="sticky top-24 space-y-6">
      {/* Quick Actions */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
          <Edit className="w-5 h-5 text-indigo-600" />
          Quick Actions
        </h3>

        <div className="space-y-3">
          <button
            onClick={() =>
              navigate(`/teacher/courses/edit/${teacherId}/${course.id}`)
            }
            className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition flex items-center justify-center gap-2 font-medium shadow-sm">
            <Edit className="w-4 h-4" />
            Edit Course
          </button>

          <button
            onClick={handleShare}
            className="w-full border-2 border-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-50 transition flex items-center justify-center gap-2 font-medium">
            <Share2 className="w-4 h-4" />
            Share Course
          </button>

          <div className="pt-2 border-t">
            <button
              onClick={course.status === "Active" ? handleDraft : handlePublish}
              className={`w-full py-3 rounded-lg transition font-medium flex items-center justify-center gap-2 ${
                course.status === "Active"
                  ? "bg-yellow-50 text-yellow-700 border-2 border-yellow-200 hover:bg-yellow-100"
                  : "bg-green-50 text-green-700 border-2 border-green-200 hover:bg-green-100"
              }`}>
              {course.status === "Active" ? (
                <>
                  <Save className="w-4 h-4" />
                  Move to Draft
                </>
              ) : (
                <>
                  <Eye className="w-4 h-4" />
                  Publish Course
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Course Information */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-indigo-600" />
          Course Information
        </h3>

        <div className="space-y-4">
          {/* Status */}
          <div className="flex items-center justify-between pb-3 border-b">
            <span className="text-sm text-gray-600 flex items-center gap-2">
              <CheckCircle className="w-4 h-4" />
              Status
            </span>
            <span
              className={`px-3 py-1 rounded-full text-sm font-semibold ${
                course.status === "Active"
                  ? "bg-green-100 text-green-700"
                  : "bg-gray-100 text-gray-700"
              }`}>
              {course.status}
            </span>
          </div>

          {/* Price */}
          <div className="flex items-center justify-between pb-3 border-b">
            <span className="text-sm text-gray-600 flex items-center gap-2">
              <DollarSign className="w-4 h-4" />
              Price
            </span>
            <span className="font-semibold text-gray-900">
              {course.price === 0 ? "Free" : `Rs.${course.price}`}
            </span>
          </div>

          {/* Category */}
          <div className="flex items-center justify-between pb-3 border-b">
            <span className="text-sm text-gray-600 flex items-center gap-2">
              <BookOpen className="w-4 h-4" />
              Category
            </span>
            <span className="font-semibold text-gray-900 capitalize">
              {course.category}
            </span>
          </div>

          {/* Level */}
          <div className="flex items-center justify-between pb-3 border-b">
            <span className="text-sm text-gray-600 flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Level
            </span>
            <span className="font-semibold text-gray-900 capitalize">
              {course.level}
            </span>
          </div>

          {/* Language */}
          <div className="flex items-center justify-between pb-3 border-b">
            <span className="text-sm text-gray-600 flex items-center gap-2">
              <Globe className="w-4 h-4" />
              Language
            </span>
            <span className="font-semibold text-gray-900">
              {course.language}
            </span>
          </div>

          {/* Students */}
          <div className="flex items-center justify-between pb-3 border-b">
            <span className="text-sm text-gray-600 flex items-center gap-2">
              <Users className="w-4 h-4" />
              Students
            </span>
            <span className="font-semibold text-gray-900">
              {course.enrolled_students}
            </span>
          </div>

          {/* Total Videos */}
          <div className="flex items-center justify-between pb-3 border-b">
            <span className="text-sm text-gray-600 flex items-center gap-2">
              <PlayCircle className="w-4 h-4" />
              Videos
            </span>
            <span className="font-semibold text-gray-900">
              {course.numVideos}
            </span>
          </div>

          {/* Created Date */}
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600 flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Created
            </span>
            <span className="font-semibold text-gray-900">
              {new Date(course.createdAt).toLocaleDateString()}
            </span>
          </div>
        </div>
      </div>

      {/* Performance Insights */}
      <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl shadow-sm border border-indigo-100 p-6">
        <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-indigo-600" />
          Performance
        </h3>

        <div className="space-y-4">
          {/* Revenue */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-700">Total Revenue</span>
              <span className="text-lg font-bold text-indigo-600">
                Rs.{course.totalRevenue.toLocaleString()}
              </span>
            </div>
            <div className="w-full bg-white rounded-full h-2">
              <div
                className="bg-gradient-to-r from-indigo-500 to-purple-500 h-2 rounded-full"
                style={{
                  width: `${Math.min((course.enrolled_students / course.max_students) * 100, 100)}%`,
                }}></div>
            </div>
          </div>

          {/* Completion Rate */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-700">Completion</span>
              <span className="text-lg font-bold text-purple-600">
                {course.completionRate}%
              </span>
            </div>
            <div className="w-full bg-white rounded-full h-2">
              <div
                className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full"
                style={{ width: `${course.completionRate}%` }}></div>
            </div>
          </div>

          {/* Rating */}
          {course.averageRating > 0 && (
            <div className="pt-3 border-t border-indigo-200">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-700">Average Rating</span>
                <div className="flex items-center gap-1">
                  <span className="text-lg font-bold text-yellow-600">
                    {course.averageRating.toFixed(1)}
                  </span>
                  <span className="text-sm text-gray-600">/ 5.0</span>
                </div>
              </div>
              {course.totalReviews > 0 && (
                <p className="text-xs text-gray-600 mt-1">
                  Based on {course.totalReviews} reviews
                </p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Tips */}
      <div className="bg-blue-50 rounded-2xl border border-blue-100 p-6">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="font-semibold text-gray-900 mb-2">Quick Tip</h4>
            <p className="text-sm text-gray-700 leading-relaxed">
              {course.status === "Active"
                ? "Your course is live! Share it with students to increase enrollment."
                : "Publish your course to make it available to students."}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
