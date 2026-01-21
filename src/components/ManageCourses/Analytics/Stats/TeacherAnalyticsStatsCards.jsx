import React from "react";
import {
  BookOpen,
  Users,
  DollarSign,
  Box,
  FileText,
  Trash2,
  Grid,
} from "lucide-react";
import TeacherAnalyticsStatsCard from "./TeacherAnalyticsStatsCard"; // Using specific component to avoid confusion

const TeacherAnalyticsStatsCards = ({
  totalRevenue,
  totalStudents,
  totalCourses,
  courseStats,
}) => (
  <>
    {/* Performance Stats */}
    <div className="grid grid-cols-3 gap-6">
      <TeacherAnalyticsStatsCard
        icon={DollarSign}
        iconBgColor="bg-orange-100"
        iconColor="text-orange-600"
        label="TOTAL REVENUE"
        value={`Rs. ${totalRevenue}`}
      />

      <TeacherAnalyticsStatsCard
        icon={Users}
        iconBgColor="bg-blue-100"
        iconColor="text-blue-600"
        label="TOTAL STUDENTS"
        value={totalStudents}
      />

      <TeacherAnalyticsStatsCard
        icon={BookOpen}
        iconBgColor="bg-green-100"
        iconColor="text-green-600"
        label="TOTAL COURSES"
        value={totalCourses}
      />
    </div>

    {/* Course Stats */}
    <div className="grid grid-cols-4 gap-6 mt-6">
      <TeacherAnalyticsStatsCard
        icon={Grid}
        iconBgColor="bg-purple-100"
        iconColor="text-purple-600"
        label="ALL COURSES"
        value={totalCourses} // Or courseStats.total_courses if distinct
      />

      <TeacherAnalyticsStatsCard
        icon={Box}
        iconBgColor="bg-green-100"
        iconColor="text-green-600"
        label="ACTIVE COURSES"
        value={courseStats.active_courses}
      />

      <TeacherAnalyticsStatsCard
        icon={FileText}
        iconBgColor="bg-yellow-100"
        iconColor="text-yellow-600"
        label="DRAFT COURSES"
        value={courseStats.draft_courses}
      />

      <TeacherAnalyticsStatsCard
        icon={Trash2}
        iconBgColor="bg-red-100"
        iconColor="text-red-600"
        label="ARCHIVED/DELETED"
        value={courseStats.deleted_courses || 0} // Ensure property exists or default to 0
      />
    </div>
  </>
);

export default TeacherAnalyticsStatsCards;
