import React from "react";
import { ArrowLeft } from "lucide-react";

export default function CourseUploadHeader({ onBack, isSubmitting }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8">
      <button
        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 transition"
        disabled={isSubmitting}
        onClick={onBack}>
        <ArrowLeft className="w-5 h-5" />
        Back to Courses
      </button>
      <h1 className="text-3xl font-bold text-gray-900 mb-2">
        Create New Course
      </h1>
      <p className="text-gray-600">
        Upload video lessons and build an engaging online course
      </p>
    </div>
  );
}
