import React, { useState } from "react";
import DeliverySidebar from "./DeliverySidebar";
import { Outlet } from "react-router-dom";
import { Menu, X } from "lucide-react";

const DeliveryDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="relative flex h-screen w-full bg-slate-50 overflow-hidden">
      {/* Mobile Toggle */}
      <div className="lg:hidden fixed top-6 right-6 z-50">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-3 bg-blue-600 text-white rounded-2xl shadow-lg active:scale-95 transition-all">
          {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Sidebar with mobile classes */}
      <div
        className={`
        fixed inset-y-0 left-0 z-40 transform transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0 lg:transition-none
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
      `}>
        <DeliverySidebar closeSidebar={() => setSidebarOpen(false)} />
      </div>

      {/* Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content Area */}
      <main className="relative flex w-full flex-1 flex-col min-w-0">
        <div className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default DeliveryDashboard;
