import React from "react";
import { Outlet } from "react-router-dom";
import AppSidebar from "../../components/Layout/app-sidebar";
import {
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
} from "../../components/ui/sidebar";
import Navbar from "../../components/Layout/NavBar";

const Marketplace = () => {
  return (
    <SidebarProvider>
      <AppSidebar />

      <SidebarInset>
        <Navbar />

        <div className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold">Marketplace</h1>
          </div>

          <Outlet />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default Marketplace;
