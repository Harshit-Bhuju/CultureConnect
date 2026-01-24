import React, { useState, useEffect } from "react";
import { ShoppingCart, BookOpen, Calendar as CalendarIcon, ChevronLeft, ChevronRight } from "lucide-react";
import { AdminProductAnalytics } from "./AdminProductAnalytics";
import { AdminCourseAnalytics } from "./AdminCourseAnalytics";
import API from "../../Configs/ApiEndpoints";
import Loading from "../../components/Common/Loading";
import toast from "react-hot-toast";

const AdminAnalytics = () => {
  const [timeframe, setTimeframe] = useState("week");
  const [activeTab, setActiveTab] = useState("products");
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setData(null);
    fetchAnalyticsData();
  }, [timeframe, activeTab, selectedDate]);

  const fetchAnalyticsData = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `${API.GET_ADMIN_ANALYTICS}?type=${activeTab}&period=${timeframe}&date=${selectedDate}`,
        {
          method: "GET",
          credentials: "include",
        }
      );
      const result = await response.json();
      if (result.success) {
        setData(result.data);
      } else {
        toast.error(result.message || "Failed to fetch analytics");
      }
    } catch (err) {
      console.error("Error fetching analytics:", err);
      toast.error("Network error fetching analytics");
    } finally {
      setLoading(false);
    }
  };

  const handleDateChange = (days) => {
    const d = new Date(selectedDate);
    if (timeframe === "week") d.setDate(d.getDate() + (days * 7));
    else if (timeframe === "month") d.setMonth(d.getMonth() + days);
    else if (timeframe === "year") d.setFullYear(d.getFullYear() + days);
    else d.setDate(d.getDate() + days);
    setSelectedDate(d.toISOString().split('T')[0]);
  };

  return (
    <div className="space-y-6">
      {/* Header and Controls */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
        <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-6">
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

          <div className="flex flex-col md:flex-row items-center gap-4">
            {/* Calendar/Period Selector */}
            <div className="flex items-center gap-3 bg-gray-50 border border-gray-200 p-1.5 rounded-xl">
              <button
                onClick={() => handleDateChange(-1)}
                className="p-2 hover:bg-white hover:shadow-sm rounded-lg transition-all active:scale-95"
                title="Previous Period"
              >
                <ChevronLeft size={18} />
              </button>

              <div
                className="relative flex items-center gap-2 px-2 min-w-[160px] justify-center cursor-pointer hover:bg-white hover:shadow-sm py-1.5 rounded-lg transition-all"
                onClick={() => document.getElementById('hidden-date-picker').showPicker()}
              >
                <CalendarIcon size={16} className="text-gray-500" />
                <span className="text-sm font-bold text-gray-900 select-none">
                  {timeframe === 'month' ? new Date(selectedDate).toLocaleDateString('default', { month: 'long', year: 'numeric' }) :
                    timeframe === 'year' ? new Date(selectedDate).getFullYear() :
                      `Week of ${new Date(selectedDate).toLocaleDateString()}`}
                </span>

                <input
                  type={timeframe === 'month' ? "month" : "date"}
                  value={timeframe === 'month' ? selectedDate.slice(0, 7) : selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value + (timeframe === 'month' ? "-01" : ""))}
                  className="absolute inset-0 opacity-0 cursor-pointer pointer-events-none"
                  id="hidden-date-picker"
                />
              </div>

              <button
                onClick={() => handleDateChange(1)}
                className="p-2 hover:bg-white hover:shadow-sm rounded-lg transition-all active:scale-95"
                title="Next Period"
              >
                <ChevronRight size={18} />
              </button>
            </div>

            {/* Tabs */}
            <div className="flex bg-gray-100 p-1 rounded-xl">
              <button
                onClick={() => setActiveTab("products")}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === "products"
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
                  }`}>
                <ShoppingCart size={16} />
                Products
              </button>
              <button
                onClick={() => setActiveTab("courses")}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === "courses"
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
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${timeframe === period
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

      {loading ? (
        <div className="h-64 flex items-center justify-center bg-white rounded-xl border border-gray-100">
          <Loading message="Fetching dynamic analytics..." />
        </div>
      ) : data ? (
        activeTab === "products" ? (
          <AdminProductAnalytics data={data} timeframe={timeframe} />
        ) : (
          <AdminCourseAnalytics data={data} timeframe={timeframe} />
        )
      ) : (
        <div className="p-20 text-center bg-white rounded-xl border border-gray-200">
          <p className="text-gray-500 font-medium">No data available for the selected period.</p>
        </div>
      )}
    </div>
  );
};

export default AdminAnalytics;
