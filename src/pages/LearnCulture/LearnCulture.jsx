import React from "react";
import { Outlet } from "react-router-dom";
import AppSidebar from "../../components/Layout/app-sidebar";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "../../components/ui/sidebar";

const LearnCulture = () => {
  return (
    <SidebarProvider>
      <AppSidebar />

      <SidebarInset>
        <div className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold">Learn Culture</h1>
          </div>

          <Outlet />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default LearnCulture;
