import React, { useState, useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/mousewheel";
import { Mousewheel } from "swiper/modules";
import { useNavigate } from "react-router-dom"; // for navigation
import { productsData } from "./TrendingCarouselDetails";
import { useSidebar } from "../ui/sidebar";
import Rating from "../Rating/Rating";

export default function TrendingCarousel() {
  const [activeTab, setActiveTab] = useState("Clothes");
  const [activeSubTab, setActiveSubTab] = useState("All");
  const swiperRef = useRef(null);
  const navigate = useNavigate();
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

  const goToProductPage = (productId) => {
    // Navigate to a buying page (e.g., /product/:id)
    navigate(`/product/${productId}`);
  };

  return (
    <div className="w-full py-6 px-3 sm:px-6 md:px-10">
      <div className="max-w-6xl mx-auto">
        {/* Title + Main Tabs */}
        <div
          className={`flex justify-between mb-6 gap-4 ${
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
                className={`text-sm sm:text-base font-medium pb-2 px-2 sm:px-3 md:px-0 relative transition-colors ${
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
        <div className="flex flex-wrap gap-2 sm:gap-3 mb-6">
          {subcategories[activeTab]?.map((sub) => (
            <button
              key={sub}
              onClick={() => setActiveSubTab(sub)}
              className={`text-xs sm:text-sm font-medium px-3 py-1 rounded-full border transition-colors ${
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
            480: { slidesPerView: 4 },
            0: { slidesPerView: 4 },
          }}>
          {filteredProducts.map((product) => (
            <SwiperSlide key={product.id}>
              {/* Make whole card clickable */}
              <div
                className="group relative cursor-pointer"
                onClick={() => goToProductPage(product.id)}>
                <div className="relative bg-gray-200 rounded-lg overflow-hidden mb-2 aspect-[3/4]  ">
                  <img
                    src={product.image}
                    alt={product.title}
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-105 "
                  />
                </div>

                {/* Text + Buy Button */}
              <div className="text-center">
                  <h3
                    className="text-[10px] sm:text-xs md:text-sm font-medium text-gray-700 mb-1
                
                 overflow-hidden
                 line-clamp-1
                 ">
                    {product.title}
                  </h3>
                  <div className="flex flex-col sm:flex-row items-center justify-center gap-0 sm:gap-2 mb-0 sm:mb-2">
                    <span className="text-[10px] min-[500px]:text-sm font-semibold text-gray-900">
                      {product.price}
                    </span>
                    <span className="text-[8px] min-[500px]:text-xs text-gray-400 line-through">
                      {product.originalPrice}
                    </span>
                  </div>
                   <div className="flex justify-center">
                   <Rating rating={product.rating} reviews={product.reviews} />
                    </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
}
