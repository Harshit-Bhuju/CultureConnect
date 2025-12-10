// src/components/Description.jsx
import React from "react";

const Description = ({ product }) => {
  return (
    <div className="prose max-w-none">
      <p className="text-gray-700 leading-relaxed">{product.description}</p>
    </div>
  );
};

export default Description;