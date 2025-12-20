// src/components/Specifications.jsx
import React from "react";

const Specifications = ({ product }) => {
  const getCategoryDisplay = (category) => {
    const categories = {
      "cultural-clothes": "Cultural Clothes",
      "musical-instruments": "Musical Instruments",
      "handicraft-decors": "Handicraft & Decors",
    };
    return categories[category] || category;
  };

  const getAudienceDisplay = (audience) => {
    const audiences = {
      men: "Men",
      women: "Women",
      boy: "Boys",
      girl: "Girls",
    };
    return audiences[audience] || audience;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="border-b py-3">
        <span className="font-semibold text-gray-900">Category:</span>
        <span className="ml-2 text-gray-700">{getCategoryDisplay(product.category)}</span>
      </div>
      <div className="border-b py-3">
        <span className="font-semibold text-gray-900">Product Type:</span>
        <span className="ml-2 text-gray-700">{product.productType}</span>
      </div>
      {product.culture && (
        <div className="border-b py-3">
          <span className="font-semibold text-gray-900">Culture:</span>
          <span className="ml-2 text-gray-700">{product.culture}</span>
        </div>
      )}
      {product.material && (
      <div className="border-b py-3">
        <span className="font-semibold text-gray-900">Material:</span>
        <span className="ml-2 text-gray-700">{product.material}</span>
      </div>)}
      {product.dimensions && (
      <div className="border-b py-3">
        <span className="font-semibold text-gray-900">Dimensions:</span>
        <span className="ml-2 text-gray-700">{product.dimensions}</span>
      </div>
      )}
      {product.audience && (
        <div className="border-b py-3">
          <span className="font-semibold text-gray-900">For:</span>
          <span className="ml-2 text-gray-700">{getAudienceDisplay(product.audience)}</span>
        </div>
      )}
    </div>
  );
};

export default Specifications;