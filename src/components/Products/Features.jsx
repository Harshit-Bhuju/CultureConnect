// src/components/Features.jsx
import React from "react";
import { Truck, RotateCcw, Shield } from "lucide-react";

const Features = () => {
  return (
    <div className="grid grid-cols-3 gap-4 py-6 border-t mt-4">
      <div className="text-center">
        <Truck className="w-8 h-8 mx-auto text-blue-600 mb-2" />
        <p className="text-sm font-semibold">Free Delivery</p>
        <p className="text-xs text-gray-500">3-5 Days</p>
      </div>
      <div className="text-center">
        <RotateCcw className="w-8 h-8 mx-auto text-green-600 mb-2" />
        <p className="text-sm font-semibold">7 Days Return</p>
        <p className="text-xs text-gray-500">Easy Returns</p>
      </div>
      <div className="text-center">
        <Shield className="w-8 h-8 mx-auto text-purple-600 mb-2" />
        <p className="text-sm font-semibold">1 Year Warranty</p>
        <p className="text-xs text-gray-500">Guaranteed</p>
      </div>
    </div>
  );
};

export default Features;