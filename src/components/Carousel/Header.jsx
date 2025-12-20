import React, { useState, useEffect } from "react";
import {
  ChevronRight,
  Lightbulb,
  Tv,
  Wrench,
  Car,
  Hammer,
  Leaf,
  ChevronLeft,
  Loader2,
} from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import API,{BASE_URL} from "../../Configs/ApiEndpoints";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

import "./Header.css";
import { useSidebar } from "../ui/sidebar";
import images_culture from "../../assets/image_cultural.jpg";
import download_1 from "../../assets/download.jpg";
import download_2 from "../../assets/download (1).jpg";



export default function Header() {
  const { state: sidebarState } = useSidebar();
  const isCollapsed = sidebarState === "collapsed";

  // State for popular products
  const [frequentSearches, setFrequentSearches] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);


  const manufacturers = [
    {
      title: "Learn Folk Dance.",
      image:
       images_culture,
    },
    {
      title: "Learn Sarangi",
      image:
       download_1,
    },
    {
      title: "Learn Dance from Experts",
      image:
       download_2,
    },
  ];

  // Fetch popular products for this week
  useEffect(() => {
    const fetchPopularWeek = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const response = await fetch(
         API.GET_POPULAR_WEEKLY_PRODUCTS
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        if (data.success && data.products.length > 0) {
          // Transform products to match the expected format
          const transformedProducts = data.products.map((product) => ({
            id: product.id,
            title: product.title,
            image: product.image,
            price: product.price,
            rating: product.rating,
          }));
          setFrequentSearches(transformedProducts);
        } else {
          // Fallback to empty array if no products
          setFrequentSearches([]);
        }
      } catch (err) {
        console.error("Error fetching popular products:", err);
        setError(err.message);
        // Keep empty array on error
        setFrequentSearches([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPopularWeek();
  }, []);



  return (
    <div className="bg-gray-100 py-2 sm:py-6 px-2 sm:px-4">
      <div className="max-w-7xl mx-auto grid grid-cols-3 gap-2 sm:gap-4">
        <div className="col-span-2">
          <div className="bg-white rounded-lg shadow-sm px-2 py-6 sm:px-6 relative">
            <h2 className="text-[16px] sm:text-xl font-semibold mb-2 sm:mb-4 text-gray-800">
              Popular This Week
            </h2>

            {/* Loading State */}
            {isLoading && (
              <div className="flex justify-center items-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
              </div>
            )}

            {/* Error State */}
            {error && !isLoading && (
              <div className="text-center py-8 text-red-500 text-sm">
                <p>Unable to load popular products</p>
              </div>
            )}

            {/* Products Carousel */}
            {/* Products Carousel */}
{!isLoading && !error && frequentSearches.length > 0 && (
  <Swiper
    modules={[Navigation, Autoplay]}
    autoplay={{ delay: 3000, disableOnInteraction: false }}
    navigation={{
      prevEl: ".prev-btn",
      nextEl: ".next-btn",
    }}
    loop
    spaceBetween={12}
    breakpoints={{
      1280: { slidesPerView: 3 },
      500: { slidesPerView: 2 },
      0: { slidesPerView: 2 },
    }}
    className="pb-10"
  >
    {frequentSearches.map((item, index) => {
      // Compute correct image URL for this specific item
      const getFirstImage = () => {
        if (item.image && item.image.length > 0) {
          return Array.isArray(item.image) ? item.image[0] : item.image;
        }
        return item.image || item.image_url || item.imageUrl || null;
      };

      const rawImage = getFirstImage();
      const imageUrl = rawImage
        ? rawImage.startsWith("http")
          ? rawImage
          : `${BASE_URL}/product_images/${rawImage}`
        : "/placeholder-image.png";

      return (
        <SwiperSlide key={item.id || index}>
          <div className="bg-gray-50 rounded-lg p-1 sm:p-3 hover:shadow-md transition cursor-pointer">
            <div className="aspect-square bg-white rounded overflow-hidden">
              <img
                src={imageUrl}
                alt={item.title}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>

            <h3
              className={`mt-2 text-[9px] sm:text-xs md:text-sm font-medium text-gray-700 line-clamp-1 
              ${isCollapsed ? "lg:text-sm" : "lg:text-xs"}`}
            >
              {item.title}
            </h3>
          </div>
        </SwiperSlide>
      );
    })}
  </Swiper>
)}

            {/* Empty State */}
            {!isLoading && !error && frequentSearches.length === 0 && (
              <div className="text-center py-8 text-gray-400 text-sm">
                <p>No popular products available</p>
              </div>
            )}

            {/* Navigation Buttons - Only show when products are loaded */}
            {!isLoading && frequentSearches.length > 0 && (
              <>
                <button className="prev-btn absolute left-2 top-1/2 -translate-y-1/2 bg-white shadow-lg p-2 rounded-full z-10 hover:bg-gray-50 transition">
                  <ChevronLeft size={18} className="text-gray-600" />
                </button>

                <button className="next-btn absolute right-2 top-1/2 -translate-y-1/2 bg-white shadow-lg p-2 rounded-full z-10 hover:bg-gray-50 transition">
                  <ChevronRight size={18} className="text-gray-600" />
                </button>
              </>
            )}
          </div>
        </div>

       <div className="h-full">
  <div className="bg-gradient-to-br from-blue-300 via-blue-400 to-blue-500 rounded-lg shadow overflow-hidden h-full">
    <Swiper
      modules={[Pagination, Autoplay]}
      autoplay={{ delay: 3500, disableOnInteraction: false }}
      loop
      slidesPerView={1}
      pagination={{
        clickable: true,
        bulletClass: "swiper-pagination-bullet",
        bulletActiveClass: "swiper-pagination-bullet-active",
      }}
      className="h-full"
    >
      {manufacturers.map((item, index) => (
        <SwiperSlide key={index}>
          <div className="relative h-full w-full group">
            {/* Image */}
            <img
              src={item.image}
              alt={item.title}
              className="w-full h-full object-cover"
            />

            {/* Content Overlay (Bottom-aligned) */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end items-center pb-12 px-4 text-center">
              
              {/* Title positioned nicely above the button */}
              <h3 className="text-white text-sm sm:text-base md:text-lg font-bold mb-3 leading-tight drop-shadow-lg max-w-[90%]">
                {item.title}
              </h3>

              {/* Action Button */}
              <button className="bg-red-500 hover:bg-red-600 text-white text-[10px] sm:text-xs md:text-sm font-semibold px-6 py-2 sm:py-2.5 rounded-full transition-all transform hover:scale-105 active:scale-95 shadow-lg">
                View Courses
              </button>
              
            </div>
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  </div>
</div>
      </div>
    </div>
  );
}