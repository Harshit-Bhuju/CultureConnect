import React from "react";
import {
  DollarSign,
  Users,
  BookOpen,
  Star,
  TrendingUp,
  TrendingDown,
  Eye,
} from "lucide-react";

const TeacherAnalyticsStatsCards = ({
  totalRevenue,
  totalStudents,
  totalCourses,
  avgRating,
  courseStats,
}) => {
  const stats = [
    {
      label: "Total Revenue",
      value: `₹${Number(totalRevenue).toLocaleString()}`,
      change: "+12.5%",
      isPositive: true,
      icon: DollarSign,
      color: "blue",
      bgColor: "bg-blue-50",
      textColor: "text-blue-600",
    },
    {
      label: "Total Students",
      value: totalStudents,
      change: "+8.2%",
      isPositive: true,
      icon: Users,
      color: "purple",
      bgColor: "bg-purple-50",
      textColor: "text-purple-600",
    },
    {
      label: "Active Courses",
      value: courseStats?.active_courses || 0,
      change: "0%",
      isPositive: true,
      icon: BookOpen,
      color: "orange",
      bgColor: "bg-orange-50",
      textColor: "text-orange-600",
    },
    {
      label: "Average Rating",
      value: avgRating,
      change: "+0.2",
      isPositive: true,
      icon: Star,
      color: "yellow",
      bgColor: "bg-yellow-50",
      textColor: "text-yellow-600",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {stats.map((stat, index) => (
        <div
          key={index}
          className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className={`p-3 rounded-lg ${stat.bgColor}`}>
              <stat.icon className={`w-6 h-6 ${stat.textColor}`} />
            </div>
            {stat.change && (
              <div
                className={`flex items-center gap-1 text-sm font-medium ${
                  stat.isPositive ? "text-green-600" : "text-red-600"
                }`}>
                {stat.isPositive ? (
                  <TrendingUp className="w-4 h-4" />
                ) : (
                  <TrendingDown className="w-4 h-4" />
                )}
                {stat.change}
              </div>
            )}
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500 mb-1">
              {stat.label}
            </p>
            <h3 className="text-2xl font-bold text-gray-900">{stat.value}</h3>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TeacherAnalyticsStatsCards;
