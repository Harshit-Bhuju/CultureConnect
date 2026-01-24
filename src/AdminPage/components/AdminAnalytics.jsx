import React, { useState } from "react";
import { ShoppingCart, BookOpen } from "lucide-react";
import { AdminProductAnalytics } from "./AdminProductAnalytics";
import { AdminCourseAnalytics } from "./AdminCourseAnalytics";

const AdminAnalytics = () => {
  const [timeframe, setTimeframe] = useState("week");
  const [activeTab, setActiveTab] = useState("products");

  // Mock data for Products
  const productData = {
    salesData: [
      { day: "Mon", sales: 4200, users: 45 },
      { day: "Tue", sales: 3800, users: 38 },
      { day: "Wed", sales: 5100, users: 52 },
      { day: "Thu", sales: 4600, users: 48 },
      { day: "Fri", sales: 6200, users: 65 },
      { day: "Sat", sales: 7800, users: 82 },
      { day: "Sun", sales: 5900, users: 61 },
    ],
    topProducts: [
      { name: "Madal (Traditional Drum)", sales: 89, revenue: "Rs. 3,11,500" },
      { name: "Nepali Dhaka Topi", sales: 234, revenue: "Rs. 1,17,000" },
      { name: "Handmade Pashmina Shawl", sales: 45, revenue: "Rs. 2,02,500" },
      { name: "Buddha Statue", sales: 12, revenue: "Rs. 96,000" },
    ],
  };

  // Mock data for Courses
  const courseData = {
    courseEnrollmentData: [
      { day: "Mon", enrollments: 12, students: 45 },
      { day: "Tue", enrollments: 8, students: 38 },
      { day: "Wed", enrollments: 25, students: 52 },
      { day: "Thu", enrollments: 18, students: 48 },
      { day: "Fri", enrollments: 32, students: 65 },
      { day: "Sat", enrollments: 45, students: 82 },
      { day: "Sun", enrollments: 30, students: 61 },
    ],
    topCourses: [
      {
        name: "Classical Dance Course",
        enrollments: 156,
        revenue: "Rs. 1,24,800",
      },
      { name: "Sarangi Lessons", enrollments: 67, revenue: "Rs. 5,36,000" },
      { name: "Traditional Cooking", enrollments: 120, revenue: "Rs. 60,000" },
      {
        name: "Nepali Language Basics",
        enrollments: 89,
        revenue: "Rs. 44,500",
      },
    ],
  };

  return (
    <div className="space-y-6">
      {/* Header and Controls */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-gray-900">
              Analytics & Insights
            </h2>
            <p className="text-gray-600 mt-1">
              {activeTab === "products"
                ? "Product marketplace performance"
                : "Course enrollment and learning metrics"}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4">
            {/* Tabs */}
            <div className="flex bg-gray-100 p-1 rounded-xl">
              <button
                onClick={() => setActiveTab("products")}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                  activeTab === "products"
                    ? "bg-white text-gray-900 shadow-sm"
                    : "text-gray-500 hover:text-gray-700"
                }`}>
                <ShoppingCart size={16} />
                Products
              </button>
              <button
                onClick={() => setActiveTab("courses")}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                  activeTab === "courses"
                    ? "bg-white text-gray-900 shadow-sm"
                    : "text-gray-500 hover:text-gray-700"
                }`}>
                <BookOpen size={16} />
                Courses
              </button>
            </div>

            {/* Timeframe */}
            <div className="flex gap-1 bg-gray-100 p-1 rounded-xl">
              {["week", "month", "year"].map((period) => (
                <button
                  key={period}
                  onClick={() => setTimeframe(period)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    timeframe === period
                      ? "bg-gray-900 text-white shadow-sm"
                      : "text-gray-500 hover:text-gray-900"
                  }`}>
                  {period.toUpperCase()}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Render Active Analytics Component */}
      {activeTab === "products" ? (
        <AdminProductAnalytics data={productData} timeframe={timeframe} />
      ) : (
        <AdminCourseAnalytics data={courseData} timeframe={timeframe} />
      )}
    </div>
  );
};

export default AdminAnalytics;
