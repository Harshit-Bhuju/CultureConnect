import React from "react";
import AppSidebar from "../../components/Layout/app-sidebar";
import { SidebarProvider, SidebarInset } from "../../components/ui/sidebar";
import { useAuth } from "../../context/AuthContext";
import Loading from "../../components/Common/Loading";
import Navbar from "../../components/Layout/Navbar";
import Carousel from "../../components/Carousel/Carousel";
import "./Home.css";
import TrendingCarousel from "../../components/Carousel/TrendingCarousel";
import FashionCategories from "../../categories/FashionCategories";
import Footer from "../../components/Layout/Footer";
import MayLike from "../../components/Carousel/MayLike";
import CardsArranged from "../../components/Home/CardsArranged";
import Header from "../../components/Carousel/Header";

const Home = () => {
  const { loading } = useAuth();

  if (loading) {
    return <Loading message="Loading content..." />;
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="md:overflow-x-hidden  h-screen overflow-y-auto ">
        <Navbar />
          <Header/>
          {/* <Carousel /> */}
        <TrendingCarousel />
        {/* <FashionCategories /> */}
        <CardsArranged/>
        <MayLike />
      <Footer />
      </SidebarInset>
    </SidebarProvider>
  );
};

export default Home;
