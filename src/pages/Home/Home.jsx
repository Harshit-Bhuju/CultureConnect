import React from "react";
import AppSidebar from "../../components/Layout/app-sidebar";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "../../components/ui/sidebar";
import { useAuth } from "../../context/AuthContext";
import Loading from "../../components/Common/Loading";

const Home = () => {
  const { user, loading } = useAuth();

  if (loading) return <Loading message="Checking session..." />;

  return (
    <SidebarProvider>
      <AppSidebar />

      {/* Wrap trigger in a responsive div */}
     

      <SidebarInset>
         <div className="lg:hidden md:flex items-center justify-center">
        <SidebarTrigger >
          {/* You can put an icon here */}
          ☰
        </SidebarTrigger>
      </div>
        <div className="px-4 lg:p-4">
          <h1 className="text-2xl font-bold">
            Welcome Home {user?.email && `(${user.email})`}
          </h1>
          <p>Your main content goes here.</p>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default Home;
