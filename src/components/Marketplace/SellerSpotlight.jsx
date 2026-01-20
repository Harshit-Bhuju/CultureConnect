import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Star } from "lucide-react";
import API from "../../Configs/ApiEndpoints";

const SellerSpotlight = () => {
  const [sellers, setSellers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchSuggestedSellers();
  }, []);

  const fetchSuggestedSellers = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(API.GET_SUGGESTED_SELLERS, {
        method: "GET",
        credentials: "include",
      });
      const data = await response.json();

      if (data.success) {
        setSellers(data.sellers || []);
      } else {
        setError(data.error || "Failed to load sellers");
      }
    } catch (err) {
      console.error("Fetch suggested sellers error:", err);
      setError("Network error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="py-8 bg-gray-50 px-3 sm:px-6 md:px-10">
        <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex-shrink-0 w-[280px] md:w-[320px] bg-white rounded-xl p-4 animate-pulse flex items-center gap-4">
              <div className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-gray-200 shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-3/4" />
                <div className="h-3 bg-gray-200 rounded w-1/2" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (sellers.length === 0) {
    return null; // Or show a small message if needed
  }

  return (
    <div className="py-8px-3 sm:px-6 md:px-10">
      <div className="mb-4">
        <h2 className="text-xl md:text-2xl font-bold text-gray-900">
          Suggested Sellers
        </h2>
        <p className="text-sm text-gray-500">Meet top artisans</p>
      </div>

      {/* Horizontal Scroll Container */}
      <div className="flex overflow-x-auto gap-4 pb-4 md:pb-0 scrollbar-hide snap-x">
        {sellers.map((seller) => (
          <Link
            key={seller.id}
            to={`/sellerprofile/${seller.id}`}
            className="flex-shrink-0 w-[280px] md:w-[320px] snap-start bg-white rounded-xl shadow-sm border border-gray-100 p-4 transition-shadow hover:shadow-md flex items-center gap-4">
            <div className="w-14 h-14 md:w-16 md:h-16 rounded-full overflow-hidden bg-gray-200 shrink-0">
              <img
                src={`${API.SELLER_LOGOS}/${seller.image}`}
                alt={seller.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.src = "https://images.unsplash.com/photo-1459411552884-841db9b3cc2a?w=400&q=80"; // Fallback image
                }}
              />
            </div>

            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-gray-900 truncate text-sm md:text-base">
                {seller.name}
              </h3>
              <p className="text-xs text-gray-500 mb-1">{seller.specialty}</p>
              <div className="flex items-center gap-2 text-xs">
                <span className="flex items-center gap-0.5 text-yellow-500 font-medium">
                  <Star size={12} fill="currentColor" /> {seller.rating} Average Rating
                </span>
                <span className="text-gray-300">|</span>
                <span className="text-gray-500">
                  {seller.products} Products
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default SellerSpotlight;

