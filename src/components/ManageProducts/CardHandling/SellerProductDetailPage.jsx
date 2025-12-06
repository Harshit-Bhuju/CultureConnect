import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from 'react-router-dom';
import {
  ShoppingCart,
  Share2,
  ChevronLeft,
  ChevronRight,
  Edit,
  TrendingUp,
  DollarSign,
  Package,
  ArrowLeft,
  AlertTriangle,
  Calendar,
  BarChart3,
  Eye, // Keep Eye icon, but remove view metrics
} from "lucide-react";
import { initialProducts } from '../../ManageProducts/Data/data';
import Loading from "../../Common/Loading";
import Rating from "../ProductDisplay/RatingForProduct";

const SellerProductDetailPage = () => {
    
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [activeTab, setActiveTab] = useState("description");

  // Load product data
  useEffect(() => {
    const loadProduct = () => {
      setLoading(true);
      // Simulate API call
      setTimeout(() => {
        const foundProduct = initialProducts.find(p => p.id === parseInt(id));
        if (foundProduct) {
          setProduct(foundProduct);
        }
        setLoading(false);
      }, 500);
    };

    loadProduct();
  }, [id]);

  const renderStars = (rating = 0) => {
    return <Rating rating={rating} reviews={0} />;
  };

  const nextImage = () => {
    if (!product?.images?.length) return;
    setSelectedImage((prev) => (prev + 1) % product.images.length);
  };

  const prevImage = () => {
    if (!product?.images?.length) return;
    setSelectedImage((prev) => (prev - 1 + product.images.length) % product.images.length);
  };

  const getCategoryDisplay = (category) => {
    const categories = {
      "cultural-clothes": "Cultural Clothes",
      "musical-instruments": "Musical Instruments",
      "handicraft-decors": "Handicraft & Decors"
    };
    return categories[category] || category;
  };

  const getAudienceDisplay = (audience) => {
    const audiences = {
      "men": "Men",
      "women": "Women",
      "boy": "Boys",
      "girl": "Girls"
    };
    return audiences[audience] || audience;
  };

  if (loading) {
    return  <Loading message="Loading..." />;
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Product Not Found</h2>
          <p className="text-gray-600 mb-6">The product you're looking for doesn't exist.</p>
          <button
            onClick={() => navigate('/manageproducts')}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
          >
            Back to Products
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Seller Action Bar */}
      <div className="bg-white border-b sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate(-1)}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition group"
              >
                <ArrowLeft className="w-5 h-5" />
                <span className="font-medium">Back to Products</span>
              </button>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                product.status === "Active" 
                  ? "bg-green-100 text-green-800" 
                  : "bg-gray-100 text-gray-800"
              }`}>
                {product.status}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <button 
                onClick={() => navigate(`/product/${product.id}`)}
                className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
              >
                <Eye className="w-4 h-4" />
                <span className="hidden sm:inline">Customer View</span>
              </button>
              <button 
                onClick={() => navigate(`/seller/products/edit/${product.id}`)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                <Edit className="w-4 h-4" />
                <span className="hidden sm:inline">Edit Product</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Analytics Cards */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-3 gap-4 mb-6"> {/* Changed grid-cols-4 to grid-cols-3 */}
          <div className="bg-white rounded-lg shadow-sm border p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Sales</p>
                <p className="text-2xl font-bold text-gray-900">{product.totalSales}</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-full">
                <TrendingUp className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>
          
          {/* REMOVED: Total Views Card (formerly the 2nd card) 
          <div className="bg-white rounded-lg shadow-sm border p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Views</p>
                <p className="text-2xl font-bold text-gray-900">{product.views}</p>
              </div>
              <div className="bg-purple-100 p-3 rounded-full">
                <Eye className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>
          */}
          
          <div className="bg-white rounded-lg shadow-sm border p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Stock Left</p>
                <p className="text-2xl font-bold text-gray-900">{product.stock}</p>
              </div>
              <div className="bg-green-100 p-3 rounded-full">
                <Package className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Revenue</p>
                <p className="text-2xl font-bold text-gray-900">Rs {(product.price * product.totalSales).toLocaleString()}</p>
              </div>
              <div className="bg-yellow-100 p-3 rounded-full">
                <DollarSign className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Images Section */}
          <div className="space-y-4">
            <div className="relative aspect-square bg-white rounded-lg overflow-hidden border shadow-sm">
              <img
                src={product.images?.[selectedImage]}
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
              <div className="flex gap-2">
                {product.images?.map((img, idx) => (
                  <button 
                    key={idx} 
                    onClick={() => setSelectedImage(idx)} 
                    className={`border-2 rounded-lg overflow-hidden w-20 h-20 transition ${
                      selectedImage === idx ? "border-blue-600 shadow-md" : "border-gray-300 hover:border-gray-400"
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
              <div className="flex items-center gap-2 mb-2">
                <span className="text-sm font-medium text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                  {getCategoryDisplay(product.category)}
                </span>
                {product.productType && (
                  <span className="text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
                    {product.productType}
                  </span>
                )}
              </div>
              <h1 className="text-3xl font-bold text-gray-900">{product.productName}</h1>
              {product.culture && (
                <p className="text-sm text-gray-600 mt-2">Culture: <span className="font-semibold">{product.culture}</span></p>
              )}
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center">{renderStars(product.rating)}</div>
              <span className="text-sm text-gray-600">
                {product.rating} ({product.totalReviews} reviews)
              </span>
            </div>

            <div className="flex items-baseline gap-3">
              <span className="text-4xl font-bold text-gray-900">Rs {product.price.toLocaleString()}</span>
            </div>

            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg ${
              product.stock > 20 ? "bg-green-50 text-green-700" :
              product.stock > 0 ? "bg-yellow-50 text-yellow-700" :
              "bg-red-50 text-red-700"
            }`}>
              <Package className="w-4 h-4" />
              <span className="font-semibold">
                {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
              </span>
            </div>

            {/* Sizes - Display Only */}
            {(product.adultSizes?.length > 0 || product.childAgeGroups?.length > 0) && (
              <div className="space-y-3">
                <div>
                  <label className="font-semibold text-gray-900 mb-2 block">
                    {product.audience ? `Available Sizes (${getAudienceDisplay(product.audience)}):` : "Available Sizes:"}
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {(product.adultSizes?.length > 0 ? product.adultSizes : product.childAgeGroups)?.map((size) => (
                      <span
                        key={size}
                        className="px-4 py-2 border-2 border-gray-300 bg-gray-50 rounded-lg font-medium text-gray-700"
                      >
                        {size}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Seller Action Buttons */}
            <div className="space-y-3 pt-4">
              <button 
                onClick={() => navigate(`/seller/products/edit/${product.id}`)}
                className="w-full bg-blue-600 text-white py-4 rounded-lg hover:bg-blue-700 transition flex justify-center items-center gap-2 shadow-md font-semibold text-lg"
              >
                <Edit className="w-5 h-5" /> Edit Product Details
              </button>
              
              <div className="grid grid-cols-2 gap-3">
                <button 
                  onClick={() => {
                    const newStatus = product.status === "Active" ? "Draft" : "Active";
                    // Update product status
                    console.log("Toggle status to:", newStatus);
                  }}
                  className={`py-3 rounded-lg transition flex justify-center items-center gap-2 font-semibold ${
                    product.status === "Active"
                      ? "bg-yellow-50 text-yellow-700 border-2 border-yellow-200 hover:bg-yellow-100"
                      : "bg-green-50 text-green-700 border-2 border-green-200 hover:bg-green-100"
                  }`}
                >
                  {product.status === "Active" ? "Draft" : "Publish"}
                </button>
                
                <button 
                  onClick={() => navigate(`/product/${product.id}`)}
                  className="border-2 border-gray-300 py-3 rounded-lg flex justify-center items-center gap-2 hover:bg-gray-50 transition font-semibold"
                >
                  <Eye className="w-5 h-5" /> Preview
                </button>
              </div>

              <button className="w-full border-2 border-gray-300 py-3 rounded-lg flex justify-center items-center gap-2 hover:bg-gray-50 transition font-medium">
                <Share2 className="w-5 h-5" /> Share Product Link
              </button>
            </div>

            {/* Tags */}
            {product.tags?.length > 0 && (
              <div className="pt-4 border-t">
                <p className="text-sm font-semibold text-gray-700 mb-2">Tags:</p>
                <div className="flex flex-wrap gap-2">
                  {product.tags.map((tag, idx) => (
                    <span key={idx} className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Seller Metrics - Changed grid-cols-3 to grid-cols-2 and removed Conversion */}
            <div className="grid grid-cols-2 gap-4 py-6 border-t mt-4">
              <div className="text-center">
                <Calendar className="w-8 h-8 mx-auto text-blue-600 mb-2" />
                <p className="text-sm font-semibold">Listed Date</p>
                <p className="text-xs text-gray-500">{product.listedDate || "Jan 15, 2024"}</p>
              </div>
              {/* REMOVED: Conversion Metric (formerly the 2nd column)
              <div className="text-center">
                <BarChart3 className="w-8 h-8 mx-auto text-green-600 mb-2" />
                <p className="text-sm font-semibold">Conversion</p>
                <p className="text-xs text-gray-500">{product.views > 0 ? ((product.totalSales / product.views) * 100).toFixed(1) : 0}%</p>
              </div>
              */}
              <div className="text-center">
                <TrendingUp className="w-8 h-8 mx-auto text-purple-600 mb-2" />
                <p className="text-sm font-semibold">Avg. Rating</p>
                <p className="text-xs text-gray-500">{product.rating}/5.0</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs Section */}
        <div className="mt-12 bg-white rounded-lg shadow-sm border overflow-hidden">
          <div className="flex gap-8 border-b px-6">
            {["description", "specifications", "care", "reviews", "performance"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-4 font-semibold capitalize border-b-2 transition ${
                  activeTab === tab 
                    ? "border-blue-600 text-blue-600" 
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
          
          <div className="p-6">
            {activeTab === "description" && (
              <div className="prose max-w-none">
                <p className="text-gray-700 leading-relaxed">{product.description}</p>
              </div>
            )}
            
            {activeTab === "specifications" && (
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
                <div className="border-b py-3">
                  <span className="font-semibold text-gray-900">Material:</span>
                  <span className="ml-2 text-gray-700">{product.material}</span>
                </div>
                <div className="border-b py-3">
                  <span className="font-semibold text-gray-900">Dimensions:</span>
                  <span className="ml-2 text-gray-700">{product.dimensions} cm</span>
                </div>
                {product.audience && (
                  <div className="border-b py-3">
                    <span className="font-semibold text-gray-900">For:</span>
                    <span className="ml-2 text-gray-700">{getAudienceDisplay(product.audience)}</span>
                  </div>
                )}
              </div>
            )}
            
            {activeTab === "care" && (
              <div className="prose max-w-none">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Care Instructions</h3>
                <p className="text-gray-700 leading-relaxed whitespace-pre-line">{product.careInstructions}</p>
              </div>
            )}
            
            {activeTab === "reviews" && (
              <div className="space-y-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-4xl font-bold">{product.rating}</span>
                      <div>
                        <div className="flex">{renderStars(product.rating)}</div>
                        <p className="text-sm text-gray-600">{product.totalReviews} reviews</p>
                      </div>
                    </div>
                  </div>
                </div>

                {product.reviews?.length > 0 ? (
                  product.reviews.map((review) => (
                    <div key={review.id} className="border-b pb-6 last:border-b-0">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <p className="font-semibold text-gray-900">{review.author}</p>
                          <p className="text-sm text-gray-500">{review.date}</p>
                        </div>
                        <div className="flex">{renderStars(review.rating)}</div>
                      </div>
                      <p className="text-gray-700">{review.comment}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 text-center py-8">No reviews yet.</p>
                )}
              </div>
            )}

            {activeTab === "performance" && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Metrics</h3>
                
                {/* Changed grid-cols-1 md:grid-cols-2 gap-6 to match the new 3 card layout in this tab */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6"> 
                  {/* REMOVED: Views Analytics Block (formerly the 1st card)
                  <div className="bg-blue-50 rounded-lg p-5 border border-blue-100">
                    <div className="flex items-center gap-3 mb-3">
                      <Eye className="w-6 h-6 text-blue-600" />
                      <h4 className="font-semibold text-gray-900">Views Analytics</h4>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Total Views:</span>
                        <span className="font-semibold">{product.views}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">This Month:</span>
                        <span className="font-semibold">{Math.floor(product.views * 0.3)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">This Week:</span>
                        <span className="font-semibold">{Math.floor(product.views * 0.1)}</span>
                      </div>
                    </div>
                  </div>
                  */}

                  {/* Sales Performance is now the 1st card in this section */}
                  <div className="bg-green-50 rounded-lg p-5 border border-green-100">
                    <div className="flex items-center gap-3 mb-3">
                      <ShoppingCart className="w-6 h-6 text-green-600" />
                      <h4 className="font-semibold text-gray-900">Sales Performance</h4>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Total Sales:</span>
                        <span className="font-semibold">{product.totalSales}</span>
                      </div>
                      {/* REMOVED: Conversion Rate 
                      <div className="flex justify-between">
                        <span className="text-gray-600">Conversion Rate:</span>
                        <span className="font-semibold">{((product.totalSales / product.views) * 100).toFixed(1)}%</span>
                      </div>
                      */}
                      <div className="flex justify-between">
                        <span className="text-gray-600">Total Revenue:</span>
                        <span className="font-semibold">Rs {(product.price * product.totalSales).toLocaleString()}</span>
                      </div>
                    </div>
                  </div>

                  {/* Inventory Status is now the 2nd card in this section */}
                  <div className="bg-yellow-50 rounded-lg p-5 border border-yellow-100">
                    <div className="flex items-center gap-3 mb-3">
                      <Package className="w-6 h-6 text-yellow-600" />
                      <h4 className="font-semibold text-gray-900">Inventory Status</h4>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Current Stock:</span>
                        <span className="font-semibold">{product.stock}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Stock Value:</span>
                        <span className="font-semibold">Rs {(product.price * product.stock).toLocaleString()}</span>
                      </div>
                      {product.stock <= 10 && (
                        <div className="flex items-center gap-2 text-red-600 mt-2">
                          <AlertTriangle className="w-4 h-4" />
                          <span className="text-sm font-medium">Low stock alert!</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Customer Feedback is now the 3rd card in this section */}
                  <div className="bg-purple-50 rounded-lg p-5 border border-purple-100">
                    <div className="flex items-center gap-3 mb-3">
                      <TrendingUp className="w-6 h-6 text-purple-600" />
                      <h4 className="font-semibold text-gray-900">Customer Feedback</h4>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Average Rating:</span>
                        <span className="font-semibold">{product.rating}/5.0</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Total Reviews:</span>
                        <span className="font-semibold">{product.totalReviews}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Satisfaction:</span>
                        <span className="font-semibold">{(product.rating / 5 * 100).toFixed(0)}%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SellerProductDetailPage;