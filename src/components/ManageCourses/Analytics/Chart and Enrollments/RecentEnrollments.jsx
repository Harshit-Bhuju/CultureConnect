import React, { useState, useMemo } from "react";
import {
  Filter,
  ChevronDown,
  Package,
  MapPin,
  Clock,
  Hash,
  User,
  BookOpen,
  Calendar,
} from "lucide-react";
import { BASE_URL } from "../../../../Configs/ApiEndpoints";

const RecentEnrollments = ({ selectedPeriod, enrollments = [], loading }) => {
  const [sortOrder, setSortOrder] = useState("newest");

  const filteredEnrollments = useMemo(() => {
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
    filteredEnrollments.forEach((item) => {
      const date = new Date(item.date || item.createdAt);
      const dateKey = formatDateLabel(date, selectedPeriod);
      if (!groups[dateKey]) groups[dateKey] = [];
      groups[dateKey].push(item);
    });
    return groups;
  }, [filteredEnrollments, selectedPeriod]);

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
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-semibold text-gray-800">Enrollments</h2>
            <p className="text-sm text-gray-500 mt-1">
              Enrolled students - {getPeriodLabel()}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <select
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
                className="appearance-none pl-4 pr-10 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-orange-500 cursor-pointer transition-colors">
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
            </div>
          </div>
        </div>
      </div>

      {filteredEnrollments.length > 0 && (
        <div className="mt-6 mb-4 pt-4 border-t border-gray-200">
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900">
                {filteredEnrollments.length}
              </p>
              <p className="text-xs text-gray-500 mt-1">Enrolled Students</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900">
                Rs.{" "}
                {filteredEnrollments
                  .reduce((sum, item) => sum + item.amount, 0)
                  .toLocaleString()}
              </p>
              <p className="text-xs text-gray-500 mt-1">Potential Revenue</p>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-6">
        {Object.keys(groupedEnrollments).length === 0 ? (
          <div className="text-center py-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
              <Filter className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-gray-500 font-medium">No enrollments found</p>
            <p className="text-sm text-gray-400 mt-1">
              {selectedPeriod === "This month"
                ? "No enrollments this month"
                : selectedPeriod === "This year"
                  ? "No enrollments this year"
                  : "Enrollments will appear here"}
            </p>
          </div>
        ) : (
          Object.entries(groupedEnrollments).map(([date, items]) => (
            <div key={date}>
              <div className="flex items-center mb-3">
                <div className="text-sm font-semibold text-gray-900 bg-orange-50 border border-orange-200 px-3 py-1 rounded-full">
                  {date}
                </div>
                <div className="flex-1 h-px bg-gray-200 ml-4"></div>
                <div className="text-xs text-gray-500 ml-4">
                  {items.length} student{items.length !== 1 ? "s" : ""}
                </div>
              </div>

              <div className="space-y-3">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="border border-gray-200 rounded-lg p-5 hover:shadow-md transition-shadow bg-white">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-start gap-4">
                          <div className="flex-shrink-0 w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                            <BookOpen className="w-6 h-6 text-orange-600" />
                          </div>

                          <div className="flex-1">
                            <div className="flex items-start justify-between mb-2">
                              <div>
                                <h3 className="text-gray-900 font-semibold text-lg">
                                  {item.course_title}
                                </h3>
                                <p className="text-xs text-gray-500 font-mono mt-1">
                                  Enrollment ID: {item.id}
                                </p>
                              </div>
                            </div>

                            <div className="grid grid-cols-2 gap-x-6 gap-y-3 mt-3">
                              <div>
                                <p className="text-xs text-gray-500 font-medium">
                                  Student Name
                                </p>
                                <p className="text-sm text-gray-900">
                                  {item.student_name}
                                </p>
                              </div>
                              <div>
                                <p className="text-xs text-gray-500 font-medium flex items-center gap-1">
                                  <Clock className="w-3 h-3" />
                                  Enrolled On
                                </p>
                                <p className="text-sm text-gray-900">
                                  {item.date}
                                </p>
                              </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t border-gray-100">
                              <div>
                                <p className="text-xs text-gray-500 font-medium">
                                  Course Price
                                </p>
                                <p className="text-sm text-gray-900">
                                  Rs. {item.amount?.toLocaleString()}
                                </p>
                              </div>
                              <div>
                                <p className="text-xs text-gray-500 font-medium">
                                  Total Amount
                                </p>
                                <p className="text-lg font-bold text-gray-900">
                                  Rs. {item.amount?.toLocaleString()}
                                </p>
                              </div>
                            </div>

                            <div className="flex items-center gap-4 mt-4 pt-3 border-t border-gray-100">
                              <div className="text-xs text-gray-500">
                                Enrolled on {item.date}
                              </div>
                            </div>
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

export default RecentEnrollments;
