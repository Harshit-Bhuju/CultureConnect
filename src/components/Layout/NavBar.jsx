import React, { useState, useRef, useEffect } from "react";
import { Search, ShoppingCart, Bell, X } from "lucide-react";
import { SidebarTrigger, useSidebar } from "../../components/ui/sidebar";
import { useAuth } from "../../context/AuthContext";
import CultureConnectLogo from "../../assets/logo/cultureconnect__fav.png";


const Navbar = () => {
  const { user } = useAuth();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isMobileSearch, setIsMobileSearch] = useState(false);
  const searchInputRef = useRef(null);
  const { state: sidebarState } = useSidebar();
  const isCollapsed = sidebarState === "collapsed";

  // Mock search suggestions - replace with your actual data/API
  const suggestions = [
    "Traditional crafts",
    "Nepali food",
    "Cultural events",
    "Art exhibitions",
    "Music festivals",
    "Handmade products",
    "Local artisans",
  ].filter((item) => item.toLowerCase().includes(searchQuery.toLowerCase()));

  // Handle search focus when opened
  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isSearchOpen]);

  // Close search on Escape
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape" && isSearchOpen) {
        setIsSearchOpen(false);
        setSearchQuery("");
      }
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isSearchOpen]);

  // Check screen width for mobile search icon
  useEffect(() => {
    const handleResize = () => setIsMobileSearch(window.innerWidth < 1024);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleSearchToggle = () => {
    setIsSearchOpen(!isSearchOpen);
    if (isSearchOpen) setSearchQuery("");
  };

  return (
    <header className="w-full bg-gray-100 sticky top-0 z-50">
      <div className="max-w-full  sm:px-2 md:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Left: Sidebar trigger + logo */}
          <div className="flex items-center gap-1 flex-shrink-0">
            <SidebarTrigger className="lg:hidden  text-2xl">☰</SidebarTrigger>
            <div className="flex items-center lg:hidden md:gap-2 sm:gap-1">
                <img
                  src={CultureConnectLogo}
                  alt="CultureConnect Logo"
                  className="w-4 h-4 md:w-6 md:h-6 object-contain hidden md:block"
                />
                <span className="text-sm font-bold text-gray-800  sm:block">
                  CultureConnect
                </span>
              </div>

            {/* Logo and Website Name */}
            {!isSearchOpen && isCollapsed && (
              <div className="hidden lg:flex items-center gap-2">
                <img
                  src={CultureConnectLogo}
                  alt="CultureConnect Logo"
                  className="w-8 h-8 object-contain"
                />
                <span className="text-xl font-bold text-gray-800  sm:block">
                  CultureConnect
                </span>
              </div>
            )}
          </div>

          {/* Right: Search / Cart / Notifications / Avatar */}
          <div className="flex items-center gap-1 md:gap-3 flex-1 justify-end">
            {/* Desktop search bar */}
            <div className="hidden lg:flex flex-1 max-w-xl relative">
              <div className="relative w-full">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:border-blue-500 transition-colors"
                />
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                {searchQuery && suggestions.length > 0 && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden z-50">
                    {suggestions.map((suggestion, index) => (
                      <button
                        key={index}
                        onClick={() => setSearchQuery(suggestion)}
                        className="w-full px-4 py-3 text-left hover:bg-gray-100 flex items-center gap-3 transition-colors"
                      >
                        <Search  className="text-gray-400 w-5 h-5 md:w-6 md:h-6" />
                        <span>{suggestion}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Mobile search icon */}
            {isMobileSearch && !isSearchOpen && (
              <button
                onClick={handleSearchToggle}
                className="lg:hidden p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <Search className="w-5 h-5 md:w-6 md:h-6"  />
              </button>
            )}

            {/* Cart */}
            {!isSearchOpen && (
              <button className="relative p-2 hover:bg-gray-100 rounded-full transition-colors">
                <ShoppingCart className="w-5 h-5 md:w-6 md:h-6" />
                <span className="absolute top-0 right-0 bg-red-500 text-white rounded-full text-xs w-4 h-4 md:w-5 md:h-5 flex items-center justify-center font-semibold">
                  3
                </span>
              </button>
            )}

            {/* Notifications */}
            {!isSearchOpen && (
              <button className="relative p-2 hover:bg-gray-100 rounded-full transition-colors">
                <Bell className="w-5 h-5 md:w-6 md:h-6" />
                <span className="absolute top-2 right-0 bg-red-500 w-2 h-2 rounded-full"></span>
              </button>
            )}

            {/* User Avatar */}
            {!isSearchOpen && (
              <button className="flex-shrink-0">
                <img
                  src={user?.avatar}
                  alt={user?.name || "User"}
                  className="w-7 h-7 md:w-10 md:h-10 rounded-full border-2 border-gray-200 hover:border-blue-500 transition-colors"
                />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Mobile search overlay */}
      {isSearchOpen && isMobileSearch && (
        <div className="absolute inset-0 bg-white z-50 flex items-center px-4 gap-2">
          <button
            onClick={handleSearchToggle}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={24} />
          </button>
          <div className="flex-1 relative">
            <input
              ref={searchInputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:border-blue-500 transition-colors"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 md:w-6 md:h-6"  />
          </div>

          {searchQuery && suggestions.length > 0 && (
            <div className="absolute top-full left-0 right-0 bg-white border-t border-gray-200 shadow-lg max-h-[calc(100vh-4rem)] overflow-y-auto">
              {suggestions.map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setSearchQuery(suggestion);
                    setIsSearchOpen(false);
                  }}
                  className="w-full px-6 py-4 text-left hover:bg-gray-100 flex items-center gap-3 transition-colors border-b border-gray-100 last:border-b-0"
                >
                  <Search  className="text-gray-400 w-5 h-5 md:w-6 md:h-6" />
                  <span className="text-base">{suggestion}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </header>
  );
};

export default Navbar;