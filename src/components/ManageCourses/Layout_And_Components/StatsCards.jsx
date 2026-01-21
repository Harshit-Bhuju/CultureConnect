import React from "react";
import { BookOpen, TrendingUp, AlertCircle, DollarSign } from "lucide-react";
import StatsCard from "./StatsCard";

const StatsCards = ({
  totalCourses,
  activeCourses,
  draftCourses,
  totalRevenue,
}) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
    <StatsCard
      icon={BookOpen}
      iconBgColor="bg-orange-100"
      iconColor="text-orange-500"
      label="Total Courses"
      value={totalCourses}
    />
    <StatsCard
      icon={TrendingUp}
      iconBgColor="bg-green-100"
      iconColor="text-green-500"
      label="Active Courses"
      value={activeCourses}
    />
    <StatsCard
      icon={AlertCircle}
      iconBgColor="bg-yellow-100"
      iconColor="text-yellow-500"
      label="Draft / Review"
      value={draftCourses}
    />
    <StatsCard
      icon={DollarSign}
      iconBgColor="bg-orange-100"
      iconColor="text-orange-500"
      label="Total Revenue"
      value={`Rs.${Number(totalRevenue).toLocaleString()}`}
    />
  </div>
);

export default StatsCards;
