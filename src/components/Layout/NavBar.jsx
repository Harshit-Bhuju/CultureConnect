import React, { useState, useEffect } from "react";
import { Search, ShoppingCart, X, Menu } from "lucide-react";
import { SidebarTrigger, useSidebar } from "../../components/ui/sidebar";
import { useAuth } from "../../context/AuthContext";
import CultureConnectLogo from "../../assets/logo/cultureconnect__fav.png";
import { useNavigate, useLocation } from "react-router-dom";
import default_logo from "../../assets/default-image.jpg";
import SearchBar from "../Common/SearchBar";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileSearch, setIsMobileSearch] = useState(false);
  const { state: sidebarState } = useSidebar();
  const isCollapsed = sidebarState === "collapsed";

  const getSearchContext = () => {
    const path = location.pathname;
    if (
      path.includes("/marketplace") ||
      path.includes("/products") ||
      path.includes("/sellerprofile")
    ) {
      let category = "";
      if (path.includes("/traditional")) category = "cultural-clothes";
      if (path.includes("/instruments")) category = "musical-instruments";
      if (path.includes("/arts_decors")) category = "handicraft-decors";
      return { type: "product", category };
    }
    if (
      path.includes("/learnculture") ||
      path.includes("/courses") ||
      path.includes("/teacherprofile")
    ) {
      let category = "";
      if (path.includes("/dances")) category = "Cultural Dances";
      if (path.includes("/singing")) category = "Cultural Singing";
      if (path.includes("/instruments")) category = "Musical Instruments";
      if (path.includes("/art")) category = "Cultural Art & Crafts";
      return { type: "course", category };
    }
    return { type: "all", category: "" };
  };

  const context = getSearchContext();

  const handleSearchToggle = () => setIsSearchOpen(!isSearchOpen);

  useEffect(() => {
    const handleResize = () => setIsMobileSearch(window.innerWidth < 1024);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <header className="w-full bg-white sticky top-0 z-50 border-b">
      <div className="max-w-full px-2 md:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          <div className="flex items-center gap-1 flex-shrink-0">
            <div className="flex items-center lg:hidden md:gap-2 sm:gap-1">
              <SidebarTrigger className="lg:hidden text-2xl">
                <Menu />
              </SidebarTrigger>
              <img
                src={CultureConnectLogo}
                alt="Logo"
                className="w-4 h-4 md:w-6 md:h-6 object-contain"
              />
              <span className="text-sm md:text-[18px] font-bold text-gray-800">
                CultureConnect
              </span>
            </div>
            {!isSearchOpen && isCollapsed && (
              <div className="hidden lg:flex items-center gap-2">
                <img
                  src={CultureConnectLogo}
                  alt="Logo"
                  className="w-8 h-8 object-contain"
                />
                <span className="text-xl font-bold text-gray-800">
                  CultureConnect
                </span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-1 md:gap-3 flex-1 justify-end">
            {/* Desktop Search */}
            <div className="hidden lg:flex flex-1 max-w-xl">
              <SearchBar
                variant="navbar"
                contextType={context.type}
                initialCategory={context.category}
              />
            </div>

            {/* Mobile Actions */}
            {isMobileSearch && !isSearchOpen && (
              <button
                onClick={handleSearchToggle}
                className="p-2 hover:bg-gray-100 rounded-full">
                <Search className="w-5 h-5" />
              </button>
            )}

            {!isSearchOpen && (
              <>
                <button
                  className="relative p-2 hover:bg-gray-100 rounded-full"
                  onClick={() => navigate("/cart")}>
                  <ShoppingCart className="w-5 h-5" />
                </button>
                <button
                  className="flex-shrink-0 hover:opacity-80 transition-opacity"
                  onClick={() => navigate("/settings")}>
                  <img
                    src={user?.avatar || default_logo}
                    alt="User"
                    className="w-7 h-7 md:w-10 md:h-10 rounded-full border-2 border-gray-200"
                  />
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Search Overlay */}
      {isSearchOpen && isMobileSearch && (
        <div className="fixed inset-0 bg-white z-[100] flex flex-col p-4">
          <div className="flex items-center gap-3 mb-4">
            <button
              onClick={handleSearchToggle}
              className="p-3 hover:bg-gray-100 rounded-full">
              <X size={28} />
            </button>
            <div className="flex-1">
              <SearchBar
                variant="hero-marketplace"
                contextType={context.type}
                initialCategory={context.category}
              />
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
