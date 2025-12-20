import React from "react";
import { Outlet } from "react-router-dom";
import AppSidebar from "../../components/Layout/app-sidebar";
import {
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
} from "../../components/ui/sidebar";
import Navbar from "../../components/Layout/NavBar";
import Footer from "../../components/Layout/Footer";

const Marketplace = () => {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="md:overflow-x-hidden  h-screen overflow-y-auto ">
        <Navbar />
        <div className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold">Marketplace</h1>
          </div>

          <Outlet />
          <Footer/>
        </div>
        
      </SidebarInset>
    </SidebarProvider>
  );
};

export default Marketplace;
