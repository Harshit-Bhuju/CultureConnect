import React from "react";
import { useParams, useLocation, Navigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import Loading from "../../Common/Loading";
import ProductDetailPage from "../ProductDetailPage";
import SellerProductDetailPage from "../../ManageProducts/CardHandling/SellerProductDetailPage";

export default function ProductDetailRouter() {
  const { user, loading } = useAuth();
  const { sellerId } = useParams();
  const location = useLocation();
  
  if (loading) {
    return <Loading message="Loading..." />;
  }

  const isSellerManagementView = location.pathname.startsWith('/seller/products');
  const isOwnProduct = user?.seller_id === parseInt(sellerId);
  
  // If it's the seller management view but NOT their own product, redirect to regular view
  if (isSellerManagementView && !isOwnProduct) {
    const productId = location.pathname.split('/').pop();
    return <Navigate to={`/products/${sellerId}/${productId}`} replace />;
  }
  
  // If it's the seller management view and it's their own product, show seller view
  if (isSellerManagementView && isOwnProduct) {
    return <SellerProductDetailPage />;
  }
  
  // If viewing regular product page but it's their own product, redirect to seller management
  if (!isSellerManagementView && isOwnProduct) {
    const productId = location.pathname.split('/').pop();
    return <Navigate to={`/seller/products/${sellerId}/${productId}`} replace />;
  }
  
  // For all other cases, show the regular product detail page
  return <ProductDetailPage />;
}