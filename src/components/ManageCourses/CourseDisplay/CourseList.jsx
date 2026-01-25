import React from "react";
import CourseListRow from "./CourseListRow";
import { BookOpen } from "lucide-react";

const CourseList = ({
  courses,
  onView,
  onEdit,
  onDelete,
  onPublish,
  isDraftMode,
}) => (
  <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
    {/* Table Header */}
    <div className="grid grid-cols-12 gap-4 px-6 py-4 bg-gradient-to-r from-orange-50 to-orange-100 border-b border-orange-200">
      <div className="col-span-1 text-xs font-semibold text-orange-900 uppercase tracking-wide">
        Image
      </div>
      <div className="col-span-4 text-xs font-semibold text-orange-900 uppercase tracking-wide">
        Course Details
      </div>
      <div className="col-span-2 text-xs font-semibold text-orange-900 uppercase tracking-wide">
        Category
      </div>
      <div className="col-span-1 text-xs font-semibold text-orange-900 uppercase tracking-wide">
        Price
      </div>
      <div className="col-span-2 text-xs font-semibold text-orange-900 uppercase tracking-wide">
        Rating
      </div>
      <div className="col-span-1 text-xs font-semibold text-orange-900 uppercase tracking-wide">
        Status
      </div>
      <div className="col-span-1 text-xs font-semibold text-orange-900 uppercase tracking-wide text-right">
        Actions
      </div>
    </div>

    {/* Table Body */}
    <div className="divide-y divide-gray-100">
      {courses.map((course) => (
        <CourseListRow
          key={course.id}
          course={course}
          onView={onView}
          onEdit={onEdit}
          onDelete={onDelete}
          onPublish={onPublish}
          isDraftMode={isDraftMode}
        />
      ))}
    </div>

    {/* Empty State */}
    {courses.length === 0 && (
      <div className="flex flex-col items-center justify-center py-16 px-4">
        <div className="bg-gray-100 rounded-full p-6 mb-4">
          <BookOpen className="w-12 h-12 text-gray-400" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          No courses found
        </h3>
        <p className="text-sm text-gray-500 text-center max-w-sm">
          Try adjusting your search or filter criteria to find what you're
          looking for.
        </p>
      </div>
    )}
  </div>
);

export default CourseList;
