import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  BookOpen,
  Shield,
  ShoppingBag,
  Code,
  Globe,
  User,
  Settings,
  Flag,
  Users,
  Scale,
} from "lucide-react";

const DocSidebar = ({ activeSection, setIsMobileMenuOpen }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const sections = [
    {
      id: "overview",
      title: "Overview",
      icon: BookOpen,
      color: "blue",
    },
    {
      id: "roles",
      title: "User Roles",
      icon: User,
      color: "purple",
    },
    {
      id: "features",
      title: "Features",
      icon: Settings,
      color: "green",
    },
    {
      id: "shopping",
      title: "Shopping & Payments",
      icon: ShoppingBag,
      color: "orange",
    },
    {
      id: "technical",
      title: "Technical",
      icon: Code,
      color: "gray",
    },
    {
      id: "non-functional",
      title: "Performance & SEO",
      icon: Globe,
      color: "indigo",
    },
    {
      id: "content",
      title: "Content Guidelines",
      icon: Flag,
      color: "pink",
    },
    {
      id: "operations",
      title: "Operations",
      icon: Shield,
      color: "red",
    },
    {
      id: "team",
      title: "Meet the Team",
      icon: Users,
      path: "/documentation/team",
      color: "blue",
    },
    {
      id: "privacy",
      title: "Privacy Policy",
      icon: Shield,
      path: "/documentation/privacy",
      color: "blue",
    },
    {
      id: "terms",
      title: "Terms of Service",
      icon: Scale,
      path: "/documentation/terms",
      color: "red",
    },
  ];

  const handleScrollTo = (section) => {
    if (section.path) {
      navigate(section.path);
      if (setIsMobileMenuOpen) setIsMobileMenuOpen(false);
      return;
    }

    // If not a path, it's a scroll target on the index page
    if (window.location.pathname !== "/documentation") {
      navigate("/documentation");
      // Wait for navigation and then scroll (using state or simple timeout for now)
      setTimeout(() => {
        const element = document.getElementById(section.id);
        if (element) {
          window.scrollTo({
            top: element.offsetTop - 100,
            behavior: "smooth",
          });
        }
      }, 100);
    } else {
      const element = document.getElementById(section.id);
      if (element) {
        window.scrollTo({
          top: element.offsetTop - 100,
          behavior: "smooth",
        });
      }
    }

    if (setIsMobileMenuOpen) setIsMobileMenuOpen(false);
  };

  const getColorClasses = (color, isActive) => {
    const colors = {
      blue: isActive
        ? "bg-blue-100 text-blue-700 border-blue-300"
        : "hover:bg-blue-50 text-gray-600 hover:text-blue-700",
      purple: isActive
        ? "bg-purple-100 text-purple-700 border-purple-300"
        : "hover:bg-purple-50 text-gray-600 hover:text-purple-700",
      green: isActive
        ? "bg-green-100 text-green-700 border-green-300"
        : "hover:bg-green-50 text-gray-600 hover:text-green-700",
      orange: isActive
        ? "bg-orange-100 text-orange-700 border-orange-300"
        : "hover:bg-orange-50 text-gray-600 hover:text-orange-700",
      gray: isActive
        ? "bg-gray-100 text-gray-900 border-gray-300"
        : "hover:bg-gray-50 text-gray-600 hover:text-gray-900",
      indigo: isActive
        ? "bg-indigo-100 text-indigo-700 border-indigo-300"
        : "hover:bg-indigo-50 text-gray-600 hover:text-indigo-700",
      pink: isActive
        ? "bg-pink-100 text-pink-700 border-pink-300"
        : "hover:bg-pink-50 text-gray-600 hover:text-pink-700",
      red: isActive
        ? "bg-red-100 text-red-700 border-red-300"
        : "hover:bg-red-50 text-gray-600 hover:text-red-700",
    };
    return colors[color] || colors.blue;
  };

  return (
    <aside className="w-full h-full lg:block overflow-y-auto border-r border-gray-200 bg-white/95 backdrop-blur-sm px-5 py-6 scrollbar-hide">
      <div className="space-y-8">
        {/* Documentation Sections */}
        <div>
          <h3 className="text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-3 px-2">
            Documentation
          </h3>
          <ul className="space-y-1">
            {sections.map((section) => {
              const isOnPath = location.pathname === section.path;
              const isActive = isOnPath || activeSection === section.id;
              return (
                <li key={section.id}>
                  <button
                    onClick={() => handleScrollTo(section)}
                    className={`flex items-center gap-3 w-full px-3 py-2 rounded-lg cursor-pointer transition-all font-medium text-xs border ${
                      isActive
                        ? `${getColorClasses(section.color, true)} shadow-sm`
                        : `${getColorClasses(section.color, false)} border-transparent`
                    }`}>
                    <section.icon
                      size={16}
                      className={isActive ? "" : "opacity-60"}
                    />
                    <span className="flex-1 text-left">{section.title}</span>
                    {isActive && (
                      <div className="w-1.5 h-1.5 rounded-full bg-current animate-pulse"></div>
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Version Info */}
        <div className="pt-6 border-t border-gray-200">
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4 border border-blue-200">
            <p className="text-xs font-semibold text-gray-700 mb-1">
              Documentation v2.0
            </p>
            <p className="text-xs text-gray-500">Last updated: Jan 2026</p>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default DocSidebar;
