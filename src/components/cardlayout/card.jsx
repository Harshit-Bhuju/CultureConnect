import React from "react";
import { useNavigate } from "react-router-dom";
import { useSidebar } from "../ui/sidebar";
import Rating from "../Rating/Rating";

export default function Card({ product }) {
  const navigate = useNavigate();
  const { state: sidebarState } = useSidebar();
  const isCollapsed = sidebarState === "collapsed";

  const goToProductPage = (productId) => {
    navigate(`/product/${productId}`);
  };

  return (
    <div
      className="group min-[340px]:min-w-[80px] relative cursor-pointer bg-white shadow-sm hover:shadow-md transition"
      onClick={() => goToProductPage(product.id)}
    >
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
          ${isCollapsed ? "lg:text-sm" : "lg:text-xs"}`}
        >
          {product.title}
        </h3>
        <div className="flex items-center gap-1 sm:gap-2 mb-1">
          <span
            className={`text-[8px] min-[500px]:text-[10px] md:text-xs lg:text-sm font-semibold text-gray-900
            ${isCollapsed ? "lg:text-sm" : "lg:text-xs"}`}
          >
            {product.price}
          </span>
          <span
            className={`text-[8px] min-[500px]:text-[10px] md:text-xs lg:text-sm text-gray-400 line-through
            ${isCollapsed ? "lg:text-sm" : "lg:text-xs"}`}
          >
            {product.originalPrice}
          </span>
        </div>
        <div className="flex">
          <Rating rating={product.rating} reviews={product.reviews} />
        </div>
      </div>
    </div>
  );
}