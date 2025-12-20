import React, { useState, useEffect, useRef } from "react";
import { useSidebar } from "../ui/sidebar";
import { Loader2 } from "lucide-react";
import Card from "../cardlayout/Card";
import API from "../../Configs/ApiEndpoints";

// Recent sales (current month) - 5x weight
// Total sales - 2x weight
// Average rating × total reviews - 0.5x weight
// Total review count - 0.3x weight
export default function MayLike() {
  const { state: sidebarState } = useSidebar();
  const isCollapsed = sidebarState === "collapsed";
  const observerTarget = useRef(null);

  const [products, setProducts] = useState([]);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [error, setError] = useState(null);

  const itemsPerRow = isCollapsed ? 7 : 6;
  const rowsToShow = 3;
  const initialVisible = itemsPerRow * rowsToShow;

  const [visibleCount, setVisibleCount] = useState(initialVisible);
  const [isAutoLoading, setIsAutoLoading] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const maxAutoLoadRows = 6; // 3 initial + 3 auto-load
  const maxAutoLoadItems = itemsPerRow * maxAutoLoadRows;

  // Fetch popular products from PHP backend
  useEffect(() => {
    const fetchPopularProducts = async () => {
      try {
        setIsLoadingData(true);
        setError(null);

        const response = await fetch(API.GET_POPULAR_WEEKLY_PRODUCTS
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        if (data.success) {
          setProducts(data.products);
        } else {
          throw new Error(data.error || "Failed to load products");
        }
      } catch (err) {
        console.error("Error fetching popular products:", err);
        setError(err.message);
      } finally {
        setIsLoadingData(false);
      }
    };

    fetchPopularProducts();
  }, []);

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

  // Show loading state while fetching data
  if (isLoadingData) {
    return (
      <div className="w-full py-6 px-3 sm:px-6 md:px-10 bg-gray-100">
        <div className="flex justify-center items-center py-20">
          <Loader2 className="w-12 h-12 animate-spin text-gray-600" />
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="w-full py-6 px-3 sm:px-6 md:px-10 bg-gray-100">
        <div className="max-w-6xl mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
            <p className="text-red-800">Error loading products: {error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-2 text-sm text-red-600 hover:text-red-800 underline"
            >
              Try again
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Show empty state
  if (products.length === 0) {
    return (
      <div className="w-full py-6 px-3 sm:px-6 md:px-10 bg-gray-100">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 md:text-4xl mb-6">
            You May Like
          </h1>
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
            <p className="text-gray-600">No products available at the moment</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full py-6 px-3 sm:px-6 md:px-10 bg-gray-100">
      <div
        className={`max-w-6xl mx-auto ${
          isCollapsed ? "lg:max-w-7xl" : "lg:max-w-6xl"
        }`}
      >
        {/* Title */}
        <div className="mb-8">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 md:text-4xl mb-6">
            You May Like
          </h1>
        </div>

        {/* Product Grid */}
        <div
          className={`grid grid-cols-4 sm:grid-cols-4 md:grid-cols-5 gap-2 sm:gap-4 ${
            isCollapsed ? "lg:grid-cols-7" : "lg:grid-cols-6"
          }`}
        >
          {products.slice(0, visibleCount).map((product) => (
            <Card key={product.id} product={product} />
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
              className="bg-black text-white px-6 py-2 rounded-md hover:bg-gray-900 transition"
            >
              Load More
            </button>
          </div>
        )}
      </div>
    </div>
  );
}