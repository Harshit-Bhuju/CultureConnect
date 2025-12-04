import React, { useState, useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/mousewheel";
import { Mousewheel } from "swiper/modules";
import { productsData } from "./TrendingCarouselDetails";
import { useSidebar } from "../ui/sidebar";
import Card from "../cardlayout/Card"; 
import './TrendingCarousel.css'

export default function TrendingCarousel() {
  const [activeTab, setActiveTab] = useState("Clothes");
  const [activeSubTab, setActiveSubTab] = useState("All");
  const swiperRef = useRef(null);
  const { state: sidebarState } = useSidebar();
  const isCollapsed = sidebarState === "collapsed";

  const tabs = ["Clothes", "Instruments", "Arts & Decors"];

  const subcategories = {
    Clothes: ["All", "Men", "Women", "Kids"],
    Instruments: ["All", "Dresses", "Blouses", "Shoes"],
    "Arts & Decors": [
      "All",
      "Rompers",
      "Shoes",
      "Accessories",
      "Sneakers",
      "Outerwear",
    ],
  };

  const products = productsData;

  const filteredProducts = products.filter((product) => {
    if (activeSubTab === "All") return product.category === activeTab;
    return (
      product.category === activeTab && product.subcategory === activeSubTab
    );
  });

  return (
    <div className="w-full py-6 px-3 sm:px-6 md:px-10 bg-gray-100">
      <div className="max-w-6xl mx-auto">
        {/* Title + Main Tabs */}
        <div
          className={`flex justify-between mb-4 md:mb-6 gap-4 ${
            isCollapsed
              ? "flex-col md:flex-row items-start md:items-center"
              : "flex-col lg:flex-row items-start lg:items-center"
          }`}>
          <h1
            className={`text-xl sm:text-2xl font-bold text-gray-900 md:text-3xl`}>
            MarketPlace
          </h1>

          <div className="flex gap-2 sm:gap-4 md:gap-8">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => {
                  setActiveTab(tab);
                  setActiveSubTab("All");
                }}
                className={`text-xs sm:text-base font-medium pb-2 px-2 sm:px-3 md:px-0 relative transition-colors ${
                  activeTab === tab
                    ? "text-red-500"
                    : "text-gray-600 hover:text-gray-900"
                }`}>
                {tab}
                {activeTab === tab && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-red-500" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Sub Tabs */}
        <div className="flex overflow-x-auto gap-2 sm:gap-3 mb-6 scrollbar-hide">
          {subcategories[activeTab]?.map((sub) => (
            <button
              key={sub}
              onClick={() => setActiveSubTab(sub)}
              className={`text-[10px] sm:text-sm font-medium px-2 sm:px-3 py-1 rounded-full border transition-colors ${
                activeSubTab === sub
                  ? "bg-red-500 text-white border-red-500"
                  : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
              }`}>
              {sub}
            </button>
          ))}
        </div>

        {/* Slider */}
        <Swiper
          onSwiper={(swiper) => (swiperRef.current = swiper)}
          modules={[Mousewheel]}
          loop
          grabCursor
          mousewheel={{ forceToAxis: true }}
          spaceBetween={12}
          breakpoints={{
            1280: { slidesPerView: 6 },
            1024: { slidesPerView: 5 },
            768: { slidesPerView: 5 },
            480: { slidesPerView: 5 },
            0: { slidesPerView: 4 },
          }}>
          {filteredProducts.map((product) => (
            <SwiperSlide key={product.id}>
              <Card product={product} />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
}