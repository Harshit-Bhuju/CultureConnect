import React, { useState, useEffect } from "react";
import {
  Users,
  GraduationCap,
  ShoppingBag,
  PlayCircle,
  Filter,
  ChevronDown,
  TrendingUp,
} from "lucide-react";
import API, { BASE_URL } from "../../Configs/ApiEndpoints";
import Loading from "../../components/Common/Loading";
import { useNavigate } from "react-router-dom";

const AdminOverview = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const [mainFilter, setMainFilter] = useState("all"); // all, marketplace, learn_culture
  const [subCategory, setSubCategory] = useState("all");
  const [recentFilter, setRecentFilter] = useState("all");
  const [recentActivity, setRecentActivity] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchDashboardData();
  }, [mainFilter, subCategory]);

  useEffect(() => {
    fetchRecentActivity();
  }, [recentFilter]);

  const fetchRecentActivity = async () => {
    try {
      const response = await fetch(`${API.GET_RECENT_ACTIVITY}?type=${recentFilter}`, {
        method: "GET",
        credentials: "include",
      });
      const result = await response.json();
      if (result.success) {
        setRecentActivity(result.data);
      }
    } catch (err) {
      console.error("Error fetching recent activity:", err);
    }
  };

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams({
        filter_type: mainFilter,
        sub_category: subCategory !== "all" ? subCategory : ""
      });

      const response = await fetch(`${API.GET_OVERVIEW_STATS}?${queryParams}`, {
        method: "GET",
        credentials: "include",
      });
      const result = await response.json();
      if (result.success) {
        setData(result.data);
      }
    } catch (err) {
      console.error("Error fetching dashboard data:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleMainFilterChange = (e) => {
    setMainFilter(e.target.value);
    setSubCategory("all"); // Reset sub-category when main filter changes
  };

  // Define cards config
  const allStats = [
    {
      id: "users",
      title: "Total Users",
      value: data?.totalUsers || "0",
      icon: Users,
      iconBg: "bg-blue-50",
      iconColor: "text-blue-600",
      show: true // Always show
    },
    {
      id: "experts",
      title: "Total Experts",
      value: data?.totalTeachers || "0",
      icon: GraduationCap,
      iconBg: "bg-purple-50",
      iconColor: "text-purple-600",
      show: mainFilter === "all" || mainFilter === "learn_culture"
    },
    {
      id: "courses",
      title: "Total Courses",
      value: data?.totalCourses || "0",
      icon: PlayCircle,
      iconBg: "bg-pink-50",
      iconColor: "text-pink-600",
      show: mainFilter === "all" || mainFilter === "learn_culture"
    },
    {
      id: "sellers",
      title: "Total Sellers",
      value: data?.totalSellers || "0",
      icon: ShoppingBag,
      iconBg: "bg-orange-50",
      iconColor: "text-orange-600",
      show: mainFilter === "all" || mainFilter === "marketplace"
    },
    {
      id: "products",
      title: "Total Products",
      value: data?.totalProducts || "0",
      icon: ShoppingBag,
      iconBg: "bg-green-50",
      iconColor: "text-green-600",
      show: mainFilter === "all" || mainFilter === "marketplace"
    }
  ];

  const visibleStats = allStats.filter(stat => stat.show);

  return (
    <div className="space-y-6">
      {/* Header & Filter Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
        <div>
          <h2 className="text-xl font-bold text-gray-800">Dashboard Overview</h2>
          <p className="text-sm text-gray-500">Welcome back, Admin</p>
        </div>

        <div className="flex flex-wrap gap-3">
          {/* Main Filter */}
          <div className="relative">
            <select
              value={mainFilter}
              onChange={handleMainFilterChange}
              className="pl-4 pr-10 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm font-semibold text-gray-700 appearance-none focus:outline-none focus:ring-2 focus:ring-gray-200 cursor-pointer min-w-[140px]"
            >
              <option value="all">All Overview</option>
              <option value="marketplace">Marketplace</option>
              <option value="learn_culture">Learn Culture</option>
            </select>
            <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
          </div>

          {/* Sub Category Filter - Conditional */}
          {mainFilter === "marketplace" && (
            <div className="relative">
              <select
                value={subCategory}
                onChange={(e) => setSubCategory(e.target.value)}
                className="pl-4 pr-10 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm font-semibold text-gray-700 appearance-none focus:outline-none focus:ring-2 focus:ring-gray-200 cursor-pointer min-w-[160px]"
              >
                <option value="all">All Categories</option>
                <option value="Traditional Clothing">Traditional Clothing</option>
                <option value="Musical Instruments">Musical Instruments</option>
                <option value="Arts & Decors">Arts & Decors</option>
              </select>
              <Filter size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
            </div>
          )}

          {mainFilter === "learn_culture" && (
            <div className="relative">
              <select
                value={subCategory}
                onChange={(e) => setSubCategory(e.target.value)}
                className="pl-4 pr-10 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm font-semibold text-gray-700 appearance-none focus:outline-none focus:ring-2 focus:ring-gray-200 cursor-pointer min-w-[160px]"
              >
                <option value="all">All Categories</option>
                <option value="Cultural Dances">Cultural Dances</option>
                <option value="Cultural Singing">Cultural Singing</option>
                <option value="Musical Instruments">Musical Instruments</option>
                <option value="Cultural Art & Crafts">Cultural Art & Crafts</option>
              </select>
              <Filter size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
            </div>
          )}
        </div>
      </div>

      {loading ? (
        <div className="h-40 flex items-center justify-center">
          <Loading message="Updating stats..." />
        </div>
      ) : (
        /* Stats Grid */
        <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-${visibleStats.length > 4 ? '3' : visibleStats.length} gap-6`}>
          {visibleStats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.id}
                className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200 p-6 border border-gray-200 flex flex-col justify-between h-full">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <p className="text-sm font-bold text-gray-500 mb-1 uppercase tracking-wider">
                      {stat.title}
                    </p>
                    <h3 className="text-3xl font-black text-gray-900">
                      {stat.value}
                    </h3>
                  </div>
                  <div
                    className={`w-12 h-12 rounded-xl ${stat.iconBg} flex items-center justify-center`}>
                    <Icon className={stat.iconColor} size={24} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-bold text-gray-900">Quick Actions</h3>
        </div>
        <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
          <button
            onClick={() => navigate("/admin/teachers")}
            className="p-6 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition-all shadow-sm hover:shadow-md flex items-center gap-4">
            <div className="w-12 h-12 bg-white/10 rounded-lg flex items-center justify-center">
              <GraduationCap size={24} />
            </div>
            <div className="text-left">
              <div className="text-base font-bold">Approve Teachers</div>
              <div className="text-sm opacity-80 mt-0.5">View pending applications</div>
            </div>
          </button>

          <button
            onClick={() => navigate("/admin/users")}
            className="p-6 bg-gray-700 text-white rounded-xl hover:bg-gray-600 transition-all shadow-sm hover:shadow-md flex items-center gap-4">
            <div className="w-12 h-12 bg-white/10 rounded-lg flex items-center justify-center">
              <Users size={24} />
            </div>
            <div className="text-left">
              <div className="text-base font-bold">Manage Users</div>
              <div className="text-sm opacity-80 mt-0.5">View all system users</div>
            </div>
          </button>

          <button
            onClick={() => navigate("/admin/analytics")}
            className="p-6 bg-gray-600 text-white rounded-xl hover:bg-gray-500 transition-all shadow-sm hover:shadow-md flex items-center gap-4">
            <div className="w-12 h-12 bg-white/10 rounded-lg flex items-center justify-center">
              <TrendingUp size={24} />
            </div>
            <div className="text-left">
              <div className="text-base font-bold">Analytics Reports</div>
              <div className="text-sm opacity-80 mt-0.5">View growth & stats</div>
            </div>
          </button>
        </div>
      </div>
      {/* Recent Users Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-bold text-gray-900">Recent Users</h3>
        </div>

        <div className="divide-y divide-gray-100">
          {recentActivity.length > 0 ? (
            recentActivity.map((item, index) => {
              // Date formatting logic
              const date = new Date(item.created_at);
              const now = new Date();
              const diffInSeconds = Math.floor((now - date) / 1000);
              let timeString = "";

              if (diffInSeconds < 60) {
                timeString = `${diffInSeconds} sec ago`;
              } else if (diffInSeconds < 3600) {
                timeString = `${Math.floor(diffInSeconds / 60)} min ago`;
              } else if (diffInSeconds < 86400) {
                timeString = `${Math.floor(diffInSeconds / 3600)} hr ago`;
              } else if (diffInSeconds < 604800) { // 7 days
                timeString = `${Math.floor(diffInSeconds / 86400)} day ago`;
              } else {
                timeString = date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
              }

              // Avatar URL logic
              let avatarUrl = item.avatar || "";
              const defaultAvatar = `https://ui-avatars.com/api/?name=${item.name}&background=random`;

              if (!avatarUrl || avatarUrl === "null" || avatarUrl === "undefined") {
                avatarUrl = defaultAvatar;
              } else if (
                !avatarUrl.startsWith("http") &&
                !avatarUrl.startsWith("blob:") &&
                !avatarUrl.startsWith("data:")
              ) {
                avatarUrl = `${BASE_URL}/uploads/${avatarUrl}`;
              }

              return (
                <div key={index} className="p-4 hover:bg-gray-50 flex items-center gap-4 transition-colors">
                  <img
                    src={avatarUrl}
                    alt={item.name}
                    className="w-10 h-10 rounded-full object-cover border border-gray-100"
                    onError={(e) => {
                      e.target.src = `https://ui-avatars.com/api/?name=${item.name}&background=random`;
                    }}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-gray-900 truncate">{item.name}</p>
                    <p className="text-xs text-gray-500 truncate">{item.email}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-400 font-medium">{timeString}</p>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="p-8 text-center text-gray-500">No recent users found.</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminOverview;
