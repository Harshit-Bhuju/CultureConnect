import React, { useState } from "react";
import { ArrowLeft } from "lucide-react";
import TeacherAnalyticsStatsCards from "./Stats/TeacherAnalyticsStatsCards";
import TopPerformingCourses from "./Chart and Enrollments/TopPerformingCourses";
import RecentEnrollments from "./Chart and Enrollments/RecentEnrollments";
import TeacherTransactionHistory from "./Chart and Enrollments/TeacherTransactionHistory";
import CancelledEnrollments from "./Chart and Enrollments/CancelledEnrollments";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import useTeacherAnalytics from "../../../hooks/useTeacherAnalytics";

const TeacherAnalyticsDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { teacherId } = useParams();
  const [selectedPeriod, setSelectedPeriod] = useState("This month");
  const [activeTab, setActiveTab] = useState("overview");

  const periods = ["This month", "This year", "Until now"];

  // Fetch analytics data based on selected period
  const { stats, courseStats, topCourses, recentEnrollments, loading, error } =
    useTeacherAnalytics(selectedPeriod);

  // Helper to filter enrollments for different tabs if needed,
  // or passing full list and letting components filter.
  // For 'Recent' we typically show active/in-progress.
  // For 'History' we show completed.
  // For 'Cancelled' we show cancelled.

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-8 py-6 shadow-sm">
        <div className="max-w-7xl mx-auto">
          <button
            onClick={() =>
              navigate(
                "/teacher/manageclasses/" + (teacherId || user.teacher_id),
              )
            } // Navigate back to Manage Courses
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 transition-colors group">
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Back</span>
          </button>

          <div className="flex justify-between items-center mb-6">
            <div>
              <p className="text-sm text-gray-500 font-medium mb-1">
                DASHBOARD
              </p>
              <h1 className="text-4xl font-bold text-gray-900">
                Teacher Analytics
              </h1>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex justify-between">
            <div className="flex gap-1 bg-gray-100 p-1 rounded-lg w-fit">
              <button
                onClick={() => setActiveTab("overview")}
                className={`px-6 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeTab === "overview"
                    ? "bg-white text-gray-900 shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
                }`}>
                Overview
              </button>
              <button
                onClick={() => setActiveTab("enrollments")}
                className={`px-6 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeTab === "enrollments"
                    ? "bg-white text-gray-900 shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
                }`}>
                Active Enrollments
              </button>
              <button
                onClick={() => setActiveTab("cancelled")}
                className={`px-6 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeTab === "cancelled"
                    ? "bg-white text-gray-900 shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
                }`}>
                Cancelled Enrollments
              </button>
              <button
                onClick={() => setActiveTab("history")}
                className={`px-6 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeTab === "history"
                    ? "bg-white text-gray-900 shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
                }`}>
                Transaction History
              </button>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600 font-medium">PERIOD</span>
              <select
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 font-medium focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent cursor-pointer hover:bg-gray-50 transition-colors">
                {periods.map((period) => (
                  <option key={period} value={period}>
                    {period}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-8 py-8">
        {/* Overview Tab */}
        {activeTab === "overview" && (
          <>
            {loading ? (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
              </div>
            ) : error ? (
              <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
                <p className="text-red-600 font-medium">
                  Error loading analytics
                </p>
                <p className="text-sm text-red-500 mt-1">{error}</p>
              </div>
            ) : (
              <>
                {/* Stats */}
                <div>
                  <h2 className="text-lg font-semibold text-gray-700 mb-4">
                    Performance Overview
                  </h2>
                  <TeacherAnalyticsStatsCards
                    totalRevenue={stats.total_revenue.toLocaleString()}
                    totalStudents={stats.total_students.toLocaleString()}
                    totalCourses={stats.total_courses.toLocaleString()}
                    courseStats={courseStats}
                  />
                </div>

                {/* Chart */}
                <div className="mt-10">
                  <TopPerformingCourses
                    selectedPeriod={selectedPeriod}
                    topCourses={topCourses}
                    loading={loading}
                  />
                </div>
              </>
            )}
          </>
        )}

        {/* Active Enrollments Tab */}
        {activeTab === "enrollments" && (
          <div className="mt-2">
            <RecentEnrollments
              selectedPeriod={selectedPeriod}
              enrollments={recentEnrollments.filter(
                (e) =>
                  !["Completed", "Cancelled", "Refunded"].includes(e.status),
              )} // Pass filtered or all
              loading={loading}
            />
          </div>
        )}

        {/* Transaction History Tab */}
        {activeTab === "history" && (
          <div className="mt-2">
            <TeacherTransactionHistory
              selectedPeriod={selectedPeriod}
              enrollments={recentEnrollments.filter((e) =>
                ["Completed"].includes(e.status),
              )}
              loading={loading}
            />
          </div>
        )}

        {activeTab === "cancelled" && (
          <div className="mt-2">
            <CancelledEnrollments
              selectedPeriod={selectedPeriod}
              enrollments={recentEnrollments.filter((e) =>
                ["Cancelled", "Refunded"].includes(e.status),
              )}
              loading={loading}
            />
          </div>
        )}
      </main>
    </div>
  );
};

export default TeacherAnalyticsDashboard;
