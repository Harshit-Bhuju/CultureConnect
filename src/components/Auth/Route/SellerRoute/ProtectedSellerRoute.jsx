import React from "react";
import { Navigate, useParams } from "react-router-dom";
import { useAuth } from "../../../../context/AuthContext";
import Loading from "../../../Common/Loading";

const ProtectedSellerRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <Loading message="Verifying seller access..." />;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!user.seller_id) {
    return <Navigate to="/seller-registration" replace />;
  }

  const { sellerId } = useParams();

  if (sellerId && String(sellerId) !== String(user.seller_id)) {
    return <Navigate to="/" replace />;
  }

  return children;
};
export default ProtectedSellerRoute;
