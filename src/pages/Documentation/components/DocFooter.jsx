import React from "react";
import { Link } from "react-router-dom";

const DocFooter = () => {
  return (
    <footer className="bg-white border-t border-gray-200 py-12 px-6 lg:px-12 mt-auto">
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="text-center md:text-left">
          <p className="text-gray-500 text-sm">
            © 2026 CultureConnect. All rights reserved.
          </p>
          <p className="text-gray-400 text-xs mt-1">
            Designed and Developed by Harshit and Harman.
          </p>
        </div>

        <div className="flex gap-6 text-sm font-medium text-gray-600">
          <Link
            to="/documentation/privacy"
            className="hover:text-royal-blue hover:underline">
            Privacy Policy
          </Link>
          <Link
            to="/documentation/terms"
            className="hover:text-royal-blue hover:underline">
            Terms of Service
          </Link>
          <a
            href="https://mail.google.com/mail/?view=cm&fs=1&to=cultureconnect0701@gmail.com"
            target="_blank"
            className="hover:text-royal-blue hover:underline">
            Contact Support
          </a>
        </div>
      </div>
    </footer>
  );
};

export default DocFooter;
