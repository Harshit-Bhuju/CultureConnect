import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { productsData } from "./TrendingCarouselDetails";
import { useSidebar } from "../ui/sidebar";
import Rating from "../Rating/Rating";
import { Loader2 } from "lucide-react";

export default function MayLike() {
  const navigate = useNavigate();
  const { state: sidebarState } = useSidebar();
  const isCollapsed = sidebarState === "collapsed";
  const observerTarget = useRef(null);

  const products = productsData;

  const itemsPerRow = isCollapsed ? 7 : 6;
  const rowsToShow = 3;
  const initialVisible = itemsPerRow * rowsToShow;

  const [visibleCount, setVisibleCount] = useState(initialVisible);
  const [isAutoLoading, setIsAutoLoading] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const maxAutoLoadRows = 6; // 3 initial + 3 auto-load
  const maxAutoLoadItems = itemsPerRow * maxAutoLoadRows;

  const loadMore = (isAuto = false) => {
    if (isLoading) return;

    setIsLoading(true);

    // Simulate loading delay
    setTimeout(() => {
      setVisibleCount((prev) => {
        const newCount = prev + itemsPerRow * rowsToShow;

        // Check if we've reached the auto-load limit
        if (isAuto && newCount >= maxAutoLoadItems) {
          setIsAutoLoading(false);
        }

        return newCount;
      });
      setIsLoading(false);
    }, 800);
  };

  const handleManualLoadMore = () => {
    loadMore(false);
  };

  const goToProductPage = (productId) => {
    navigate(`/product/${productId}`);
  };

  // Intersection Observer for auto-loading
  useEffect(() => {
    if (!isAutoLoading || isLoading) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (
          entries[0].isIntersecting &&
          visibleCount < maxAutoLoadItems &&
          visibleCount < products.length
        ) {
          loadMore(true);
        }
      },
      { threshold: 0.1 }
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => {
      if (observerTarget.current) {
        observer.unobserve(observerTarget.current);
      }
    };
  }, [
    isAutoLoading,
    isLoading,
    visibleCount,
    maxAutoLoadItems,
    products.length,
  ]);

  // Reset when sidebar state changes
  useEffect(() => {
    const newInitialVisible = (isCollapsed ? 7 : 6) * rowsToShow;
    setVisibleCount(newInitialVisible);
    setIsAutoLoading(true);
  }, [isCollapsed]);

  return (
    <div className="w-full py-6 px-3 sm:px-6 md:px-10 bg-gray-100">
      <div
        className={`max-w-6xl mx-auto ${
          isCollapsed ? "lg:max-w-7xl" : "lg:max-w-6xl"
        }`}>
        {/* Title */}
        <div className="mb-8">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 md:text-4xl mb-6 ">
            You May Like
          </h1>
        </div>

        {/* Product Grid */}
        <div
          className={`grid grid-cols-4 sm:grid-cols-4 md:grid-cols-5 gap-2 sm:gap-4 ${
            isCollapsed ? "lg:grid-cols-7" : "lg:grid-cols-6"
          }`}>
          {products.slice(0, visibleCount).map((product) => (
            <div
              key={product.id}
              className="group relative cursor-pointer bg-white  shadow-sm hover:shadow-md transition"
              onClick={() => goToProductPage(product.id)}>
              <div className="relative bg-gray-200 overflow-hidden aspect-[4/4]">
                <img
                  src={product.image}
                  alt={product.title}
                  className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                />
              </div>

              <div className="p-1 sm:p-2">
                <h3
                  className={`text-[8px] min-[500px]:text-[10px] md:text-xs lg:text-sm font-medium text-gray-700 mb-1 line-clamp-1
                                 ${isCollapsed ? "lg:text-sm" : "lg:text-xs"}`}>
                  {product.title}
                </h3>
                <div className="flex  items-center gap-1 sm:gap-2 mb-1">
                  <span
                    className={`text-[8px] min-[500px]:text-[10px] md:text-xs lg:text-sm font-semibold text-gray-900
                                   ${
                                     isCollapsed ? "lg:text-sm" : "lg:text-xs"
                                   }`}>
                    {product.price}
                  </span>
                  <span
                    className={`text-[8px] min-[500px]:text-[10px] md:text-xs lg:text-sm text-gray-400 line-through
                                   ${
                                     isCollapsed ? "lg:text-sm" : "lg:text-xs"
                                   }`}>
                    {product.originalPrice}
                  </span>
                </div>
                <div className="flex">
                  <Rating rating={product.rating} reviews={product.reviews} />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Observer Target for Auto-loading */}
        {isAutoLoading &&
          visibleCount < products.length &&
          visibleCount < maxAutoLoadItems && (
            <div ref={observerTarget} className="h-20" />
          )}

        {/* Loading Spinner */}
        {isLoading && (
          <div className="flex justify-center items-center py-8">
            <Loader2 className="w-8 h-8 animate-spin text-gray-600" />
          </div>
        )}

        {/* Load More Button (shows after auto-load is complete) */}
        {!isAutoLoading && visibleCount < products.length && !isLoading && (
          <div className="flex justify-center mt-6">
            <button
              onClick={handleManualLoadMore}
              className="bg-black text-white px-6 py-2 rounded-md hover:bg-gray-900 transition">
              Load More
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
