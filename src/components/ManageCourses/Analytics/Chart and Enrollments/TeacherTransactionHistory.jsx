import React, { useState, useMemo } from "react";
import {
  CheckCircle2,
  ChevronDown,
  Package,
  MapPin,
  Clock,
  Hash,
} from "lucide-react";
import { BASE_URL } from "../../../../Configs/ApiEndpoints";

const TeacherTransactionHistory = ({
  selectedPeriod,
  enrollments = [],
  loading,
}) => {
  const [sortOrder, setSortOrder] = useState("newest");

  const completedEnrollments = useMemo(() => {
    let items = [...enrollments];
    items.sort((a, b) => {
      const dateA = new Date(a.date || a.createdAt);
      const dateB = new Date(b.date || b.updatedAt);
      return sortOrder === "newest" ? dateB - dateA : dateA - dateB;
    });
    return items;
  }, [enrollments, sortOrder]);

  const formatDateLabel = (dateString, selectedPeriod) => {
    const date = new Date(dateString);
    if (selectedPeriod === "This month") {
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } else {
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
      });
    }
  };

  const groupedEnrollments = useMemo(() => {
    const groups = {};
    completedEnrollments.forEach((item) => {
      const date = new Date(item.date || item.createdAt);
      const dateKey = formatDateLabel(date, selectedPeriod);
      if (!groups[dateKey]) groups[dateKey] = [];
      groups[dateKey].push(item);
    });
    return groups;
  }, [completedEnrollments, selectedPeriod]);

  const getPeriodLabel = () => {
    switch (selectedPeriod) {
      case "This month":
        return "this month";
      case "This year":
        return "this year";
      default:
        return "all time";
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
              <CheckCircle2 className="w-6 h-6 text-green-600" />
              Transaction History
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Completed enrollments - {getPeriodLabel()}
            </p>
          </div>

          <div className="relative">
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              className="appearance-none pl-4 pr-10 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-green-500 cursor-pointer transition-colors">
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
          </div>
        </div>
      </div>

      {completedEnrollments.length > 0 && (
        <div className="mt-6 mb-4 pt-4 border-t border-gray-200">
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900">
                {completedEnrollments.length}
              </p>
              <p className="text-xs text-gray-500 mt-1">Completed Courses</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900">
                Rs.{" "}
                {completedEnrollments
                  .reduce((sum, item) => sum + item.amount, 0)
                  .toLocaleString()}
              </p>
              <p className="text-xs text-gray-500 mt-1">Total Revenue</p>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-6">
        {Object.keys(groupedEnrollments).length === 0 ? (
          <div className="text-center py-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
              <Package className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-gray-500 font-medium">
              No completed transactions
            </p>
          </div>
        ) : (
          Object.entries(groupedEnrollments).map(([date, items]) => (
            <div key={date}>
              <div className="flex items-center mb-4">
                <div className="text-sm font-semibold text-gray-900 bg-green-50 border border-green-200 px-3 py-1 rounded-full">
                  {date}
                </div>
                <div className="flex-1 h-px bg-gray-200 ml-4"></div>
                <div className="text-xs text-gray-500 ml-4">
                  {items.length} transaction{items.length !== 1 ? "s" : ""}
                </div>
              </div>

              <div className="space-y-3">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="border border-gray-200 rounded-lg p-5 hover:shadow-md transition-shadow bg-white">
                    <div className="flex items-start justify-between gap-4">
                      {/* Placeholder Image or User Avatar */}
                      <div className="flex-shrink-0 w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                        <span className="text-gray-500 font-semibold">
                          {item.student_name?.[0]}
                        </span>
                      </div>

                      <div className="flex-1">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="text-gray-900 font-semibold text-lg mb-1">
                              {item.course_title}
                            </h3>
                            <p className="text-xs text-gray-500 font-mono">
                              Student: {item.student_name}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-4 mt-4 pt-3 border-t border-gray-100">
                          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800">
                            <CheckCircle2 className="w-3 h-3 mr-1" />
                            Completed
                          </span>
                          <div className="text-xs text-gray-500">
                            Completed on {item.date}
                          </div>
                          <div className="text-sm font-bold text-gray-900 ml-auto">
                            Rs. {item.amount}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default TeacherTransactionHistory;
