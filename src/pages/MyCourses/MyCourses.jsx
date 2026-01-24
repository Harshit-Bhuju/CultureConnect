import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Grid,
  List,
  GraduationCap,
  BookOpen,
  CheckCircle,
  Clock,
  Loader2,
  Receipt,
  History,
  Wallet,
  Calendar,
  ChevronRight,
} from "lucide-react";
import EnrolledCourseGrid from "../../components/MyCourses/EnrolledCourseGrid";
import EnrolledCourseList from "../../components/MyCourses/EnrolledCourseList";
import API from "../../Configs/ApiEndpoints";

const categories = [
  "All Categories",
  "Cultural Dances",
  "Cultural Singing",
  "Musical Instruments",
  "Cultural Art & Crafts",
];

const progressFilters = [
  { label: "All Courses", value: "all" },
  { label: "In Progress", value: "in-progress" },
  { label: "Completed", value: "completed" },
  { label: "Not Started", value: "not-started" },
];

const MyCourses = () => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [activeTab, setActiveTab] = useState("courses");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [viewMode, setViewMode] = useState("grid");
  const [categoryFilter, setCategoryFilter] = useState("All Categories");
  const [progressFilter, setProgressFilter] = useState("all");
  const [periodFilter, setPeriodFilter] = useState("Until now");

  useEffect(() => {
    fetchAllData();
  }, [periodFilter]);

  const fetchAllData = async () => {
    setLoading(true);
    await Promise.all([fetchEnrolledCourses(), fetchTransactions()]);
    setLoading(false);
  };

  const fetchEnrolledCourses = async () => {
    try {
      const response = await fetch(API.GET_ENROLLED_COURSES, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      const data = await response.json();

      if (data.status === "success") {
        setCourses(data.courses || []);
      }
    } catch (err) {
      console.error("Error fetching courses:", err);
    }
  };

  const fetchTransactions = async () => {
    try {
      const response = await fetch(
        `${API.GET_STUDENT_TRANSACTIONS}?period=${periodFilter}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        },
      );

      const data = await response.json();

      if (data.status === "success") {
        setTransactions(data.transactions || []);
      }
    } catch (err) {
      console.error("Error fetching transactions:", err);
    }
  };

  // Filter courses based on category, and progress
  const filteredCourses = courses.filter((course) => {
    const matchesCategory =
      categoryFilter === "All Categories" ||
      course.category.toLowerCase() === categoryFilter.toLowerCase();
    const matchesProgress =
      progressFilter === "all" ||
      (progressFilter === "completed" && course.progress === 100) ||
      (progressFilter === "in-progress" &&
        course.progress > 0 &&
        course.progress < 100) ||
      (progressFilter === "not-started" && course.progress === 0);

    return matchesCategory && matchesProgress;
  });

  // Stats
  const stats = {
    total: courses.length,
    inProgress: courses.filter((c) => c.progress > 0 && c.progress < 100).length,
    completed: courses.filter((c) => c.progress === 100).length,
    paid: courses.filter((c) => c.payment_status === "paid").length,
    free: courses.filter((c) => c.payment_status === "free").length,
  };

  const handleContinueCourse = (course) => {
    navigate(`/courses/${course.teacherId}/${course.id}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          {/* Title and Tabs Row */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate(-1)}
                className="flex items-center gap-2 px-3 py-2 text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
                <ArrowLeft className="w-5 h-5" />
                <span className="font-medium">Back</span>
              </button>
              <div className="h-6 w-px bg-gray-300"></div>
              <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <GraduationCap className="w-7 h-7 text-blue-600" />
                My Learning
              </h1>
            </div>

            <div className="flex bg-gray-100 p-1 rounded-xl w-fit">
              <button
                onClick={() => setActiveTab("courses")}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${activeTab === "courses"
                  ? "bg-white text-blue-600 shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
                  }`}>
                <BookOpen className="w-4 h-4" />
                My Courses
              </button>
              <button
                onClick={() => setActiveTab("transactions")}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${activeTab === "transactions"
                  ? "bg-white text-blue-600 shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
                  }`}>
                <History className="w-4 h-4" />
                Transactions
              </button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 border border-blue-200">
              <div className="flex items-center gap-2 text-blue-700 mb-1">
                <BookOpen className="w-4 h-4" />
                <span className="text-xs font-medium uppercase">Total</span>
              </div>
              <p className="text-2xl font-bold text-blue-900">{stats.total}</p>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4 border border-green-200">
              <div className="flex items-center gap-2 text-green-700 mb-1">
                <Receipt className="w-4 h-4" />
                <span className="text-xs font-medium uppercase">Paid</span>
              </div>
              <p className="text-2xl font-bold text-green-900">{stats.paid}</p>
            </div>
            <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-xl p-4 border border-emerald-200">
              <div className="flex items-center gap-2 text-emerald-700 mb-1">
                <Wallet className="w-4 h-4" />
                <span className="text-xs font-medium uppercase">Free</span>
              </div>
              <p className="text-2xl font-bold text-emerald-900">{stats.free}</p>
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-4 border border-purple-200">
              <div className="flex items-center gap-2 text-purple-700 mb-1">
                <CheckCircle className="w-4 h-4" />
                <span className="text-xs font-medium uppercase">
                  Completed
                </span>
              </div>
              <p className="text-2xl font-bold text-purple-900">
                {stats.completed}
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200 mb-8">
          <div className="flex flex-wrap gap-4 items-center">
            {/* Context-Aware Filters */}
            {activeTab === "courses" ? (
              <>
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>

                <select
                  value={progressFilter}
                  onChange={(e) => setProgressFilter(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                  {progressFilters.map((f) => (
                    <option key={f.value} value={f.value}>
                      {f.label}
                    </option>
                  ))}
                </select>
              </>
            ) : (
              <select
                value={periodFilter}
                onChange={(e) => setPeriodFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="Until now">Until now</option>
                <option value="This month">This month</option>
                <option value="This year">This year</option>
              </select>
            )}

            {/* View Toggle (Only for courses) */}
            <div className="flex gap-2 ml-auto">
              <p className="text-gray-500 py-2">
                {activeTab === "courses"
                  ? `${filteredCourses.length} courses`
                  : `${transactions.length} transactions`}
              </p>
              {activeTab === "courses" && (
                <>
                  <button
                    onClick={() => setViewMode("grid")}
                    className={`p-2 rounded ${viewMode === "grid" ? "bg-blue-100 text-blue-600" : "hover:bg-gray-100"}`}>
                    <Grid size={20} />
                  </button>
                  <button
                    onClick={() => setViewMode("list")}
                    className={`p-2 rounded ${viewMode === "list" ? "bg-blue-100 text-blue-600" : "hover:bg-gray-100"}`}>
                    <List size={20} />
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-12 h-12 text-blue-600 animate-spin mb-4" />
            <p className="text-gray-600 font-medium">Loading...</p>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-8 text-center">
            <p className="text-red-700 font-medium mb-4">{error}</p>
            <button
              onClick={fetchAllData}
              className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
              Try Again
            </button>
          </div>
        ) : activeTab === "courses" ? (
          filteredCourses.length === 0 ? (
            <div className="bg-white border border-gray-200 rounded-2xl p-12 text-center shadow-sm">
              <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <BookOpen className="w-10 h-10 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                No courses found
              </h3>
              <p className="text-gray-600 mb-8 max-w-md mx-auto">
                {categoryFilter !== "All Categories" || progressFilter !== "all"
                  ? "No courses match your filter criteria. Try adjusting your filters."
                  : "You haven't enrolled in any courses yet. Explore our library to find something you love!"}
              </p>
              {categoryFilter === "All Categories" &&
                progressFilter === "all" && (
                  <button
                    onClick={() => navigate("/learn-culture")}
                    className="px-8 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-200">
                    Browse Courses
                  </button>
                )}
            </div>
          ) : viewMode === "grid" ? (
            <EnrolledCourseGrid
              courses={filteredCourses}
              onContinue={handleContinueCourse}
            />
          ) : (
            <EnrolledCourseList
              courses={filteredCourses}
              onContinue={handleContinueCourse}
            />
          )
        ) : transactions.length === 0 ? (
          <div className="bg-white border border-gray-200 rounded-2xl p-12 text-center shadow-sm">
            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <Receipt className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              No transactions found
            </h3>
            <p className="text-gray-600 mb-4 max-w-md mx-auto">
              You haven't made any course purchases in this period.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {transactions.map((transaction) => (
              <div
                key={transaction.transactionId}
                className="bg-white border border-gray-200 rounded-2xl p-5 hover:shadow-md transition-all group">
                <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
                  {/* Thumbnail */}
                  <div className="flex-shrink-0 w-24 h-16 rounded-lg overflow-hidden bg-gray-100 border border-gray-100">
                    <img
                      src={
                        transaction.thumbnail
                          ? `${API.COURSE_THUMBNAILS}/${transaction.thumbnail}`
                          : "https://images.unsplash.com/photo-1516321497487-e288fb19713f?w=800"
                      }
                      alt={transaction.courseTitle}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${transaction.paymentStatus === "success"
                          ? "bg-green-100 text-green-700"
                          : transaction.paymentStatus === "pending"
                            ? "bg-amber-100 text-amber-700"
                            : "bg-red-100 text-red-700"
                          }`}>
                        {transaction.displayStatus}
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 line-clamp-1">
                      {transaction.courseTitle}
                    </h3>
                    <p className="text-sm text-gray-500">
                      Instructor: {transaction.teacherName}
                    </p>
                  </div>

                  {/* Payment Details */}
                  <div className="flex flex-row md:flex-col items-end gap-1 text-right min-w-[120px]">
                    <div className="text-lg font-black text-gray-900">
                      Rs. {transaction.amount.toLocaleString()}
                    </div>
                    <div className="text-xs text-gray-400 flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {transaction.paymentDate}
                    </div>
                    <div className="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded mt-1">
                      {transaction.paymentMethod}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default MyCourses;
