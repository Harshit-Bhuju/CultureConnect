import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { Map, Info, LogOut, ChevronRight, Truck, User, AlertTriangle, CheckCircle, Clock } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import toast from "react-hot-toast";

const DeliverySidebar = ({ closeSidebar }) => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    toast.success("Logged out successfully");
    navigate("/login");
  };

  const navItems = [
    { label: "My Deliveries", icon: Truck, path: "/delivery/orders" },
    { label: "Pending Confirmation", icon: Clock, path: "/delivery/pending" },
    { label: "Completed Deliveries", icon: CheckCircle, path: "/delivery/completed" },
    { label: "Personal Info", icon: User, path: "/delivery/settings/personal" },
    { label: "Security", icon: Info, path: "/delivery/settings/security" },
    { label: "Discrepancies", icon: AlertTriangle, path: "/delivery/reports" },
  ];

  return (
    <div className="w-64 h-full bg-white border-r border-slate-200 flex flex-col overflow-y-auto custom-scrollbar border-none">
      {/* Header */}
      <div className="p-4 border-b border-slate-100 mb-4">
        <div className="flex items-center gap-2 text-blue-600 mb-4 font-bold text-lg tracking-tight">
          <Truck className="w-6 h-6" />
          <span>CultureConnect</span>
        </div>
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full overflow-hidden bg-blue-100 flex items-center justify-center text-blue-700 font-bold border border-blue-200 shadow-sm text-xs">
            {user?.avatar ? (
              <img
                src={user.avatar}
                alt="Profile"
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = ""; // Clear on error to show initials fallback
                }}
              />
            ) : (
              user?.name?.charAt(0) || "D"
            )}
          </div>
          <div className="overflow-hidden">
            <p className="text-xs font-bold text-slate-800 truncate">
              {user?.name || "Delivery Boy"}
            </p>
            <p className="text-[10px] text-slate-500 font-medium truncate">
              {user?.email}
            </p>
          </div>
        </div>
      </div>

      {/* Navigation Groups */}
      <div className="flex-1 px-3 space-y-6">
        <div>
          <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-2 mb-3">
            Menu
          </h3>
          <ul className="space-y-1">
            {navItems.map((item) => (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  onClick={closeSidebar}
                  className={({ isActive }) =>
                    `group flex items-center justify-between px-3 py-2 rounded-lg text-xs font-bold transition-all ${isActive
                      ? "bg-blue-50 text-blue-700 shadow-sm border border-blue-100/50"
                      : "text-slate-600 hover:bg-slate-50/80 hover:text-slate-900"
                    }`
                  }>
                  <div className="flex items-center gap-2.5">
                    <item.icon className="w-4 h-4 opacity-70 group-hover:opacity-100 transition-opacity" />
                    {item.label}
                  </div>
                  <ChevronRight className="w-3 h-3 opacity-0 group-hover:opacity-100 -translate-x-1 group-hover:translate-x-0 transition-all" />
                </NavLink>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Footer */}
      <div className="p-3 border-t border-slate-100 bg-slate-50/50 mt-auto">
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 px-3 py-2.5 text-xs font-black text-white bg-red-600 rounded-lg hover:bg-red-700 transition-all shadow-md shadow-red-50 active:scale-[0.98]">
          <LogOut className="w-3.5 h-3.5" />
          Log Out
        </button>
      </div>
    </div>
  );
};

export default DeliverySidebar;
