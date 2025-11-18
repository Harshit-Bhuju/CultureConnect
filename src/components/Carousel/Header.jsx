// ========================= HEADER.JSX (FULLY UPDATED) =========================

import React from "react";
import {
  ChevronRight,
  Lightbulb,
  Tv,
  Wrench,
  Car,
  Hammer,
  Leaf,
  ChevronLeft,
} from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

import "./Header.css";
import { productsData } from "./TrendingCarouselDetails";
import { useSidebar } from "../ui/sidebar";

export default function Header() {
  const { state: sidebarState } = useSidebar();
  const isCollapsed = sidebarState === "collapsed";

  const categories = [
    { icon: <Lightbulb size={20} />, label: "Lights & Lighting" },
    { icon: <Tv size={20} />, label: "Home Appliances" },
    { icon: <Wrench size={20} />, label: "Automotive Supplies & Tools" },
    { icon: <Car size={20} />, label: "Vehicle Parts & Accessories" },
    { icon: <Hammer size={20} />, label: "Tools & Hardware" },
    { icon: <Leaf size={20} />, label: "Renewable Energy" },
  ];

  const frequentSearches = productsData.slice(0, 6).map((p) => ({
    title: p.title,
    image: p.image,
  }));

  const manufacturers = [
    {
      title: "Discover new manufacturers",
      image:
        "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=600&h=400&fit=crop",
    },
    {
      title: "Connect with suppliers",
      image:
        "https://images.unsplash.com/photo-1664575602276-acd073f104c1?w=600&h=400&fit=crop",
    },
    {
      title: "Explore global trade",
      image:
        "https://images.unsplash.com/photo-1578575437130-527eed3abbec?w=600&h=400&fit=crop",
    },
  ];

  return (
    <div className="bg-gray-100 py-2 sm:py-6 px-2 sm:px-4">
      <div className="max-w-7xl mx-auto grid grid-cols-3 gap-2 sm:gap-4">
        <div className="col-span-2">
          <div className="bg-white rounded-lg shadow-sm px-2 py-6 sm:px-6 relative">
            <h2 className="text-[16px] sm:text-xl font-semibold mb-2 sm:mb-4 text-gray-800">
              Frequently Searched
            </h2>

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
              className="pb-10">
              {frequentSearches.map((item, index) => (
                <SwiperSlide key={index}>
                  <div className="bg-gray-50 rounded-lg p-1 sm:p-3 hover:shadow-md transition cursor-pointer">
                    <div className="aspect-square bg-white rounded overflow-hidden">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <h3
                      className={`mt-2 text-[9px] sm:text-xs md:text-sm font-medium text-gray-700 line-clamp-1 
                      ${isCollapsed ? "lg:text-sm" : "lg:text-xs"}`}>
                      {item.title}
                    </h3>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>

            {/* Navigation Buttons */}
            <button className="prev-btn absolute left-2 top-1/2 -translate-y-1/2 bg-white shadow-lg p-2 rounded-full z-10">
              <ChevronLeft size={18} className="text-gray-600" />
            </button>

            <button className="next-btn absolute right-2 top-1/2 -translate-y-1/2 bg-white shadow-lg p-2 rounded-full z-10">
              <ChevronRight size={18} className="text-gray-600" />
            </button>
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
              className="h-full">
              {manufacturers.map((item, index) => (
                <SwiperSlide key={index}>
                  <div className="relative h-full w-full">
                    <img
                      src={item.image}
                      className="w-full h-full object-cover relative"
                    />
                    <button className="w-12 sm:w-[150px] absolute bottom-[15%] sm:bottom-[10%] left-1/2 -translate-x-1/2 text-[6px] sm:text-xs md:text-sm bg-red-500 hover:bg-red-600 text-white font-medium px-0 py-2 sm:px-4 sm:py-3 rounded-lg transition">
                      View more
                    </button>
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
