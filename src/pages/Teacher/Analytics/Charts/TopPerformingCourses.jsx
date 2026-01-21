import React from "react";
import { TrendingUp, Users, Star, DollarSign } from "lucide-react";

const TopPerformingCourses = ({ topCourses }) => {
  if (!topCourses || topCourses.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center text-gray-500">
        No course performance data available.
      </div>
    );
  }

  // Find max revenue for progress bar scaling
  const maxRevenue = Math.max(...topCourses.map((c) => c.revenue));

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 h-full">
      <div className="p-6 border-b border-gray-200">
        <h3 className="font-semibold text-gray-800 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-blue-600" />
          Top Performing Courses
        </h3>
      </div>
      <div className="p-6 space-y-6">
        {topCourses.map((course, index) => (
          <div key={course.id} className="relative">
            <div className="flex justify-between items-start mb-2">
              <div>
                <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1 block">
                  #{index + 1}
                </span>
                <h4 className="text-sm font-semibold text-gray-900">
                  {course.title}
                </h4>
              </div>
              <div className="text-right">
                <span className="text-sm font-bold text-gray-900 block">
                  ₹{course.revenue.toLocaleString()}
                </span>
                <span className="text-xs text-green-600 font-medium">
                  Revenue
                </span>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-gray-100 rounded-full h-2 mb-3">
              <div
                className="bg-gradient-to-r from-blue-500 to-indigo-600 h-2 rounded-full"
                style={{
                  width: `${(course.revenue / maxRevenue) * 100}%`,
                }}></div>
            </div>

            <div className="flex items-center gap-4 text-xs text-gray-500">
              <div className="flex items-center gap-1">
                <Users className="w-3.5 h-3.5" />
                {course.students} students
              </div>
              <div className="flex items-center gap-1">
                <Star className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500" />
                {course.rating.toFixed(1)} rating
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="p-4 border-t border-gray-200 text-center bg-gray-50 rounded-b-lg">
        <button className="text-sm text-blue-600 hover:text-blue-800 font-medium">
          View All Courses Analytics
        </button>
      </div>
    </div>
  );
};

export default TopPerformingCourses;
