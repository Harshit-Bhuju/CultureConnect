import React, { useState } from "react";
import {
  Star,
  StarHalf,
  ShoppingCart,
  Heart,
  Share2,
  Truck,
  Shield,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  Check,
} from "lucide-react";
import { productsDetailData } from "./ProductsDetailData";

const ProductDetailPage = () => {
  const [product] = useState(productsDetailData?.[0] || {});
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedColor, setSelectedColor] = useState(product?.colors?.[0] || "");
  const [selectedSize, setSelectedSize] = useState(product?.sizes?.[0] || "");
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [activeTab, setActiveTab] = useState("description");

  const renderStars = (rating = 0) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />);
    }
    if (hasHalfStar) {
      stars.push(<StarHalf key="half" className="w-4 h-4 fill-yellow-400 text-yellow-400" />);
    }
    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<Star key={`empty-${i}`} className="w-4 h-4 text-gray-300" />);
    }
    return stars;
  };

  const nextImage = () => {
    if (!product.images?.length) return;
    setSelectedImage((prev) => (prev + 1) % product.images.length);
  };

  const prevImage = () => {
    if (!product.images?.length) return;
    setSelectedImage((prev) => (prev - 1 + product.images.length) % product.images.length);
  };

  if (!product?.id) {
    return <div className="min-h-screen flex items-center justify-center">Product not found.</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Images */}
        <div className="space-y-4">
          <div className="relative aspect-square bg-white rounded-lg overflow-hidden border">
            <img
              src={product.images?.[selectedImage]}
              alt={product.title}
              className="w-full h-full object-cover"
            />
            {product.images?.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/90 p-2 rounded-full shadow hover:bg-white"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/90 p-2 rounded-full shadow hover:bg-white"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </>
            )}
            <button
              onClick={() => setIsWishlisted(!isWishlisted)}
              className="absolute top-2 right-2 bg-white p-2 rounded-full shadow hover:scale-110 transition"
            >
              <Heart className={`w-6 h-6 ${isWishlisted ? "fill-red-500 text-red-500" : "text-gray-600"}`} />
            </button>
          </div>

          {/* Thumbnails */}
          <div className="flex gap-2">
            {product.images?.map((img, idx) => (
              <button key={idx} onClick={() => setSelectedImage(idx)} className={`border rounded-lg overflow-hidden w-20 h-20 ${selectedImage === idx ? "border-black" : "border-gray-300"}`}>
                <img src={img} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div className="space-y-4">
          <h1 className="text-3xl font-bold">{product.title}</h1>
          <div className="flex items-center gap-2">
            <div className="flex items-center">{renderStars(product.rating)}</div>
            <span className="text-sm text-gray-600">({product.reviews} reviews)</span>
          </div>
          <div className="flex items-baseline gap-3">
            <span className="text-4xl font-bold">{product.price}</span>
            {product.originalPrice && <span className="text-gray-400 line-through">{product.originalPrice}</span>}
          </div>
          <p className="text-sm text-green-600 font-medium">Stock: {product.stockCount}</p>

          {/* Color & Size */}
          <div className="space-y-3">
            <div>
              <label className="font-semibold">Color:</label>
              <div className="flex gap-2 mt-1">
                {product.colors?.map((color) => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`px-3 py-1 border rounded-lg ${selectedColor === color ? "border-black bg-gray-100" : "border-gray-300"}`}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="font-semibold">Size:</label>
              <div className="flex gap-2 mt-1">
                {product.sizes?.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`px-3 py-1 border rounded-lg ${selectedSize === size ? "border-black bg-gray-100" : "border-gray-300"}`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity */}
            <div>
              <label className="font-semibold">Quantity:</label>
              <div className="flex items-center gap-2 mt-1">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="border px-3 py-1">−</button>
                <span>{quantity}</span>
                <button onClick={() => setQuantity(Math.min(product.stockCount, quantity + 1))} className="border px-3 py-1">+</button>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-2">
            <button className="w-full bg-orange-500 text-white py-3 rounded-lg flex justify-center items-center gap-2 hover:bg-orange-600">
              <ShoppingCart className="w-5 h-5" /> Add to Cart
            </button>
            <button className="w-full bg-yellow-400 text-gray-900 py-3 rounded-lg hover:bg-yellow-500 flex justify-center items-center gap-2">
              Buy Now
            </button>
            <button className="w-full border border-gray-300 py-3 rounded-lg flex justify-center items-center gap-2 hover:bg-gray-50">
              <Share2 className="w-5 h-5" /> Share
            </button>
          </div>

          {/* Delivery Info */}
          <div className="grid grid-cols-3 gap-4 py-6 border-t mt-4">
            <div className="text-center">
              <Truck className="w-6 h-6 mx-auto text-blue-600" />
              <p className="text-sm font-medium">{product.delivery}</p>
              <p className="text-xs text-gray-500">{product.deliveryTime}</p>
            </div>
            <div className="text-center">
              <RotateCcw className="w-6 h-6 mx-auto text-green-600" />
              <p className="text-sm font-medium">{product.returns}</p>
            </div>
            <div className="text-center">
              <Shield className="w-6 h-6 mx-auto text-purple-600" />
              <p className="text-sm font-medium">{product.warranty}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 bg-white rounded-lg shadow">
        <div className="flex gap-8 border-b">
          {["description", "specifications", "reviews"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`py-3 font-semibold capitalize border-b-2 transition ${
                activeTab === tab ? "border-black text-black" : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
        <div className="p-4">
          {activeTab === "description" && <p>{product.description}</p>}
          {activeTab === "specifications" && (
            <div className="grid grid-cols-2 gap-4">
              {Object.entries(product.specifications || {}).map(([key, value]) => (
                <div key={key} className="border-b py-2">
                  <span className="font-semibold">{key}:</span> {value}
                </div>
              ))}
            </div>
          )}
          {activeTab === "reviews" && <p>No reviews yet.</p>}
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
