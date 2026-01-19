import React, { useState, useRef, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/mousewheel";
import { Mousewheel } from "swiper/modules";
import { useSidebar } from "../ui/sidebar";
import Card from "../cardLayout/Card";
import API from "../../Configs/ApiEndpoints";
import "./TrendingCarousel.css";

export default function TrendingCarousel() {
  const [activeTab, setActiveTab] = useState("cultural-clothes");
  const [activeAudience, setActiveAudience] = useState("All");
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const swiperRef = useRef(null);
  const { state: sidebarState } = useSidebar();
  const isCollapsed = sidebarState === "collapsed";

  const tabs = [
    { value: "cultural-clothes", label: "Cultural Clothes" },
    { value: "musical-instruments", label: "Musical Instruments" },
    { value: "handicraft-decors", label: "Handicraft & Decors" },
  ];

  const audienceFilters = ["All", "Men", "Women", "Boy", "Girl"];

  useEffect(() => {
    fetchProducts();
  }, [activeTab, activeAudience]);

  const fetchProducts = async () => {
    setIsLoading(true);
    setErrorMsg("");
    // NOTE: We do NOT clear products here to prevent layout shift.
    // Old products remain visible (with opacity) until new ones load.

    try {
      let url = `${API.GET_TRENDING_PRODUCTS}?category=${activeTab}`;
      if (activeTab === "cultural-clothes" && activeAudience !== "All") {
        url += `&audience=${activeAudience.toLowerCase()}`;
      }

      const response = await fetch(url, {
        method: "GET",
        credentials: "include",
      });

      const result = await response.json();

      if (result.success) {
        const validProducts = (result.products || []).filter((product) => {
          return product.id && product.seller_id;
        });

        setProducts(validProducts);

        if (validProducts.length === 0) {
          setErrorMsg(
            `No products found for ${activeTab}${
              activeAudience !== "All" ? ` (${activeAudience})` : ""
            }`
          );
        }
      } else {
        console.error("API Error:", result.error);
        setErrorMsg(result.error || "Failed to fetch products");
        setProducts([]); // Clear on error
      }
    } catch (err) {
      console.error("Fetch products error:", err);
      setErrorMsg("Network error: " + err.message);
      setProducts([]); // Clear on error
    } finally {
      setIsLoading(false);
    }
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setActiveAudience("All");
  };

  return (
    <div className="w-full py-6 px-3 sm:px-6 md:px-10 bg-gray-100">
      <div className="max-w-6xl mx-auto min-h-[340px]">
        {/* Header */}
        <div
          className={`flex justify-between mb-4 md:mb-6 gap-4 ${
            isCollapsed
              ? "flex-col md:flex-row items-start md:items-center"
              : "flex-col lg:flex-row items-start lg:items-center"
          }`}>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 md:text-3xl">
            Trending Products
          </h1>
          <div className="flex gap-2 sm:gap-4 md:gap-8">
            {tabs.map((tab) => (
              <button
                key={tab.value}
                onClick={() => handleTabChange(tab.value)}
                className={`text-xs sm:text-base font-medium pb-2 px-2 sm:px-3 md:px-0 relative transition-colors ${
                  activeTab === tab.value
                    ? "text-red-500"
                    : "text-gray-600 hover:text-gray-900"
                }`}>
                {tab.label}
                {activeTab === tab.value && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-red-500" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Filters */}
        {activeTab === "cultural-clothes" && (
          <div className="flex overflow-x-auto gap-2 sm:gap-3 mb-6 scrollbar-hide">
            {audienceFilters.map((audience) => (
              <button
                key={audience}
                onClick={() => setActiveAudience(audience)}
                className={`text-[10px] sm:text-sm font-medium px-2 sm:px-3 py-1 rounded-full border transition-colors whitespace-nowrap ${
                  activeAudience === audience
                    ? "bg-red-500 text-white border-red-500"
                    : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
                }`}>
                {audience}
              </button>
            ))}
          </div>
        )}

        {/* Content Area - Stable Height */}
        <div className="min-h-[340px] relative">
          {/* Loading Overlay Removed per user request */}

          {/* Error State */}
          {errorMsg && products.length === 0 ? (
            <div className="text-center py-12">
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 max-w-md mx-auto">
                <p className="text-red-600 text-sm">{errorMsg}</p>
                <button
                  onClick={fetchProducts}
                  className="mt-3 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors text-sm">
                  Retry
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* Product Slider */}
              {products.length > 0 ? (
                <div
                  className={`transition-opacity duration-300 ${
                    isLoading ? "opacity-50" : "opacity-100"
                  }`}>
                  <Swiper
                    onSwiper={(swiper) => (swiperRef.current = swiper)}
                    modules={[Mousewheel]}
                    loop={products.length > 6}
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
                    {products.map((product) => (
                      <SwiperSlide key={`product-${product.id}`}>
                        <Card product={product} />
                      </SwiperSlide>
                    ))}
                  </Swiper>
                </div>
              ) : (
                <div className="text-center py-12">
                  {/* Empty State */}
                  {!isLoading && (
                    <p className="text-gray-500 text-sm">
                      No products available in this category
                    </p>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
