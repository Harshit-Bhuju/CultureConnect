import React, { useState, useMemo, useEffect } from "react";
import {
  Bell,
  ShoppingBag,
  UserPlus,
  BookOpen,
  Package,
  ChevronDown,
  CheckCircle2,
  Trash2,
  MoreVertical,
  TrendingUp,
  ArrowLeft,
  User,
  Users,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const Notification = () => {
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: "follower",
      title: "New Follower",
      message: "John Doe started following you",
      user: "John Doe",
      timestamp: "2 hours ago",
      date: new Date("2026-01-22T10:30:00"),
      read: false,
      avatar: "JD",
    },
    {
      id: 2,
      type: "product_purchased",
      title: "Product Sold",
      message: "Sarah Miller purchased your product",
      user: "Sarah Miller",
      product: "Premium Cotton T-Shirt",
      amount: 1299,
      timestamp: "3 hours ago",
      date: new Date("2026-01-22T09:15:00"),
      read: false,
      avatar: "SM",
    },
    {
      id: 3,
      type: "course_enrollment",
      title: "New Student Enrolled",
      message: "Alex Johnson enrolled in your course",
      user: "Alex Johnson",
      course: "Advanced React Development",
      amount: 4999,
      timestamp: "5 hours ago",
      date: new Date("2026-01-22T07:00:00"),
      read: false,
      avatar: "AJ",
    },
    {
      id: 4,
      type: "purchase_confirmed",
      title: "Purchase Confirmed",
      message: "Your purchase has been confirmed",
      product: "Wireless Headphones",
      amount: 2499,
      timestamp: "1 day ago",
      date: new Date("2026-01-21T14:20:00"),
      read: false,
      avatar: null,
    },
    {
      id: 5,
      type: "following",
      title: "New Connection",
      message: "You are now following Emma Watson",
      user: "Emma Watson",
      timestamp: "2 days ago",
      date: new Date("2026-01-20T16:45:00"),
      read: false,
      avatar: "EW",
    },
    {
      id: 6,
      type: "enrollment_confirmed",
      title: "Enrollment Successful",
      message: "Successfully enrolled in course",
      course: "Web Design Masterclass",
      amount: 3499,
      timestamp: "3 days ago",
      date: new Date("2026-01-19T11:30:00"),
      read: false,
      avatar: null,
    },
    {
      id: 7,
      type: "follower",
      title: "New Follower",
      message: "Michael Chen started following you",
      user: "Michael Chen",
      timestamp: "4 days ago",
      date: new Date("2026-01-18T09:15:00"),
      read: false,
      avatar: "MC",
    },
    {
      id: 8,
      type: "product_purchased",
      title: "Product Sold",
      message: "David Lee purchased your product",
      user: "David Lee",
      product: "Running Shoes",
      amount: 5999,
      timestamp: "5 days ago",
      date: new Date("2026-01-17T15:20:00"),
      read: false,
      avatar: "DL",
    },
  ]);

  const [filter, setFilter] = useState("all");
  const [followerSubFilter, setFollowerSubFilter] = useState("all"); // 'all', 'seller', 'teacher'
  const [activeDropdown, setActiveDropdown] = useState(null);
  const navigate = useNavigate();

  // Mark all as read when component mounts or when user leaves
  useEffect(() => {
    const markAllAsReadOnMount = () => {
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    };

    markAllAsReadOnMount();

    // Mark all as read when component unmounts (user leaves page)
    return () => {
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    };
  }, []);

  const formatDateLabel = (date) => {
    const today = new Date();
    const notifDate = new Date(date);

    // Reset hours for date comparison
    const todayStart = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate(),
    );
    const notifStart = new Date(
      notifDate.getFullYear(),
      notifDate.getMonth(),
      notifDate.getDate(),
    );

    const diffTime = todayStart - notifStart;
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      return "Today";
    } else if (diffDays === 1) {
      return "Yesterday";
    } else {
      return notifDate.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    }
  };

  const groupedNotifications = useMemo(() => {
    let filtered = [...notifications];

    if (filter === "unread") {
      filtered = filtered.filter((n) => !n.read);
    } else if (filter !== "all") {
      filtered = filtered.filter((n) => n.type === filter);

      // Apply follower sub-filter if active
      if (filter === "follower" && followerSubFilter !== "all") {
        // Mock sub-filtering logic (currently mock data doesn't have roles,
        // but this prepares the logic for real data)
        filtered = filtered.filter((n) => n.follow_role === followerSubFilter);
      }
    }

    filtered.sort((a, b) => b.date - a.date);

    const groups = {};
    filtered.forEach((notification) => {
      const dateKey = formatDateLabel(notification.date);
      if (!groups[dateKey]) {
        groups[dateKey] = [];
      }
      groups[dateKey].push(notification);
    });

    return groups;
  }, [notifications, filter]);

  const getNotificationConfig = (type) => {
    const configs = {
      follower: {
        icon: UserPlus,
        gradient: "from-blue-500 to-blue-600",
        bg: "bg-blue-50",
        iconColor: "text-blue-600",
      },
      product_purchased: {
        icon: ShoppingBag,
        gradient: "from-green-500 to-green-600",
        bg: "bg-green-50",
        iconColor: "text-green-600",
      },
      course_enrollment: {
        icon: BookOpen,
        gradient: "from-purple-500 to-purple-600",
        bg: "bg-purple-50",
        iconColor: "text-purple-600",
      },
      purchase_confirmed: {
        icon: Package,
        gradient: "from-orange-500 to-orange-600",
        bg: "bg-orange-50",
        iconColor: "text-orange-600",
      },
      following: {
        icon: UserPlus,
        gradient: "from-indigo-500 to-indigo-600",
        bg: "bg-indigo-50",
        iconColor: "text-indigo-600",
      },
      enrollment_confirmed: {
        icon: CheckCircle2,
        gradient: "from-teal-500 to-teal-600",
        bg: "bg-teal-50",
        iconColor: "text-teal-600",
      },
    };
    return configs[type] || configs.follower;
  };

  const deleteNotification = (id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
    setActiveDropdown(null);
  };

  const unreadCount = notifications.filter((n) => !n.read).length;
  const totalNotifications = Object.values(groupedNotifications).flat().length;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-8 py-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate(-1)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors border border-gray-200 group"
                title="Go back">
                <ArrowLeft className="w-6 h-6 text-gray-600 group-hover:text-gray-900" />
              </button>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-1">
                  Notifications
                </h1>
                <p className="text-sm text-gray-500">
                  Stay updated with your latest activities
                </p>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-lg p-4 border border-blue-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-blue-600 uppercase tracking-wide">
                    Unread
                  </p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">
                    {unreadCount}
                  </p>
                </div>
                <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                  <Bell className="w-5 h-5 text-white" />
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-purple-100/50 rounded-lg p-4 border border-purple-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-purple-600 uppercase tracking-wide">
                    Filtered
                  </p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">
                    {totalNotifications}
                  </p>
                </div>
                <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-white" />
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-green-100/50 rounded-lg p-4 border border-green-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-green-600 uppercase tracking-wide">
                    Total
                  </p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">
                    {notifications.length}
                  </p>
                </div>
                <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
                  <CheckCircle2 className="w-5 h-5 text-white" />
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
              {[
                { value: "all", label: "All" },
                { value: "unread", label: "Unread" },
                { value: "follower", label: "Followers" },
                { value: "product_purchased", label: "Sales" },
                { value: "course_enrollment", label: "Enrollments" },
                { value: "purchase_confirmed", label: "Purchases" },
              ].map((tab) => (
                <button
                  key={tab.value}
                  onClick={() => {
                    setFilter(tab.value);
                    if (tab.value !== "follower") setFollowerSubFilter("all");
                  }}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap border ${
                    filter === tab.value
                      ? "bg-gray-900 text-white border-gray-900 shadow-md"
                      : "bg-white text-gray-600 border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                  }`}>
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Follower Sub-categories */}
            {filter === "follower" && (
              <div className="flex items-center gap-3 p-1 animate-in fade-in slide-in-from-top-2 duration-300">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">
                  Show:
                </span>
                <div className="flex gap-1 bg-gray-100 p-0.5 rounded-lg border border-gray-200">
                  {[
                    { value: "all", label: "All", icon: Users },
                    { value: "seller", label: "Sellers", icon: ShoppingBag },
                    { value: "teacher", label: "Teachers", icon: User },
                  ].map((sub) => {
                    const SubIcon = sub.icon;
                    return (
                      <button
                        key={sub.value}
                        onClick={() => setFollowerSubFilter(sub.value)}
                        className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-bold transition-all ${
                          followerSubFilter === sub.value
                            ? "bg-white text-gray-900 shadow-sm"
                            : "text-gray-500 hover:text-gray-700"
                        }`}>
                        <SubIcon size={14} />
                        {sub.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-8 py-8">
        {Object.keys(groupedNotifications).length === 0 ? (
          <div className="text-center py-20 bg-white rounded-lg border border-gray-200">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
              <Bell className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-gray-600 font-semibold text-lg">
              No notifications
            </p>
            <p className="text-gray-400 text-sm mt-1">You're all caught up!</p>
          </div>
        ) : (
          <div className="space-y-6">
            {Object.entries(groupedNotifications).map(([dateLabel, items]) => (
              <div key={dateLabel}>
                {/* Date Header */}
                <div className="flex items-center mb-3">
                  <div className="text-sm font-semibold text-gray-900 bg-gray-100 border border-gray-200 px-3 py-1 rounded-full">
                    {dateLabel}
                  </div>
                  <div className="flex-1 h-px bg-gray-200 ml-4"></div>
                  <div className="text-xs text-gray-500 ml-4">
                    {items.length} notification{items.length !== 1 ? "s" : ""}
                  </div>
                </div>

                {/* Notifications */}
                <div className="space-y-2">
                  {items.map((notification) => {
                    const config = getNotificationConfig(notification.type);
                    const Icon = config.icon;

                    return (
                      <div
                        key={notification.id}
                        className="bg-white border border-gray-200 rounded-lg transition-all hover:shadow-sm">
                        <div className="p-4">
                          <div className="flex gap-3">
                            {/* Avatar/Icon */}
                            <div className="flex-shrink-0">
                              {notification.avatar ? (
                                <div
                                  className={`w-10 h-10 bg-gradient-to-br ${config.gradient} rounded-lg flex items-center justify-center shadow-sm`}>
                                  <span className="text-white font-bold text-sm">
                                    {notification.avatar}
                                  </span>
                                </div>
                              ) : (
                                <div
                                  className={`w-10 h-10 ${config.bg} rounded-lg flex items-center justify-center`}>
                                  <Icon
                                    className={`w-5 h-5 ${config.iconColor}`}
                                  />
                                </div>
                              )}
                            </div>

                            {/* Content */}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between gap-4 mb-1">
                                <h3 className="text-sm font-semibold text-gray-900">
                                  {notification.title}
                                </h3>
                                <div className="flex items-center gap-2">
                                  <span className="text-xs text-gray-400 whitespace-nowrap">
                                    {notification.timestamp}
                                  </span>
                                  <div className="relative">
                                    <button
                                      onClick={() =>
                                        setActiveDropdown(
                                          activeDropdown === notification.id
                                            ? null
                                            : notification.id,
                                        )
                                      }
                                      className="p-1 hover:bg-gray-100 rounded transition-colors">
                                      <MoreVertical className="w-4 h-4 text-gray-400" />
                                    </button>

                                    {activeDropdown === notification.id && (
                                      <div className="absolute right-0 mt-1 w-40 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10">
                                        <button
                                          onClick={() =>
                                            deleteNotification(notification.id)
                                          }
                                          className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2">
                                          <Trash2 className="w-4 h-4" />
                                          Delete
                                        </button>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>

                              <p className="text-sm text-gray-600 mb-2">
                                {notification.message}
                              </p>

                              {/* Details */}
                              <div className="flex items-center gap-3 text-xs">
                                {notification.product && (
                                  <span className="text-gray-500">
                                    <span className="font-medium text-gray-700">
                                      {notification.product}
                                    </span>
                                  </span>
                                )}
                                {notification.course && (
                                  <span className="text-gray-500">
                                    <span className="font-medium text-gray-700">
                                      {notification.course}
                                    </span>
                                  </span>
                                )}
                                {notification.amount && (
                                  <span className="font-bold text-gray-900">
                                    Rs. {notification.amount.toLocaleString()}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Notification;
