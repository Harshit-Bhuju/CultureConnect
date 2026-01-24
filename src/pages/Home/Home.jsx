import React, { useEffect } from "react";
import AppSidebar from "../../components/Layout/app-sidebar";
import { SidebarProvider, SidebarInset } from "../../components/ui/sidebar";
import Navbar from "../../components/Layout/NavBar";
import Footer from "../../components/Layout/Footer";
import HeroSection from "../../components/Home/HeroSection";
import CategorySection from "../../components/Home/CategorySection";
import CulturalStorySection from "../../components/Home/CulturalStorySection";
import BecomeSellerSection from "../../components/Home/BecomeSellerSection";
import BecomeExpertSection from "../../components/Home/BecomeExpertSection";

const Home = () => {
  const scrollContainerRef = React.useRef(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset
        ref={scrollContainerRef}
        className="relative md:overflow-x-hidden h-screen overflow-y-auto bg-white scroll-smooth font-body text-gray-900 antialiased selection:bg-heritage-red selection:text-white">
        <Navbar />

        <main className="relative flex-1 w-full">
          <HeroSection containerRef={scrollContainerRef} />
          <CategorySection />
          <CulturalStorySection />
          <BecomeSellerSection />
          <BecomeExpertSection />
        </main>

        <Footer />
      </SidebarInset>
    </SidebarProvider>
  );
};

export default Home;
