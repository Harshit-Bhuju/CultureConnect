import React, { useEffect } from "react";
import { CheckCircle, Play, Check } from "lucide-react";
import API from "../../Configs/ApiEndpoints";

export default function CourseConfirmationPage({
  course,
  teacherId,
  courseId,
  navigate,
  selectedPayment,
}) {
  // Generate random enrollment ID
  const enrollmentId = `ENR-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-8">
      <div className="w-full max-w-4xl bg-white rounded-lg shadow-lg p-8">
        <div className="text-center mb-8">
          <div className="w-24 h-24 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="text-white" size={48} />
          </div>

          <h1 className="text-3xl font-bold text-black mb-2">
            Enrollment Successful!
          </h1>
          <p className="text-gray-600 text-lg">Welcome to your new course</p>
        </div>

        <div className="grid grid-cols-2 gap-6 mb-8">
          {/* Enrollment Details */}
          <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
            <h2 className="text-lg font-semibold text-black mb-4">
              Enrollment Details
            </h2>

            <div className="space-y-3 text-black">
              <div className="flex justify-between">
                <span className="text-gray-600">Enrollment ID</span>
                <span className="font-mono font-semibold">{enrollmentId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Status</span>
                <span className="font-medium text-green-600">Active</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Payment Method</span>
                <span className="font-medium">
                  {selectedPayment === "esewa" ? "eSewa" : "Manual Approval"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Enrolled On</span>
                <span className="font-medium">
                  {new Date().toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
              </div>
            </div>
          </div>

          {/* Access Details */}
          <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
            <h2 className="text-lg font-semibold text-black mb-4">
              Access Details
            </h2>

            <div className="space-y-3 text-black">
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-green-600" />
                <span className="text-sm">Lifetime Access</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-green-600" />
                <span className="text-sm">
                  {course.total_videos} Video Lessons
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-green-600" />
                <span className="text-sm">Certificate on Completion</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-green-600" />
                <span className="text-sm">Mobile & Desktop Access</span>
              </div>
            </div>
          </div>
        </div>

        {/* Course Summary */}
        <div className="bg-gray-50 rounded-lg p-6 border border-gray-200 mb-8">
          <h2 className="text-lg font-semibold text-black mb-4">Your Course</h2>
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center">
              <img
                src={`${API.COURSE_THUMBNAILS}/${course.thumbnail}`}
                alt={course.course_title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.src =
                    "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=400";
                }}
              />
            </div>
            <div className="flex-1">
              <span className="inline-block px-2 py-1 bg-blue-100 text-blue-700 text-xs font-bold rounded mb-1">
                {course.category}
              </span>
              <h3 className="font-bold text-black">{course.course_title}</h3>
              <p className="text-sm text-gray-600">
                {course.total_videos} Lessons • {course.duration_weeks} Weeks
              </p>
            </div>
            <div className="text-right">
              <p className="font-bold text-black text-lg">Rs. {course.price}</p>
              <p className="text-gray-600 text-sm">Total Paid</p>
            </div>
          </div>
        </div>

        <div className="flex gap-4">
          <button
            onClick={() => navigate(`/courses/${teacherId}/${courseId}`)}
            className="flex-1 bg-black hover:bg-gray-800 transition-colors text-white font-semibold py-4 rounded-lg flex items-center justify-center gap-2">
            <Play className="w-5 h-5" />
            Start Learning
          </button>
          <button
            onClick={() => navigate(`/learnculture`)}
            className="flex-1 bg-white hover:bg-gray-100 border-2 border-black transition-colors text-black font-semibold py-4 rounded-lg">
            Browse More Courses
          </button>
        </div>
      </div>
    </div>
  );
}
