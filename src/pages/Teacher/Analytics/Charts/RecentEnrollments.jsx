import React from "react";
import { Eye } from "lucide-react";

const RecentEnrollments = ({ enrollments }) => {
  if (!enrollments || enrollments.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center text-gray-500">
        No recent enrollments found within this period.
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
        <h3 className="font-semibold text-gray-800">Recent Enrollments</h3>
        <button className="text-sm text-blue-600 hover:text-blue-800 font-medium">
          View All
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
              <th className="px-6 py-3">Student Name</th>
              <th className="px-6 py-3">Course</th>
              <th className="px-6 py-3">Date</th>
              <th className="px-6 py-3">Amount</th>
              <th className="px-6 py-3">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {enrollments.map((enrollment) => (
              <tr
                key={enrollment.id}
                className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 text-sm font-medium text-gray-900">
                  {enrollment.student_name}
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  {enrollment.course_title}
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {enrollment.date}
                </td>
                <td className="px-6 py-4 text-sm font-medium text-gray-900">
                  ₹{enrollment.amount}
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      enrollment.status === "Completed"
                        ? "bg-green-100 text-green-800"
                        : enrollment.status === "In Progress"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-gray-100 text-gray-800"
                    }`}>
                    {enrollment.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RecentEnrollments;
