import React from "react";
import CultureConnectLogo from "../../../assets/logo/cultureconnect__fav.png";
import { Link } from "react-router-dom";
import { Github } from "lucide-react";

const DocNavbar = () => {
  return (
    <header className="w-full bg-white sticky top-0 z-50 border-b border-gray-200 h-20 items-center flex">
      <div className="max-w-full px-6 lg:px-12 w-full flex items-center justify-between">
        {/* Logo Area */}
        <Link to="/" className="flex items-center gap-2">
          <img
            src={CultureConnectLogo}
            alt="CultureConnect Logo"
            className="w-8 h-8 object-contain"
          />
          <span className="text-xl font-bold text-gray-900">
            CultureConnect{" "}
            <span className="text-gray-500 font-normal">Docs</span>
          </span>
        </Link>

        {/* Right Actions */}
        <div className="flex items-center gap-4">
          <Link
            to="/"
            className="text-sm font-medium text-gray-600 hover:text-royal-blue transition-colors">
            Back to App
          </Link>
          <a
            href="https://github.com/Harman-Bhuju/CultureConnect"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors">
            <Github size={18} />
            GitHub
          </a>
        </div>
      </div>
    </header>
  );
};

export default DocNavbar;
