import React, { useState } from "react";
import AppSidebar from "../../components/Layout/app-sidebar";
import { SidebarProvider, SidebarInset } from "../../components/ui/sidebar";
import { useAuth } from "../../context/AuthContext";
import Loading from "../../components/Common/Loading";
import Navbar from "../../components/Layout/Navbar";
import Carousel from "../../components/Carousel/Carousel";
import ProductDetail from "../../components/Carousel/ProductDetail";

const Home = () => {
  const { user, loading } = useAuth();

  if (loading) return <Loading message="Checking session..." />;



  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <Navbar />

        {/* Main content */}
        <div>
          <div>
              <Carousel />
   
          </div>

        </div>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default Home;
