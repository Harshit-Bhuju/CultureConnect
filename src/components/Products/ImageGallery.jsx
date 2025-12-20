// src/components/ImageGallery.jsx
import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { BASE_URL } from '../../Configs/ApiEndpoints';

const ImageGallery = ({ product, selectedImage, setSelectedImage }) => {
  const nextImage = () => {
    if (!product?.images?.length) return;
    setSelectedImage((prev) => (prev + 1) % product.images.length);
  };

  const prevImage = () => {
    if (!product?.images?.length) return;
    setSelectedImage((prev) => (prev - 1 + product.images.length) % product.images.length);
  };

  return (
    <div className="space-y-4">
      <div className="relative aspect-square bg-white rounded-lg overflow-hidden border shadow-sm">
        <img
          src={`${BASE_URL}/product_images/${product.images?.[selectedImage]}`}
          alt={product.productName}
          className="w-full h-full object-cover"
        />
        {product.images?.length > 1 && (
          <>
            <button
              onClick={prevImage}
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/90 p-2 rounded-full shadow hover:bg-white transition"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={nextImage}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/90 p-2 rounded-full shadow hover:bg-white transition"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </>
        )}
      </div>
      
      {/* Thumbnails */}
      {product.images?.length > 1 && (
        <div className="flex gap-2 overflow-x-auto">
          {product.images?.map((img, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedImage(idx)}
              className={`border-2 rounded-lg overflow-hidden w-20 h-20 flex-shrink-0 transition ${
                selectedImage === idx ? "border-blue-600 shadow-md" : "border-gray-300 hover:border-gray-400"
              }`}
            >
              <img 
                src={`${BASE_URL}/product_images/${img}`} 
                alt={`Thumbnail ${idx + 1}`} 
                className="w-full h-full object-cover" 
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ImageGallery;