import React, { useState, useEffect } from "react";
import {
  Users,
  GraduationCap,
  ShoppingBag,
  DollarSign,
  TrendingUp,
  Clock,
  ArrowRight,
  ArrowUpRight,
  ArrowDownRight,

} from "lucide-react";
import API from "../../Configs/ApiEndpoints";
import Loading from "../../components/Common/Loading";
import { useNavigate } from "react-router-dom";

const AdminOverview = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        const response = await fetch(API.GET_DASHBOARD_STATS, {
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
    fetchDashboardData();
  }, []);

  const stats = [
    {
      title: "Total Users",
      value: data?.totalUsers || "1,234",
      change: "+12%",
      changeType: "increase",
      icon: Users,
      iconBg: "bg-gray-100",
      iconColor: "text-gray-700",
    },
    {
      title: "Active Teachers",
      value: data?.totalTeachers || "87",
      change: "+5%",
      changeType: "increase",
      icon: GraduationCap,
      iconBg: "bg-gray-100",
      iconColor: "text-gray-700",
    },
    {
      title: "Pending Approvals",
      value: data?.pendingApprovals || "23",
      change: "-8%",
      changeType: "decrease",
      icon: Clock,
      iconBg: "bg-gray-100",
      iconColor: "text-gray-700",
    },
    {
      title: "Total Products",
      value: data?.totalProducts || "456",
      change: "+18%",
      changeType: "increase",
      icon: ShoppingBag,
      iconBg: "bg-gray-100",
      iconColor: "text-gray-700",
    },
    {
      title: "Revenue (Monthly)",
      value: data?.totalRevenue || "Rs. 45,670",
      change: "+23%",
      changeType: "increase",
      icon: DollarSign,
      iconBg: "bg-gray-100",
      iconColor: "text-gray-700",
    },
    {
      title: "Growth Rate",
      value: "24.5%",
      change: "+4.3%",
      changeType: "increase",
      icon: TrendingUp,
      iconBg: "bg-gray-100",
      iconColor: "text-gray-700",
    },
  ];

  if (loading) return <Loading message="Loading overview stats..." />;

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={index}
              className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200 p-6 border border-gray-200">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-600 mb-2">
                    {stat.title}
                  </p>
                  <h3 className="text-3xl font-bold text-gray-900">
                    {stat.value}
                  </h3>
                </div>
                <div
                  className={`w-12 h-12 rounded-xl ${stat.iconBg} flex items-center justify-center`}>
                  <Icon className={stat.iconColor} size={24} />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span
                  className={`inline-flex items-center gap-1 text-sm font-semibold ${
                    stat.changeType === "increase"
                      ? "text-green-600"
                      : "text-red-600"
                  }`}>
                  {stat.changeType === "increase" ? (
                    <ArrowUpRight size={16} />
                  ) : (
                    <ArrowDownRight size={16} />
                  )}
                  {stat.change}
                </span>
                <span className="text-xs text-gray-500">vs last month</span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200 flex items-center justify-between">
            <h3 className="text-lg font-bold text-gray-900">Recent Activity</h3>
            <button className="text-sm font-semibold text-gray-700 hover:text-gray-900 flex items-center gap-1 transition-colors" onClick={() => navigate("/admin/activity")} >
              View All <ArrowRight size={14} />
            </button>
          </div>
          <div className="p-6 space-y-3">
            {[1, 2, 3, 4, 5].map((item) => (
              <div
                key={item}
                className="flex items-center gap-4 p-3 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer">
                <div className="w-11 h-11 rounded-full bg-gray-100 flex items-center justify-center text-gray-700">
                  {item % 2 === 0 ? (
                    <GraduationCap size={20} />
                  ) : (
                    <Users size={20} />
                  )}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-gray-900">
                    {item % 2 === 0
                      ? "New teacher applied"
                      : "New user registered"}
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5">2 hours ago</p>
                </div>
                <div className="text-xs font-semibold text-gray-500">
                  Details
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-bold text-gray-900">Quick Actions</h3>
          </div>
          <div className="p-6 grid grid-cols-2 gap-4">
            <button
              onClick={() => navigate("/admin/teachers")}
              className="p-5 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition-all shadow-sm hover:shadow-md">
              <div className="w-11 h-11 bg-white/10 rounded-lg flex items-center justify-center mb-3">
                <GraduationCap size={22} />
              </div>
              <div className="text-left">
                <div className="text-sm font-bold">Approve Teachers</div>
                <div className="text-xs opacity-80 mt-1">12 pending</div>
              </div>
            </button>
            <button
              onClick={() => navigate("/admin/users")}
              className="p-5 bg-gray-700 text-white rounded-xl hover:bg-gray-600 transition-all shadow-sm hover:shadow-md">
              <div className="w-11 h-11 bg-white/10 rounded-lg flex items-center justify-center mb-3">
                <Users size={22} />
              </div>
              <div className="text-left">
                <div className="text-sm font-bold">Manage Users</div>
                <div className="text-xs opacity-80 mt-1">View all</div>
              </div>
            </button>
           
            <button
              onClick={() => navigate("/admin/analytics")}
              className="p-5 bg-gray-600 text-white rounded-xl hover:bg-gray-500 transition-all shadow-sm hover:shadow-md">
              <div className="w-11 h-11 bg-white/10 rounded-lg flex items-center justify-center mb-3">
                <TrendingUp size={22} />
              </div>
              <div className="text-left">
                <div className="text-sm font-bold">Analytics</div>
                <div className="text-xs opacity-80 mt-1">Reports</div>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminOverview;
