import React from "react";
import { Outlet, Link, useLocation } from "react-router-dom";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "../../components/ui/sidebar";
import AppSidebar from "../../components/Layout/app-sidebar";
import { Menu } from "lucide-react";

const Settings = () => {
  const location = useLocation();

  const sections = [
    { name: "Personal Details", path: "personal" },
    { name: "Password & Security", path: "security" },
  ];

  return (
    <SidebarProvider>
      <AppSidebar />

      <SidebarInset>
        <div className="flex flex-col md:flex-row h-screen bg-gray-50">
          {/* Desktop Sidebar */}
          <aside className="hidden md:block md:w-64 bg-white flex-shrink-0 shadow-inner">
            <div className="p-6 sticky top-0">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Settings</h2>
              <ul className="space-y-2">
                {sections.map((section) => (
                  <li key={section.path}>
                    <Link
                      to={section.path}
                      className={`block px-4 py-3 rounded-lg text-sm font-medium transition-colors hover:bg-gray-100 ${
                        location.pathname.includes(section.path)
                          ? "bg-blue-50 text-blue-600 font-semibold"
                          : "text-gray-700"
                      }`}
                    >
                      {section.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1 overflow-y-auto bg-gray-50">
            {/* Mobile Header with Button Group */}
            <div className="md:hidden bg-white shadow-sm sticky top-0 z-10">
              <div className="flex items-center justify-between p-4">
                <h2 className="text-2xl font-bold text-gray-800">Settings</h2>
                <SidebarTrigger className="p-2">
                  <Menu/>
                </SidebarTrigger>
              </div>

              {/* Mobile Button Group */}
            <div className="px-4 pb-4">
  <div className="flex gap-2 overflow-hidden">
    {sections.map((section) => (
      <Link
        key={section.path}
        to={section.path}
        className={`flex-1 text-center px-2 py-3 text-xs font-medium rounded-lg transition-colors ${
          location.pathname.includes(section.path)
            ? "bg-blue-600 text-white font-semibold"
            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
        }`}
      >
        {section.name}
      </Link>
    ))}
  </div>
</div>
</div>

            {/* Content Area */}
            <div className="py-6 px-4 md:py-8">
              <div className="max-w-3xl mx-auto md:mx-0">
                <Outlet />
              </div>
            </div>
          </main>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default Settings;
