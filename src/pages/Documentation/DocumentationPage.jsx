import React, { useEffect, useState } from "react";
import DocNavbar from "./components/DocNavbar";
import DocFooter from "./components/DocFooter";
import DocSidebar from "./components/DocSidebar";
import { Menu, X } from "lucide-react";
import { Outlet } from "react-router-dom";

const DocumentationPage = () => {
  const [activeSection, setActiveSection] = useState("overview");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);

    const handleScroll = () => {
      const sections = document.querySelectorAll("section[id]");
      let current = "";

      // Check if we are near the bottom of the page
      const isAtBottom =
        window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight - 100;

      if (isAtBottom && sections.length > 0) {
        current = sections[sections.length - 1].getAttribute("id");
      } else {
        sections.forEach((section) => {
          const sectionTop = section.offsetTop;
          if (window.scrollY >= sectionTop - 150) {
            current = section.getAttribute("id");
          }
        });
      }

      if (current) setActiveSection(current);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-white flex flex-col font-body">
      <DocNavbar />

      <div className="flex-1 flex flex-col lg:flex-row relative">
        {/* Mobile Sidebar Toggle */}
        <div className="lg:hidden fixed top-24 left-4 z-40">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 bg-royal-blue text-white rounded-md shadow-lg">
            {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Sidebar Container */}
        <div
          className={`
            fixed inset-y-0 left-0 z-30 w-72 bg-white shadow-xl transform transition-transform duration-300 ease-in-out 
            lg:translate-x-0 lg:shadow-none lg:sticky lg:top-20 lg:h-[calc(100vh-5rem)] lg:block pt-20 lg:pt-0 
            ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"}
        `}>
          <DocSidebar activeSection={activeSection} />
        </div>

        {/* Main Content */}
        <main className="flex-1 px-6 lg:px-12 py-8 w-full">
          <div className="mb-8">
            <h1 className="text-4xl md:text-5xl font-heading font-bold text-gray-900 mb-4">
              Documentation
            </h1>
            <p className="text-xl text-gray-600">
              The definitive guide to the CultureConnect platform.
            </p>
          </div>
          <Outlet />
          <div className="mt-12 border-t border-gray-200 pt-8">
            <DocFooter />
          </div>
        </main>
      </div>

      {/* Overlay for mobile sidebar */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-20 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}></div>
      )}

      {/* Footer is now inside the flex layout properly */}
    </div>
  );
};

export default DocumentationPage;
