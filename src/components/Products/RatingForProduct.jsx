import React from 'react';
import { Star} from 'lucide-react';


export default function Rating({ rating = 0, reviews = 0, className = "" }) {
  const stars = Array.from({ length: 5 }, (_, i) => {
    const fillPercentage = Math.min(Math.max(rating - i, 0), 1) * 100;

    return (
      <div
        key={i}
        className="relative w-3 h-3">
        <Star
          className="w-3 h-3 text-gray-300 absolute top-0 left-0"
          fill="currentColor"
        />
        <div
          className="absolute top-0 left-0 overflow-hidden"
          style={{ width: `${fillPercentage}%` }}>
          <Star
            className="w-3 h-3 text-yellow-400"
            fill="currentColor"
          />
        </div>
      </div>
    );
  });

  return (
    <div className={`flex items-center gap-1 ${className}`}>
      {stars}
        <span className="text-xs text-gray-500 ml-1">
          ({reviews})
        </span>
    </div>
  );
}