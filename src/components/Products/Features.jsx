// src/components/Features.jsx
import React from "react";
import { Calendar,TrendingUp, } from "lucide-react";

const Features = ({ product }) => {
  return (
    <div className="grid grid-cols-2 gap-4 py-6 border-t mt-4">
      <div className="text-center">
        <Calendar className="w-8 h-8 mx-auto text-blue-600 mb-2" />
        <p className="text-sm font-semibold">Listed Date</p>
        <p className="text-xs text-gray-500">
          {new Date(product.createdAt).toLocaleDateString()}
        </p>
      </div>

      <div className="text-center">
        <TrendingUp className="w-8 h-8 mx-auto text-purple-600 mb-2" />
        <p className="text-sm font-semibold">Avg. Rating</p>
        <p className="text-xs text-gray-500">
          {(product.averageRating ?? 0).toFixed(1)}/5.0
        </p>
      </div>
    </div>
  );
};


export default Features;