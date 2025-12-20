import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useSidebar } from "../ui/sidebar";
import Rating from "../Rating/Rating";
import { BASE_URL } from "../../Configs/ApiEndpoints";
import { useAuth } from "../../context/AuthContext";

export default function Card({ product }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { state: sidebarState } = useSidebar();
  const isCollapsed = sidebarState === "collapsed";

  // Handle both sellerId and seller_id (snake_case from API)
  const sellerId = product.sellerId || product.seller_id;
  const productId = product.id;



  // Safely check if it's seller's own product
  const isOwnProduct =
    user?.seller_id &&
    sellerId &&
    user.seller_id === sellerId;

  const productLink = isOwnProduct
    ? `/seller/products/${user.seller_id}/${productId}`
    : `/products/${sellerId}/${productId}`;

  // Flexible image handling
  const getFirstImage = () => {
    if (product.images?.length > 0) {
      return Array.isArray(product.images) ? product.images[0] : product.images;
    }
    return product.image || product.image_url || product.imageUrl || null;
  };

  const rawImage = getFirstImage();
  const imageUrl = rawImage
    ? rawImage.startsWith("http")
      ? rawImage
      : `${BASE_URL}/product_images/${rawImage}`
    : "/placeholder-image.png";

  // Product name fallback
  const productName =
    product.productName ||
    product.name ||
    product.title ||
    product.product_name ||
    "Unnamed Product";

  // Price formatting
  const price = (() => {
    const p = product.price;
    if (typeof p === "number") return p.toLocaleString();
    if (typeof p === "string") return parseFloat(p || 0).toLocaleString();
    return "0";
  })();

  // Rating normalization
  const rating = product.averageRating ?? product.rating ?? 0;
  const reviews = product.totalReviews ?? product.reviews ?? product.reviewCount ?? 0;

  const handleCardClick = () => {
    // Validate required IDs before navigation
    if (!productId || !sellerId) {
      console.error("Missing required IDs for navigation:", {
        productId,
        sellerId,
        product
      });
      return;
    }

    const currentLocation = location.pathname + (location.search || "");
    console.log("Navigating to:", productLink);
    navigate(productLink, { state: { from: currentLocation } });
  };

  return (
    <div
      className="group min-[340px]:min-w-[80px] relative cursor-pointer bg-white shadow-sm hover:shadow-md transition rounded-lg overflow-hidden"
      onClick={handleCardClick}
    >
      <div className="relative bg-gray-200 overflow-hidden aspect-[4/4]">
        <img
          src={imageUrl}
          alt={productName}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          onError={(e) => {
            e.target.src = "/placeholder-image.png";
          }}
        />
      </div>
      <div className="p-1 sm:p-2">
        <h3
          className={`text-[8px] min-[500px]:text-[10px] md:text-xs lg:text-sm font-medium text-gray-700 mb-1 line-clamp-2
            ${isCollapsed ? "lg:text-sm" : "lg:text-xs"}`}
        >
          {productName}
        </h3>
        <div className="flex items-center gap-1 sm:gap-2 mb-1">
          <span
            className={`text-[8px] min-[500px]:text-[10px] md:text-xs lg:text-sm font-semibold text-gray-900
              ${isCollapsed ? "lg:text-sm" : "lg:text-xs"}`}
          >
            Rs. {price}
          </span>
        </div>
        <div className="flex">
          <Rating rating={rating} reviews={reviews} />
        </div>
      </div>
    </div>
  );
}