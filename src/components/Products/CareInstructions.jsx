// src/components/CareInstructions.jsx
import React from "react";

const CareInstructions = ({ product }) => {
  return (
    
    <div className="prose max-w-none">
      <h3 className="text-lg font-semibold text-gray-900 mb-3">Care Instructions</h3>
      <p className="text-gray-700 leading-relaxed whitespace-pre-line">{product.careInstructions}</p>
    </div>
  );
};

export default CareInstructions;