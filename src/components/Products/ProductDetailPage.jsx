// src/components/ProductDetailPage.jsx
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { initialProducts } from "../ManageProducts/Data/data";
import toast from "react-hot-toast";
import ImageGallery from "./ImageGallery";
import ProductInfo from "./ProductInfo";
import Features from "./Features";
import Tabs from "./Tabs";
import ReviewFormModal from "./ReviewFormModal";
import DeleteReviewModal from "./DeleteReviewModal";
import { ArrowLeft, Heart, Package, Share2 } from "lucide-react";

const CURRENT_USER_ID = "user_123"; // In real app: get from auth context
const CURRENT_USER_NAME = "Current User";

const ProductDetailPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [products, setProducts] = useState(initialProducts);
  const [product, setProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [activeTab, setActiveTab] = useState("description");

  // Review form states
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewTitle, setReviewTitle] = useState(""); // New: Added title
  const [reviewText, setReviewText] = useState("");
  const [editingReviewId, setEditingReviewId] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Delete modal states
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletingReviewId, setDeletingReviewId] = useState(null);

  useEffect(() => {
    const foundProduct = products.find((p) => p.id === parseInt(id));
    if (foundProduct) {
      setProduct(foundProduct);
      setSelectedSize(foundProduct.adultSizes?.[0] || foundProduct.childAgeGroups?.[0] || "");
    }
  }, [id, products]);

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      toast.success("Link copied to clipboard!");
    } catch (err) {
      toast.error("Failed to copy link");
    }
  };

  const handleAddToCart = () => {
    toast.success(`Added ${quantity} item(s) to cart!`);
  };

  const handleBuyNow = () => {
    toast.info("Redirecting to checkout...");
  };

  const handleWishlist = () => {
    setIsWishlisted(!isWishlisted);
    toast.success(isWishlisted ? "Removed from wishlist" : "Added to wishlist!", {
      icon: isWishlisted ? "💔" : "❤️",
    });
  };

  const openReviewForm = (review = null) => {
    if (review) {
      setEditingReviewId(review.id);
      setReviewRating(review.rating);
      setReviewTitle(review.title || ""); // New: Handle title
      setReviewText(review.comment);
    } else {
      setEditingReviewId(null);
      setReviewRating(0);
      setReviewTitle("");
      setReviewText("");
    }
    setShowReviewForm(true);
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();

    if (reviewRating === 0) {
      toast.error("Please select a rating");
      return;
    }

    if (reviewTitle.trim().length < 3) {
      toast.error("Title must be at least 3 characters long");
      return;
    }

    if (reviewText.trim().length < 10) {
      toast.error("Review must be at least 10 characters long");
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      const reviewData = {
        id: editingReviewId || Date.now(),
        userId: CURRENT_USER_ID,
        author: CURRENT_USER_NAME,
        date: new Date().toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        }),
        rating: reviewRating,
        title: reviewTitle.trim(), // New: Added title
        comment: reviewText.trim(),
      };

      let updatedReviews;
      if (editingReviewId) {
        updatedReviews = product.reviews.map((r) => (r.id === editingReviewId ? reviewData : r));
        toast.success("Review updated successfully!");
      } else {
        if (product.reviews?.some((r) => r.userId === CURRENT_USER_ID)) {
          toast.error("You have already submitted a review!");
          setIsSubmitting(false);
          return;
        }
        updatedReviews = [...(product.reviews || []), reviewData];
        toast.success("Review submitted successfully!");
      }

      const totalReviews = updatedReviews.length;
      const avgRating = updatedReviews.reduce((acc, r) => acc + r.rating, 0) / totalReviews;

      const updatedProduct = {
        ...product,
        reviews: updatedReviews,
        totalReviews,
        rating: Math.round(avgRating * 10) / 10,
      };

      const updatedProducts = products.map((p) => (p.id === parseInt(id) ? updatedProduct : p));
      setProducts(updatedProducts);
      setProduct(updatedProduct);

      setReviewRating(0);
      setReviewTitle("");
      setReviewText("");
      setShowReviewForm(false);
      setEditingReviewId(null);
      setIsSubmitting(false);
      setActiveTab("reviews");
    }, 1000);
  };

  const openDeleteModal = (reviewId) => {
    setDeletingReviewId(reviewId);
    setShowDeleteModal(true);
  };

  const handleDeleteReview = () => {
    const updatedReviews = product.reviews.filter((r) => r.id !== deletingReviewId);
    const totalReviews = updatedReviews.length;
    const avgRating = totalReviews > 0 ? updatedReviews.reduce((acc, r) => acc + r.rating, 0) / totalReviews : 0;

    const updatedProduct = {
      ...product,
      reviews: updatedReviews,
      totalReviews,
      rating: totalReviews > 0 ? Math.round(avgRating * 10) / 10 : 0,
    };

    const updatedProducts = products.map((p) => (p.id === parseInt(id) ? updatedProduct : p));
    setProducts(updatedProducts);
    setProduct(updatedProduct);
    toast.success("Review deleted successfully");
    setShowDeleteModal(false);
    setDeletingReviewId(null);
  };

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center p-8 bg-white rounded-lg shadow">
          <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Product Not Found</h2>
          <p className="text-gray-600 mb-6">The product you're looking for doesn't exist.</p>
          <button
            onClick={() => navigate(-1)}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <ReviewFormModal
        isOpen={showReviewForm}
        onClose={() => {
          setShowReviewForm(false);
          setEditingReviewId(null);
          setReviewRating(0);
          setReviewTitle("");
          setReviewText("");
        }}
        product={product}
        editingReviewId={editingReviewId}
        reviewRating={reviewRating}
        setReviewRating={setReviewRating}
        reviewTitle={reviewTitle}
        setReviewTitle={setReviewTitle}
        reviewText={reviewText}
        setReviewText={setReviewText}
        isSubmitting={isSubmitting}
        handleSubmitReview={handleSubmitReview}
      />
      <DeleteReviewModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDeleteReview}
      />

      {/* Top Navigation Bar */}
      <div className="bg-white border-b sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition group"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="font-medium">Back</span>
            </button>
            <div className="flex items-center gap-3">
              <button
                onClick={handleWishlist}
                className="p-2 rounded-lg hover:bg-gray-100 transition"
              >
                <Heart className={`w-6 h-6 ${isWishlisted ? "fill-red-500 text-red-500" : "text-gray-600"}`} />
              </button>
              <button
                onClick={handleShare}
                className="p-2 rounded-lg hover:bg-gray-100 transition"
              >
                <Share2 className="w-6 h-6 text-gray-600" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          <ImageGallery
            product={product}
            selectedImage={selectedImage}
            setSelectedImage={setSelectedImage}
          />
          <ProductInfo
            product={product}
            selectedSize={selectedSize}
            setSelectedSize={setSelectedSize}
            quantity={quantity}
            setQuantity={setQuantity}
            handleAddToCart={handleAddToCart}
            handleBuyNow={handleBuyNow}
          />
        </div>
        <Features />
        <Tabs
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          product={product}
          openReviewForm={openReviewForm}
          openDeleteModal={openDeleteModal}
        />
      </div>
    </div>
  );
};

export default ProductDetailPage;