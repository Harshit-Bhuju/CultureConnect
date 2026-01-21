import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useAuth } from "../../../context/AuthContext";
import TeacherAnalyticsStatsCards from "./Stats/TeacherAnalyticsStatsCards";
import TopPerformingCourses from "./Charts/TopPerformingCourses";
import RecentEnrollments from "./Charts/RecentEnrollments";
import TeacherTransactionHistory from "./Charts/TeacherTransactionHistory";
import useTeacherAnalytics from "../../../hooks/useTeacherAnalytics";

const TeacherAnalyticsDashboard = () => {
  const { user } = useAuth();
  const { teacherId } = useParams();
  const navigate = useNavigate();
  const [selectedPeriod, setSelectedPeriod] = useState("This month");
  const [activeTab, setActiveTab] = useState("overview");

  const periods = ["This month", "This year", "Until now"];

  // Fetch analytics data using our mock hook
  const { stats, courseStats, topCourses, recentEnrollments, loading, error } =
    useTeacherAnalytics(selectedPeriod);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-8 py-6 shadow-sm">
        <div className="max-w-7xl mx-auto">
          <button
            onClick={() =>
              navigate("/teacher/manageclasses/" + (teacherId || user.id))
            }
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 transition-colors group">
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Back to Manage Courses</span>
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
          <div className="flex flex-col md:flex-row justify-between gap-4">
            <div className="flex gap-1 bg-gray-100 p-1 rounded-lg w-fit overflow-x-auto">
              <button
                onClick={() => setActiveTab("overview")}
                className={`px-6 py-2 rounded-md text-sm font-medium transition-colors whitespace-nowrap ${
                  activeTab === "overview"
                    ? "bg-white text-gray-900 shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
                }`}>
                Overview
              </button>
              <button
                onClick={() => setActiveTab("enrollments")}
                className={`px-6 py-2 rounded-md text-sm font-medium transition-colors whitespace-nowrap ${
                  activeTab === "enrollments"
                    ? "bg-white text-gray-900 shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
                }`}>
                Recent Enrollments
              </button>
              <button
                onClick={() => setActiveTab("history")}
                className={`px-6 py-2 rounded-md text-sm font-medium transition-colors whitespace-nowrap ${
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
                className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-pointer hover:bg-gray-50 transition-colors">
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
      <main className="max-w-7xl mx-auto px-4 sm:px-8 py-8">
        {activeTab === "overview" && (
          <>
            {loading ? (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              </div>
            ) : error ? (
              <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
                <p className="text-red-600 font-medium">
                  Error loading analytics
                </p>
                <p className="text-sm text-red-500 mt-1">{error}</p>
              </div>
            ) : (
              <div className="space-y-8">
                {/* Stats Cards */}
                <TeacherAnalyticsStatsCards
                  totalRevenue={stats.total_revenue}
                  totalStudents={stats.total_students}
                  totalCourses={stats.total_courses}
                  avgRating={stats.average_rating}
                  courseStats={courseStats}
                />

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {/* Top Courses Chart */}
                  <div className="lg:col-span-1">
                    <TopPerformingCourses topCourses={topCourses} />
                  </div>

                  {/* Recent Enrollments Table (Preview) */}
                  <div className="lg:col-span-2">
                    <RecentEnrollments enrollments={recentEnrollments} />
                  </div>
                </div>
              </div>
            )}
          </>
        )}

        {/* Enrollments Tab */}
        {activeTab === "enrollments" && (
          <div className="mt-2">
            <RecentEnrollments enrollments={recentEnrollments} />
          </div>
        )}

        {/* Transaction History Tab */}
        {activeTab === "history" && (
          <div className="mt-2">
            <TeacherTransactionHistory selectedPeriod={selectedPeriod} />
          </div>
        )}
      </main>
    </div>
  );
};

export default TeacherAnalyticsDashboard;
