import React, { useState } from "react";
import { Search, LogOut, ChevronDown, Menu } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const AdminHeader = ({ toggleSidebar }) => {
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    toast.success("Logged out successfully");
    navigate("/login");
  };

  return (
    <header className="bg-white border-b border-gray-200 shadow-sm z-30 sticky top-0">
      <div className="flex items-center justify-between px-6 py-4">
        {/* Left side */}
        <div className="flex items-center gap-4">
          {/* Mobile Menu Button */}
          <button
            onClick={toggleSidebar}
            className="lg:hidden p-2.5 hover:bg-gray-100 rounded-xl transition-colors">
            <Menu size={22} className="text-gray-700" />
          </button>

          {/* Search Bar */}
          <div className="hidden md:flex items-center gap-3 bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 w-96 focus-within:ring-2 focus-within:ring-gray-400 focus-within:border-gray-400 transition-all">
            <Search size={18} className="text-gray-500" />
            <input
              type="text"
              placeholder="Search users, products, or teachers..."
              className="bg-transparent outline-none text-sm flex-1 text-gray-900 placeholder-gray-500"
            />
          </div>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-4">
          {/* Profile Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="flex items-center gap-3 pl-3 pr-2 py-2 hover:bg-gray-100 border border-gray-200 rounded-xl transition-all">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center text-white font-bold shadow-sm">
                A
              </div>
              <div className="hidden md:block text-left mr-1">
                <p className="text-sm font-bold text-gray-900 leading-tight">
                  Admin
                </p>
                <p className="text-xs text-gray-500 mt-0.5">
                  Super Administrator
                </p>
              </div>
              <ChevronDown
                size={16}
                className={`text-gray-500 transition-transform duration-300 ${
                  showProfileMenu ? "rotate-180" : ""
                }`}
              />
            </button>

            {/* Dropdown Menu */}
            {showProfileMenu && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setShowProfileMenu(false)}
                />
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-2xl border border-gray-200 py-2 z-20">
                  <div className="px-4 py-3 border-b border-gray-100">
                    <p className="text-sm font-bold text-gray-900">
                      Administrator
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      admin@cultureconnect.com
                    </p>
                  </div>
                  <div className="my-1 border-t border-gray-100" />
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-red-50 text-red-600 transition-all text-sm font-bold">
                    <LogOut size={18} />
                    <span>Logout</span>
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
