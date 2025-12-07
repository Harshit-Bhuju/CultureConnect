import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
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
  Plus,
  Minus,
  Package,
  MessageCircle,
} from "lucide-react";
import { initialProducts } from "../ManageProducts/Data/data";


const ProductDetailPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  
  // Try to import from external file, fallback to TEMP_PRODUCTS
  const [products, setProducts] = useState(initialProducts);
  const [product, setProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [activeTab, setActiveTab] = useState("description");
  const [imageZoom, setImageZoom] = useState(false);

  // Load external data if available
  useEffect(() => {
    const loadData = async () => {
      try {
        // Try to import the actual data file
        const { initialProducts } = await import("../ManageProducts/Data/data");
        console.log("✓ Successfully loaded initialProducts:", initialProducts);
        setProducts(initialProducts);
      } catch (error) {
        console.warn("⚠️ Could not load data file, using temporary data:", error);
        console.log("Make sure your data file is at: src/components/ManageProducts/Data/data.js");
      }
    };
    loadData();
  }, []);

  // Find product when data or ID changes
  useEffect(() => {
    console.log("Looking for product with ID:", id);
    console.log("Available products:", products);
    
    const foundProduct = products.find(p => p.id === parseInt(id));
    console.log("Found product:", foundProduct);
    
    if (foundProduct) {
      setProduct(foundProduct);
      setSelectedSize(foundProduct.adultSizes?.[0] || foundProduct.childAgeGroups?.[0] || "");
    }
  }, [id, products]);

  const renderStars = (rating = 0) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />);
    }
    if (hasHalfStar) {
      stars.push(<StarHalf key="half" className="w-5 h-5 fill-yellow-400 text-yellow-400" />);
    }
    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<Star key={`empty-${i}`} className="w-5 h-5 text-gray-300" />);
    }
    return stars;
  };

  const nextImage = () => {
    if (!product?.images?.length) return;
    setSelectedImage((prev) => (prev + 1) % product.images.length);
  };

  const prevImage = () => {
    if (!product?.images?.length) return;
    setSelectedImage((prev) => (prev - 1 + product.images.length) % product.images.length);
  };

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied to clipboard!');
    } catch (err) {
      toast.error('Failed to copy link');
    }
  };

  const handleAddToCart = () => {
    toast.success(`Added ${quantity} item(s) to cart!`, {
      icon: '🛒',
      duration: 3000,
    });
  };

  const handleBuyNow = () => {
    toast.success('Redirecting to checkout...', {
      icon: '⚡',
      duration: 2000,
    });
  };

  const handleWishlist = () => {
    setIsWishlisted(!isWishlisted);
    toast.success(isWishlisted ? 'Removed from wishlist' : 'Added to wishlist!', {
      icon: isWishlisted ? '💔' : '❤️',
    });
  };

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center p-8 bg-white rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Product not found</h2>
          <p className="text-gray-600 mb-4">Product ID: {id}</p>
        </div>
      </div>
    );
  }

  const priceValue = product.price;
  const stockCount = product.stock;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Breadcrumb */}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Images Section */}
          <div className="space-y-4">
            <div className="relative aspect-square bg-white rounded-2xl overflow-hidden border-2 border-gray-200 shadow-xl group">
              <img
                src={product.images?.[selectedImage]}
                alt={product.productName}
                className={`w-full h-full object-cover transition-transform duration-500 ${imageZoom ? 'scale-110' : 'scale-100'}`}
                onMouseEnter={() => setImageZoom(true)}
                onMouseLeave={() => setImageZoom(false)}
              />
              
              {product.images?.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/95 p-3 rounded-full shadow-lg hover:bg-white hover:scale-110 transition-all"
                  >
                    <ChevronLeft className="w-6 h-6 text-gray-800" />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/95 p-3 rounded-full shadow-lg hover:bg-white hover:scale-110 transition-all"
                  >
                    <ChevronRight className="w-6 h-6 text-gray-800" />
                  </button>
                </>
              )}

              <button
                onClick={handleWishlist}
                className="absolute top-4 right-4 bg-white/95 p-3 rounded-full shadow-lg hover:scale-110 transition-all backdrop-blur-sm"
              >
                <Heart className={`w-6 h-6 transition-colors ${isWishlisted ? "fill-red-500 text-red-500" : "text-gray-600"}`} />
              </button>

              <div className="absolute bottom-4 right-4 bg-black/60 text-white px-3 py-1 rounded-full text-sm backdrop-blur-sm">
                {selectedImage + 1} / {product.images?.length}
              </div>
            </div>

            {product.images?.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2">
                {product.images?.map((img, idx) => (
                  <button 
                    key={idx} 
                    onClick={() => setSelectedImage(idx)} 
                    className={`flex-shrink-0 border-2 rounded-xl overflow-hidden w-24 h-24 transition-all ${
                      selectedImage === idx 
                        ? "border-orange-500 shadow-lg scale-105" 
                        : "border-gray-300 hover:border-gray-400 opacity-70 hover:opacity-100"
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info Section */}
          <div className="space-y-6">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-3">{product.productName}</h1>
              <div className="flex items-center gap-4 flex-wrap">
                <div className="flex items-center gap-2 bg-yellow-50 px-4 py-2 rounded-lg">
                  <div className="flex items-center">{renderStars(product.rating)}</div>
                  <span className="font-semibold text-gray-900">{product.rating || 0}</span>
                </div>
                <span className="text-gray-600">
                  <MessageCircle className="w-4 h-4 inline mr-1" />
                  {product.totalReviews || 0} reviews
                </span>
              </div>
            </div>

            <div className="bg-gradient-to-r from-orange-50 to-yellow-50 p-6 rounded-2xl border border-orange-200">
              <div className="flex items-baseline gap-4 flex-wrap">
                <span className="text-5xl font-bold text-orange-600">Rs {priceValue.toLocaleString()}</span>
              </div>
              <p className="text-sm text-gray-600 mt-2">Inclusive of all taxes</p>
            </div>

            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg font-medium ${
              stockCount > 20 ? "bg-green-100 text-green-700" : 
              stockCount > 0 ? "bg-yellow-100 text-yellow-700" : 
              "bg-red-100 text-red-700"
            }`}>
              <Package className="w-5 h-5" />
              {stockCount > 20 ? "In Stock" : stockCount > 0 ? `Only ${stockCount} left!` : "Out of Stock"}
            </div>

            {(product.adultSizes?.length > 0 || product.childAgeGroups?.length > 0) && (
              <div className="space-y-3">
                <label className="font-semibold text-gray-900 text-lg">
                  Size: <span className="text-orange-600">{selectedSize}</span>
                </label>
                <div className="flex gap-3 flex-wrap">
                  {product.adultSizes?.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`px-5 py-3 border-2 rounded-xl font-medium transition-all ${
                        selectedSize === size 
                          ? "border-orange-500 bg-orange-50 text-orange-700 shadow-md scale-105" 
                          : "border-gray-300 hover:border-gray-400 text-gray-700"
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                  {product.childAgeGroups?.map((age) => (
                    <button
                      key={age}
                      onClick={() => setSelectedSize(age)}
                      className={`px-5 py-3 border-2 rounded-xl font-medium transition-all ${
                        selectedSize === age 
                          ? "border-orange-500 bg-orange-50 text-orange-700 shadow-md scale-105" 
                          : "border-gray-300 hover:border-gray-400 text-gray-700"
                      }`}
                    >
                      {age} years
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="space-y-3">
              <label className="font-semibold text-gray-900 text-lg">Quantity</label>
              <div className="flex items-center gap-4">
                <div className="flex items-center border-2 border-gray-300 rounded-xl overflow-hidden">
                  <button 
                    onClick={() => setQuantity(Math.max(1, quantity - 1))} 
                    className="px-5 py-3 hover:bg-gray-100 transition"
                  >
                    <Minus className="w-5 h-5" />
                  </button>
                  <span className="px-8 py-3 font-bold text-lg border-x-2">{quantity}</span>
                  <button 
                    onClick={() => setQuantity(Math.min(stockCount, quantity + 1))} 
                    className="px-5 py-3 hover:bg-gray-100 transition"
                    disabled={stockCount === 0}
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </div>
                <span className="text-gray-600">
                  Total: <span className="font-bold text-gray-900">
                    Rs {(priceValue * quantity).toLocaleString()}
                  </span>
                </span>
              </div>
            </div>

            <div className="space-y-3 pt-4">
              <button 
                onClick={handleAddToCart}
                disabled={stockCount === 0}
                className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white py-4 rounded-xl flex justify-center items-center gap-3 hover:from-orange-600 hover:to-orange-700 transition-all shadow-lg hover:shadow-xl font-bold text-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ShoppingCart className="w-6 h-6" /> Add to Cart
              </button>
              <button 
                onClick={handleBuyNow}
                disabled={stockCount === 0}
                className="w-full bg-gradient-to-r from-yellow-400 to-yellow-500 text-gray-900 py-4 rounded-xl hover:from-yellow-500 hover:to-yellow-600 transition-all shadow-lg hover:shadow-xl font-bold text-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Buy Now
              </button>
              <button 
                onClick={handleShare}
                className="w-full border-2 border-gray-300 py-4 rounded-xl flex justify-center items-center gap-3 hover:bg-gray-50 transition-all font-medium"
              >
                <Share2 className="w-5 h-5" /> Share
              </button>
            </div>

            <div className="grid grid-cols-3 gap-4 pt-6">
              <div className="bg-white p-4 rounded-xl shadow-md text-center hover:shadow-lg transition-shadow border border-gray-100">
                <Truck className="w-8 h-8 mx-auto text-blue-600 mb-2" />
                <p className="text-sm font-bold text-gray-900">Free Delivery</p>
                <p className="text-xs text-gray-500 mt-1">3-5 Days</p>
              </div>
              <div className="bg-white p-4 rounded-xl shadow-md text-center hover:shadow-lg transition-shadow border border-gray-100">
                <RotateCcw className="w-8 h-8 mx-auto text-green-600 mb-2" />
                <p className="text-sm font-bold text-gray-900">7 Days Return</p>
                <p className="text-xs text-gray-500 mt-1">Easy Returns</p>
              </div>
              <div className="bg-white p-4 rounded-xl shadow-md text-center hover:shadow-lg transition-shadow border border-gray-100">
                <Shield className="w-8 h-8 mx-auto text-purple-600 mb-2" />
                <p className="text-sm font-bold text-gray-900">1 Year Warranty</p>
                <p className="text-xs text-gray-500 mt-1">Guaranteed</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs Section */}
        <div className="mt-16 bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
          <div className="flex gap-1 border-b bg-gray-50 p-2">
            {["description", "specifications", "reviews"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 py-4 px-6 font-bold capitalize rounded-xl transition-all ${
                  activeTab === tab 
                    ? "bg-white text-orange-600 shadow-md" 
                    : "text-gray-600 hover:text-gray-900 hover:bg-white/50"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
          
          <div className="p-8">
            {activeTab === "description" && (
              <div className="prose max-w-none">
                <p className="text-gray-700 text-lg leading-relaxed">{product.description}</p>
              </div>
            )}
            
            {activeTab === "specifications" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
                  <Check className="w-5 h-5 text-green-600 mt-1 flex-shrink-0" />
                  <div>
                    <span className="font-bold text-gray-900 block">Material</span>
                    <span className="text-gray-700">{product.material}</span>
                  </div>
                </div>
                <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
                  <Check className="w-5 h-5 text-green-600 mt-1 flex-shrink-0" />
                  <div>
                    <span className="font-bold text-gray-900 block">Dimensions</span>
                    <span className="text-gray-700">{product.dimensions} cm</span>
                  </div>
                </div>
                <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
                  <Check className="w-5 h-5 text-green-600 mt-1 flex-shrink-0" />
                  <div>
                    <span className="font-bold text-gray-900 block">Culture</span>
                    <span className="text-gray-700">{product.culture}</span>
                  </div>
                </div>
                <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
                  <Check className="w-5 h-5 text-green-600 mt-1 flex-shrink-0" />
                  <div>
                    <span className="font-bold text-gray-900 block">Care Instructions</span>
                    <span className="text-gray-700">{product.careInstructions}</span>
                  </div>
                </div>
              </div>
            )}
            
            {activeTab === "reviews" && (
              <div>
                {product.reviews && product.reviews.length > 0 ? (
                  <div className="space-y-6">
                    {product.reviews.map((review) => (
                      <div key={review.id} className="border-b pb-6 last:border-b-0">
                        <div className="flex items-center gap-4 mb-3">
                          <div className="flex items-center">
                            {renderStars(review.rating)}
                          </div>
                          <span className="font-bold text-gray-900">{review.author}</span>
                          <span className="text-sm text-gray-500">{review.date}</span>
                        </div>
                        <p className="text-gray-700">{review.comment}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <MessageCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500 text-lg">No reviews yet. Be the first to review!</p>
                    <button className="mt-4 bg-orange-600 text-white px-8 py-3 rounded-xl hover:bg-orange-700 transition font-bold">
                      Write a Review
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;