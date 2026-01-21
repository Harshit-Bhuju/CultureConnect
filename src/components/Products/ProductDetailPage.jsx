// ProductDetailPage.jsx - Connected to Database
import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import toast from "react-hot-toast";
import ImageGallery from "./ImageGallery";
import ProductInfo from "./ProductInfo";
import Tabs from "./Tabs";
import ReviewFormModal from "./ReviewFormModal";
import DeleteReviewModal from "./DeleteReviewModal";
import { ArrowLeft, Heart, Package, Share2 } from "lucide-react";
import API, { BASE_URL } from "../../Configs/ApiEndpoints";
import Loading from "../Common/Loading";

const ProductDetailPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { sellerId, id } = useParams();
  const { user } = useAuth();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [activeTab, setActiveTab] = useState("description");

  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewTitle, setReviewTitle] = useState("");
  const [reviewText, setReviewText] = useState("");
  const [editingReviewId, setEditingReviewId] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletingReviewId, setDeletingReviewId] = useState(null);

  const previousPage = location.state?.from || "/";

  const fetchProductDetails = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(
        `${API.GET_PRODUCT_DETAILS}?product_id=${id}&seller_id=${sellerId}`,
        {
          method: "GET",
          credentials: "include",
        },
      );

      const data = await response.json();

      if (data.success) {
        setProduct(data.product);

        // Check if product is in wishlist
        if (user) {
          checkWishlistStatus();
        }
      } else {
        setError(data.error || "Failed to fetch product details");
      }
    } catch (err) {
      setError("Network error while fetching product");
    } finally {
      setLoading(false);
    }
  };
  const checkWishlistStatus = async () => {
    try {
      const response = await fetch(API.GET_WISHLIST_ITEMS, {
        method: "GET",
        credentials: "include",
      });

      const data = await response.json();
      const items = Array.isArray(data.wishlistItems) ? data.wishlistItems : [];

      const inWishlist = items.some(
        (item) => Number(item.productId) === Number(id),
      );

      setIsWishlisted(inWishlist);
    } catch (err) {
      console.error("Error checking wishlist status:", err);
      setIsWishlisted(false);
    }
  };

  useEffect(() => {
    fetchProductDetails();
  }, [id]);

  useEffect(() => {
    if (user) {
      checkWishlistStatus();
    }
  }, [user, id]);

  const toastShown = useRef(false);

  // SINGLE error handler - only handle errors ONCE
  useEffect(() => {
    if (toastShown.current) return;

    const params = new URLSearchParams(location.search);
    const paymentStatus = params.get("payment");
    const error = params.get("error");

    // Only show toast if we have BOTH error and failed status
    if (paymentStatus === "failed" && error) {
      toastShown.current = true;
      toast.error(decodeURIComponent(error), { duration: 5000 });

      // Clean up URL immediately to prevent double toast
      params.delete("payment");
      params.delete("error");
      const newUrl = params.toString()
        ? `${location.pathname}?${params.toString()}`
        : location.pathname;

      // Use replace to avoid adding to history
      window.history.replaceState({}, "", newUrl);
    }
  }, []); // Empty dependency array - run ONLY ONCE on mount

  const handleShare = async () => {
    const url = window.location.href;

    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(url);
        toast.success("Link copied to clipboard!");
      } else {
        const textArea = document.createElement("textarea");
        textArea.value = url;
        textArea.style.position = "fixed";
        textArea.style.left = "-999999px";
        textArea.style.top = "-999999px";
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();

        try {
          const successful = document.execCommand("copy");
          if (successful) {
            toast.success("Link copied to clipboard!");
          } else {
            throw new Error("Copy command failed");
          }
        } finally {
          document.body.removeChild(textArea);
        }
      }
    } catch (err) {
      console.error("Failed to copy:", err);
      toast.error("Failed to copy link");
    }
  };

  const handleAddToCart = async () => {
    if (!user) {
      toast.error("Please login to add items to cart");
      navigate("/login", { state: { from: location.pathname } });
      return;
    }

    // Size validation removed to allow adding to cart without size

    const loadingToast = toast.loading("Adding to cart...");

    try {
      const formData = new FormData();
      formData.append("productId", product.id);
      formData.append("product_id", product.id);
      formData.append("sellerId", sellerId);
      formData.append("seller_id", sellerId);
      formData.append("quantity", quantity);
      if (selectedSize) {
        formData.append("size", selectedSize);
        formData.append("product_size", selectedSize);
        formData.append("selected_size", selectedSize);
      }

      const response = await fetch(API.ADD_TO_CART, {
        method: "POST",
        credentials: "include",
        body: formData,
      });

      const data = await response.json();

      toast.dismiss(loadingToast);

      if (data.success) {
        toast.success(
          data.updated
            ? "Cart updated successfully!"
            : "Added to cart successfully!",
          {
            icon: "🛒",
          },
        );
      } else {
        toast.error(data.error || "Failed to add to cart");
      }
    } catch (err) {
      toast.dismiss(loadingToast);
      console.error("Error adding to cart:", err);
      toast.error("Network error. Please try again.");
    }
  };

  const handleBuyNow = () => {
    if (!user) {
      toast.error("Please login to continue");
      navigate("/login", { state: { from: location.pathname } });
      return;
    }

    const hasSizes =
      product.sizes?.length > 0 ||
      product.ageGroups?.length > 0 ||
      product.adultSizes?.length > 0 ||
      product.childAgeGroups?.length > 0;
    if (hasSizes && !selectedSize) {
      toast.error("Please select a size");
      return;
    }

    navigate(
      `/checkout/${sellerId}/${id}?qty=${quantity}&size=${selectedSize || ""}`,
      {
        state: {
          fromProductPage: true,
          productPageReturn: previousPage,
        },
      },
    );
  };

  const handleWishlist = async () => {
    const nextState = !isWishlisted;
    setIsWishlisted(nextState); // optimistic UI update

    const loadingToast = toast.loading(
      nextState ? "Adding to wishlist..." : "Removing from wishlist...",
    );

    try {
      let data;
      if (nextState) {
        // ADD
        const formData = new FormData();
        formData.append("productId", product.id);
        const res = await fetch(API.ADD_TO_WISHLIST, {
          method: "POST",
          credentials: "include",
          body: formData,
        });
        data = await res.json();
        if (!data.success) throw new Error(data.error || "Failed to add");
      } else {
        // REMOVE - NOW SEND productId
        const formData = new FormData();
        formData.append("productId", product.id); // ← THIS IS KEY

        const res = await fetch(API.REMOVE_FROM_WISHLIST, {
          method: "POST",
          credentials: "include",
          body: formData,
        });
        data = await res.json();
        if (!data.success) throw new Error(data.error || "Failed to remove");
      }

      toast.dismiss(loadingToast);
      toast.success(
        nextState ? "Added to wishlist ❤️" : "Removed from wishlist 💔",
      );
    } catch (err) {
      setIsWishlisted(!nextState); // rollback
      toast.dismiss(loadingToast);
      toast.error(err.message || "Wishlist update failed");
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  const openReviewForm = (review = null) => {
    if (!user) {
      toast.error("Please login to write a review");
      return;
    }

    if (review) {
      setEditingReviewId(review.id);
      setReviewRating(review.rating);
      setReviewTitle(review.title || "");
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

    if (!user) {
      toast.error("Please login to submit a review");
      return;
    }

    if (reviewRating === 0) {
      toast.error("Please select a rating");
      return;
    }

    if (reviewText.trim().length < 10) {
      toast.error("Review must be at least 10 characters long");
      return;
    }

    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append("product_id", product.id);
      formData.append("rating", reviewRating);
      formData.append("comment", reviewText.trim());
      if (editingReviewId) {
        formData.append("review_id", editingReviewId);
      }

      const response = await fetch(API.SUBMIT_REVIEW, {
        method: "POST",
        credentials: "include",
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        let updatedReviews;
        if (editingReviewId) {
          updatedReviews = product.reviews.map((r) =>
            r.id === editingReviewId ? data.review : r,
          );
          toast.success("Review updated successfully!");
        } else {
          updatedReviews = [data.review, ...(product.reviews || [])];
          toast.success("Review submitted successfully!");
        }

        const totalReviews = updatedReviews.length;
        const avgRating =
          updatedReviews.reduce((acc, r) => acc + r.rating, 0) / totalReviews;

        setProduct({
          ...product,
          reviews: updatedReviews,
          totalReviews,
          averageRating: Math.round(avgRating * 100) / 100,
        });

        setReviewRating(0);
        setReviewTitle("");
        setReviewText("");
        setShowReviewForm(false);
        setEditingReviewId(null);
        setActiveTab("reviews");
      } else {
        toast.error(data.error || "Failed to submit review");
      }
    } catch (err) {
      console.error("Error submitting review:", err);
      toast.error("Network error. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const openDeleteModal = (reviewId) => {
    setDeletingReviewId(reviewId);
    setShowDeleteModal(true);
  };

  const handleDeleteReview = async () => {
    try {
      const formData = new FormData();
      formData.append("review_id", deletingReviewId);

      const response = await fetch(API.DELETE_REVIEW, {
        method: "POST",
        credentials: "include",
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        const updatedReviews = product.reviews.filter(
          (r) => r.id !== deletingReviewId,
        );
        const totalReviews = updatedReviews.length;
        const avgRating =
          totalReviews > 0
            ? updatedReviews.reduce((acc, r) => acc + r.rating, 0) /
            totalReviews
            : 0;

        setProduct({
          ...product,
          reviews: updatedReviews,
          totalReviews,
          averageRating:
            totalReviews > 0 ? Math.round(avgRating * 100) / 100 : 0,
        });

        toast.success("Review deleted successfully");
        setShowDeleteModal(false);
        setDeletingReviewId(null);
      } else {
        toast.error(data.error || "Failed to delete review");
      }
    } catch (err) {
      console.error("Error deleting review:", err);
      toast.error("Network error. Please try again.");
    }
  };

  if (loading) {
    return <Loading message="Loading product details..." />;
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center p-8 bg-white rounded-lg shadow">
          <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {error ? "Error Loading Product" : "Product Not Found"}
          </h2>
          <p className="text-gray-600 mb-6">
            {error || "The product you're looking for doesn't exist."}
          </p>
          <button
            onClick={handleBack}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition">
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

      <div className="bg-white border-b sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={handleBack}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition group">
              <ArrowLeft className="w-5 h-5" />
              <span className="font-medium">Back</span>
            </button>
            <div className="flex items-center gap-3">
              <button
                onClick={handleWishlist}
                className="p-2 rounded-lg hover:bg-gray-100 transition"
                title={
                  isWishlisted ? "Remove from wishlist" : "Add to wishlist"
                }>
                <Heart
                  className={`w-6 h-6 ${isWishlisted ? "fill-red-500 text-red-500" : "text-gray-600"}`}
                />
              </button>
              <button
                onClick={handleShare}
                className="p-2 rounded-lg hover:bg-gray-100 transition"
                title="Share product">
                <Share2 className="w-6 h-6 text-gray-600" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          <ImageGallery
            product={product}
            selectedImage={selectedImage}
            setSelectedImage={setSelectedImage}
            baseUrl={BASE_URL}
          />
          <ProductInfo
            product={product}
            selectedSize={selectedSize}
            setSelectedSize={setSelectedSize}
            quantity={quantity}
            setQuantity={setQuantity}
            handleAddToCart={handleAddToCart}
            handleBuyNow={handleBuyNow}
            sellerId={sellerId}
          />
        </div>
        <Tabs
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          product={product}
          openReviewForm={openReviewForm}
          openDeleteModal={openDeleteModal}
          currentUserId={user?.id}
          sellerId={sellerId}
        />
      </div>
    </div>
  );
};

export default ProductDetailPage;
