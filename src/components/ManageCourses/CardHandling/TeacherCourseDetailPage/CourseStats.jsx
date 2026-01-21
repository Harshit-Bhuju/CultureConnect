import React from "react";
import {
  Users,
  DollarSign,
  TrendingUp,
  Eye,
  Star,
  CheckCircle,
} from "lucide-react";

export default function CourseStats({ course }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
      {/* Students Enrolled */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition">
        <div className="flex items-center justify-between mb-3">
          <div className="p-3 bg-blue-100 rounded-lg">
            <Users className="w-6 h-6 text-blue-600" />
          </div>
          <span className="text-xs text-gray-500 font-medium">
            {((course.enrolled_students / course.max_students) * 100).toFixed(
              0,
            )}
            % Full
          </span>
        </div>
        <p className="text-2xl font-bold text-gray-900">
          {course.enrolled_students}
        </p>
        <p className="text-sm text-gray-600 mt-1">
          Students Enrolled
          <span className="text-xs text-gray-500 ml-1">
            / {course.max_students} max
          </span>
        </p>
      </div>

      {/* Revenue */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition">
        <div className="flex items-center justify-between mb-3">
          <div className="p-3 bg-green-100 rounded-lg">
            <DollarSign className="w-6 h-6 text-green-600" />
          </div>
          {course.price > 0 && (
            <span className="text-xs text-gray-500 font-medium">
              Rs.{course.price} each
            </span>
          )}
        </div>
        <p className="text-2xl font-bold text-gray-900">
          Rs.{course.totalRevenue.toLocaleString()}
        </p>
        <p className="text-sm text-gray-600 mt-1">Total Revenue</p>
      </div>

      {/* Completion Rate */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition">
        <div className="flex items-center justify-between mb-3">
          <div className="p-3 bg-purple-100 rounded-lg">
            <CheckCircle className="w-6 h-6 text-purple-600" />
          </div>
          {course.completionRate >= 70 && (
            <span className="text-xs text-green-600 font-medium">
              Excellent
            </span>
          )}
        </div>
        <p className="text-2xl font-bold text-gray-900">
          {course.completionRate}%
        </p>
        <p className="text-sm text-gray-600 mt-1">Completion Rate</p>
      </div>

      {/* Rating */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition">
        <div className="flex items-center justify-between mb-3">
          <div className="p-3 bg-yellow-100 rounded-lg">
            <Star className="w-6 h-6 text-yellow-600" />
          </div>
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`w-3 h-3 ${
                  star <= course.averageRating
                    ? "fill-yellow-400 text-yellow-400"
                    : "text-gray-300"
                }`}
              />
            ))}
          </div>
        </div>
        <p className="text-2xl font-bold text-gray-900">
          {course.averageRating > 0 ? course.averageRating.toFixed(1) : "N/A"}
        </p>
        <p className="text-sm text-gray-600 mt-1">
          Average Rating
          {course.totalReviews > 0 && (
            <span className="text-xs text-gray-500 ml-1">
              ({course.totalReviews} reviews)
            </span>
          )}
        </p>
      </div>
    </div>
  );
}
