import React from "react";
import { Star } from "lucide-react";
import { useSidebar } from "../ui/sidebar";

export default function Rating({ rating = 0, reviews = 0, className = "" }) {
  const { state: sidebarState } = useSidebar();
  const isCollapsed = sidebarState === "collapsed";

  const stars = Array.from({ length: 5 }, (_, i) => {
    const fillPercentage = Math.min(Math.max(rating - i, 0), 1) * 100; // 0 to 100%

    return (
      <div
        key={i}
        className="relative w-[6px] h-[6px] min-[500px]:w-2 min-[500px]:h-2 sm:w-3 sm:h-3">
        <Star
          className="w-[6px] h-[6px] min-[500px]:w-2 min-[500px]:h-2 sm:w-3 sm:h-3 text-gray-300 absolute top-0 left-0"
          fill="currentColor"
        />

        <div
          className="absolute top-0 left-0 overflow-hidden"
          style={{ width: `${fillPercentage}%` }}>
          <Star
            className="w-[6px] h-[6px] min-[500px]:w-2 min-[500px]:h-2 sm:w-3 sm:h-3 text-yellow-400"
            fill="currentColor"
          />
        </div>
      </div>
    );
  });

  return (
    <div className={`flex items-center gap-0  ${className}`}>
      {stars}
      {reviews >= 0 && (
        <span
          className={`text-[8px] min-[500px]:text-[10px] md:text-xs lg:text-sm text-gray-500
        ${isCollapsed ? "lg:text-sm" : "lg:text-xs"}
        `}>
          ({reviews})
        </span>
      )}
    </div>
  );
}
