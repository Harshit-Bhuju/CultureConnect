import React, { useEffect, useRef } from "react";
import { Outlet, useLocation } from "react-router-dom";
import AppSidebar from "../../components/Layout/app-sidebar";
import { SidebarProvider, SidebarInset } from "../../components/ui/sidebar";
import Navbar from "../../components/Layout/NavBar";
import Footer from "../../components/Layout/Footer";
import CategoryNav from "../../components/Marketplace/CategoryNav";
import TrendingCarousel from "../../components/Carousel/TrendingCarousel";
import MayLike from "../../components/Carousel/MayLike";
import SellerSpotlight from "../../components/Marketplace/SellerSpotlight";
import { Search } from "lucide-react";

const Marketplace = () => {
  const location = useLocation();
  const isLandingPage =
    location.pathname === "/marketplace" ||
    location.pathname === "/marketplace/";

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="md:overflow-x-hidden h-screen overflow-y-auto bg-white">
        <Navbar />

        <div className="md:p-0 max-w-7xl mx-auto w-full">
          {/* Landing Page Content */}
          {isLandingPage ? (
            <div>
              {/* Hero Section */}
              <div className="relative overflow-hidden text-center pt-20 pb-12 px-4">
                {/* Subtle Decorative Background Elements */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-orange-50/50 blur-[120px] rounded-full -z-10" />

                <h1 className="text-5xl md:text-7xl font-extrabold text-gray-900 mb-6 tracking-tight leading-tight">
                  Cultural{" "}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-amber-600">
                    Marketplace
                  </span>
                </h1>
                <p className="text-xl text-gray-500 max-w-2xl mx-auto mb-12 font-medium">
                  Discover authentic handcrafted items from master artisans.
                  Support local heritage with every purchase.
                </p>

                {/* Search Bar Refined */}
                <div className="max-w-2xl mx-auto relative group">
                  <div className="absolute -inset-1 bg-gradient-to-r from-orange-500/20 to-amber-500/20 rounded-[2rem] blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search for clothes, instruments, art..."
                      className="w-full pl-14 pr-6 py-5 bg-white border border-gray-100 rounded-[1.5rem] shadow-sm focus:ring-2 focus:ring-orange-500/10 focus:border-orange-200 outline-none transition-all hover:shadow-md text-lg"
                    />
                    <Search
                      className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-hover:text-orange-500 transition-colors"
                      size={24}
                    />
                  </div>
                </div>
              </div>

              {/* Category Navigation */}
              <div className="px-4 md:px-8">
                <div className="mb-8 text-center">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    Explore by Category
                  </h2>
                  <p className="text-gray-500">
                    Pick a category to find unique items
                  </p>
                </div>
                <CategoryNav />
              </div>

              <div className="space-y-8">
                {/* Trending Products */}
                <TrendingCarousel />

                {/* Seller Spotlight */}
                <SellerSpotlight />

                <MayLike />
              </div>
            </div>
          ) : (
            /* Sub-page Content */
            <Outlet />
          )}
        </div>

        <Footer />
      </SidebarInset>
    </SidebarProvider>
  );
};

export default Marketplace;
