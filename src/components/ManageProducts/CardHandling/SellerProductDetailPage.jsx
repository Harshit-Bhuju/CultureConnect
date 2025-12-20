import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import toast from 'react-hot-toast';
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
  Star,
  Tag,
  Ruler,
  Scissors,
  Heart,
} from "lucide-react";
import Loading from "../../Common/Loading";
import Rating from "../../Products/RatingForProduct";
import PublishProductModal from "../modals/PublishProductModal";
import DraftProductModal from "../modals/DraftProductModal";
import SellerReviewsView from "./SellerReply/SellerReviewsView";
import API, { BASE_URL } from "../../../Configs/ApiEndpoints";

const SellerProductDetailPage = () => {
  const { sellerId, id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [activeTab, setActiveTab] = useState("description");
  const [showPublishModal, setShowPublishModal] = useState(false);
  const [showDraftModal, setShowDraftModal] = useState(false);

  const tabs = [
    "description",
    "specifications",
    ...(product?.careInstructions ? ["care"] : []),
    "reviews",
    "performance"
  ];

  // Use useCallback to prevent recreation on every render
  const fetchProductDetails = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`${API.GET_PRODUCT_DETAILS}?product_id=${id}`, {
        method: 'GET',
        credentials: 'include',
      });

      const data = await response.json();

      if (data.success) {
        setProduct(data.product);
      } else {
        setError(data.error || 'Failed to fetch product details');
      }
    } catch (err) {
      console.error('Error fetching product:', err);
      setError('Network error while fetching product');
    } finally {
      setLoading(false);
    }
  }, [id]); // Only depends on id

  useEffect(() => {
    if (user?.seller_id && user.seller_id !== parseInt(sellerId)) {
      toast.error('Unauthorized access');
      navigate(`/seller/${user.seller_id}/products`);
      return;
    }

    if (!user?.seller_id) {
      toast.error('No seller account found');
      navigate('/seller-registration');
      return;
    }

    fetchProductDetails();
  }, [id, sellerId, user, navigate, fetchProductDetails]);

  // Use useCallback for handlers
  const handleSubmitReply = useCallback(async (reviewId, replyText, replyId = null) => {
    try {
      const formData = new URLSearchParams();
      formData.append('review_id', reviewId);
      formData.append('reply_text', replyText);
      if (replyId) {
        formData.append('reply_id', replyId);
      }

      const response = await fetch(API.SELLER_REPLY_REVIEW, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formData.toString(),
      });

      const data = await response.json();

      if (data.success) {
        toast.success(replyId ? 'Reply updated successfully!' : 'Reply submitted successfully!', {
          duration: 3000,
          position: 'top-center',
          icon: '✅',
        });
        // Refresh product details to get updated reviews
        await fetchProductDetails();
      } else {
        toast.error(data.error || 'Failed to submit reply');
      }
    } catch (err) {
      console.error('Error submitting reply:', err);
      toast.error('Network error while submitting reply');
    }
  }, [fetchProductDetails]);

  const handleDeleteReply = useCallback(async (replyId) => {
    try {
      const formData = new URLSearchParams();
      formData.append('reply_id', replyId);
      const response = await fetch(API.SELLER_DELETE_REPLY, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formData.toString(),
      });

      const data = await response.json();

      if (data.success) {
        toast.success('Reply deleted successfully!', {
          duration: 3000,
          position: 'top-center',
          icon: '🗑️',
        });
        // Refresh product details to get updated reviews
        await fetchProductDetails();
      } else {
        toast.error(data.error || 'Failed to delete reply');
      }
    } catch (err) {
      console.error('Error deleting reply:', err);
      toast.error('Network error while deleting reply');
    }
  }, [fetchProductDetails]);

  const handlePublish = async () => {
    try {
      const formData = new URLSearchParams();
      formData.append('product_id', product.id);
      formData.append('status', 'published');

      const response = await fetch(API.UPDATE_PRODUCT_STATUS, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formData.toString(),
      });

      const data = await response.json();

      if (data.success) {
        setProduct({ ...product, status: 'Active' });
        setShowPublishModal(false);
        toast.success('Product published successfully!', {
          duration: 3000,
          position: 'top-center',
          icon: '✅',
        });
      } else {
        toast.error(data.error || 'Failed to publish product');
      }
    } catch (err) {
      console.error('Error publishing product:', err);
      toast.error('Network error while publishing product');
    }
  };

  const handleDraft = async () => {
    try {
      const formData = new URLSearchParams();
      formData.append('product_id', product.id);
      formData.append('status', 'draft');

      const response = await fetch(API.UPDATE_PRODUCT_STATUS, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formData.toString(),
      });

      const data = await response.json();

      if (data.success) {
        setProduct({ ...product, status: 'Draft' });
        setShowDraftModal(false);
        toast.success('Product moved to drafts!', {
          duration: 3000,
          position: 'top-center',
          icon: '📝',
        });
      } else {
        toast.error(data.error || 'Failed to move product to drafts');
      }
    } catch (err) {
      console.error('Error moving product to draft:', err);
      toast.error('Network error while updating product');
    }
  };

  const handleShareProduct = () => {
    const productUrl = `${window.location.origin}/seller/products/${user?.seller_id}/${product.id}`;

    navigator.clipboard.writeText(productUrl).then(() => {
      toast.success('Product link copied to clipboard!', {
        duration: 3000,
        position: 'top-center',
        icon: '🔗',
      });
    }).catch(() => {
      toast.error('Failed to copy link', {
        duration: 3000,
        position: 'top-center',
      });
    });
  };

  const renderStars = (rating = 0) => {
    return <Rating rating={rating} reviews={product?.totalReviews || 0} />;
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
    return <Loading message="Loading product details..." />;
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {error ? 'Error Loading Product' : 'Product Not Found'}
          </h2>
          <p className="text-gray-600 mb-6">
            {error || "The product you're looking for doesn't exist."}
          </p>
          <button
            onClick={() => navigate(-1)}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
          >
            Back to Products
          </button>
        </div>
      </div>
    );
  }

  const totalSales = product.totalSales || 0;
  const totalRevenue = product.revenue || 0;

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
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${product.status === "Active"
                ? "bg-green-100 text-green-800"
                : "bg-gray-100 text-gray-800"
                }`}>
                {product.status}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate(`/seller/products/edit/${user?.seller_id}/${product.id}`)}
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
        <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow-sm border p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Sales</p>
                <p className="text-2xl font-bold text-gray-900">{totalSales}</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-full">
                <TrendingUp className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

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
                <p className="text-2xl font-bold text-gray-900">
                  Rs {totalRevenue.toLocaleString()}
                </p>
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
                    className={`border-2 rounded-lg overflow-hidden w-20 h-20 flex-shrink-0 transition ${selectedImage === idx ? "border-blue-600 shadow-md" : "border-gray-300 hover:border-gray-400"
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
                <p className="text-sm text-gray-600 mt-2">
                  Culture: <span className="font-semibold">{product.culture}</span>
                </p>
              )}
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center">{renderStars(product.averageRating)}</div>
              <span className="text-sm text-gray-600">
                {product.averageRating.toFixed(1)} ({product.totalReviews} reviews)
              </span>
            </div>

            <div className="flex items-baseline gap-3">
              <span className="text-4xl font-bold text-gray-900">
                Rs {product.price.toLocaleString()}
              </span>
            </div>

            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg ${product.stock > 20 ? "bg-green-50 text-green-700" :
              product.stock > 0 ? "bg-yellow-50 text-yellow-700" :
                "bg-red-50 text-red-700"
              }`}>
              <Package className="w-4 h-4" />
              <span className="font-semibold">
                {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
              </span>
            </div>

            {/* Sizes - Display Only */}
            {(product.sizes?.length > 0 || product.ageGroups?.length > 0) && (
              <div className="space-y-3">
                <div>
                  <label className="font-semibold text-gray-900 mb-2 block">
                    {product.audience ? `Available Sizes (${getAudienceDisplay(product.audience)}):` : "Available Sizes:"}
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {(product.sizes?.length > 0 ? product.sizes : product.ageGroups)?.map((size) => (
                      <span
                        key={size}
                        className={`px-4 py-2 border-2 rounded-lg font-medium transition ${size
                          ? "border-blue-600 bg-blue-50 text-blue-700"
                          : "border-gray-300 hover:border-gray-400 text-gray-700"
                          }`}
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
                onClick={() => navigate(`/seller/products/edit/${user?.seller_id}/${product.id}`)}
                className="w-full bg-blue-600 text-white py-4 rounded-lg hover:bg-blue-700 transition flex justify-center items-center gap-2 shadow-md font-semibold text-lg"
              >
                <Edit className="w-5 h-5" /> Edit Product Details
              </button>

              <div className="grid grid-cols-2 gap-3 mt-6">
                <button
                  onClick={() => {
                    if (product.status === "Active") {
                      setShowDraftModal(true);
                    } else {
                      setShowPublishModal(true);
                    }
                  }}
                  className={`py-3 rounded-lg transition flex justify-center items-center gap-2 font-semibold ${product.status === "Active"
                    ? "bg-yellow-50 text-yellow-700 border-2 border-yellow-200 hover:bg-yellow-100"
                    : "bg-green-50 text-green-700 border-2 border-green-200 hover:bg-green-100"
                    }`}
                >
                  {product.status === "Active" ? "Move to Draft" : "Publish"}
                </button>

                <button
                  onClick={handleShareProduct}
                  className="border-2 border-gray-300 py-3 rounded-lg flex justify-center items-center gap-2 hover:bg-gray-50 transition font-medium"
                >
                  <Share2 className="w-5 h-5" /> Share
                </button>
              </div>
            </div>

            {/* Seller Metrics */}
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
                  {product.averageRating.toFixed(1)}/5.0
                </p>
              </div>
            </div>
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
          </div>
        </div>

        {/* Tabs Section */}
        <div className="mt-12 bg-white rounded-lg shadow-sm border overflow-hidden">
          <div className="flex gap-8 border-b px-6 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-4 font-semibold capitalize border-b-2 transition whitespace-nowrap ${activeTab === tab
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
                {product.material && (
                  <div className="border-b py-3">
                    <span className="font-semibold text-gray-900">Material:</span>
                    <span className="ml-2 text-gray-700">{product.material}</span>
                  </div>
                )}
                {product.dimensions && (
                  <div className="border-b py-3">
                    <span className="font-semibold text-gray-900">Dimensions:</span>
                    <span className="ml-2 text-gray-700">{product.dimensions} cm</span>
                  </div>
                )}
                {product.audience && (
                  <div className="border-b py-3">
                    <span className="font-semibold text-gray-900">For:</span>
                    <span className="ml-2 text-gray-700">{getAudienceDisplay(product.audience)}</span>
                  </div>
                )}
              </div>
            )}

            {activeTab === "care" && (
              <div className="prose max-w-none break-words">
                <p className="text-gray-700 leading-relaxed">{product.careInstructions}</p>
              </div>
            )}

            {activeTab === "reviews" && (
              <SellerReviewsView
                product={product}
                onSubmitReply={handleSubmitReply}
                onDeleteReply={handleDeleteReply}
                onRefresh={fetchProductDetails}
                sellerId={sellerId}
              />
            )}
             {activeTab === "performance" && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Metrics</h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-green-50 rounded-lg p-5 border border-green-100">
                    <div className="flex items-center gap-3 mb-3">
                      <ShoppingCart className="w-6 h-6 text-green-600" />
                      <h4 className="font-semibold text-gray-900">Sales Performance</h4>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Total Sales:</span>
                        <span className="font-semibold">{totalSales}</span>
                      </div>
                      <div className="flex justify-between border-t pt-2 mt-2">
                        <span className="text-gray-600">Total Revenue:</span>
                        <span className="font-semibold">Rs {totalRevenue.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>

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
                        <span className="font-semibold">
                          Rs {(product.price * product.stock).toLocaleString()}
                        </span>
                      </div>
                      {product.stock <= 10 && (
                        <div className="flex items-center gap-2 text-red-600 mt-2">
                          <AlertTriangle className="w-4 h-4" />
                          <span className="text-sm font-medium">Low stock alert!</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="bg-purple-50 rounded-lg p-5 border border-purple-100">
                    <div className="flex items-center gap-3 mb-3">
                      <TrendingUp className="w-6 h-6 text-purple-600" />
                      <h4 className="font-semibold text-gray-900">Customer Feedback</h4>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Average Rating:</span>
                        <span className="font-semibold">
                          {product.averageRating.toFixed(1)}/5.0
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Total Reviews:</span>
                        <span className="font-semibold">{product.totalReviews}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Satisfaction:</span>
                        <span className="font-semibold">
                          {((product.averageRating / 5) * 100).toFixed(0)}%
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modals */}
      {showPublishModal && (
        <PublishProductModal
          product={product}
          onClose={() => setShowPublishModal(false)}
          onPublish={handlePublish}
        />
      )}

      {showDraftModal && (
        <DraftProductModal
          product={product}
          onClose={() => setShowDraftModal(false)}
          onDraft={handleDraft}
        />
      )}
    </div>
  );
};

export default SellerProductDetailPage;