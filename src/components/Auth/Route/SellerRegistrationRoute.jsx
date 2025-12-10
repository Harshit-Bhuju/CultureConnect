import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import Loading from "../../Common/Loading";

const SellerRegistrationRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <Loading message="Checking seller status..." />;
  }
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  if (user.seller_id) {
    return <Navigate to={`/sellerprofile/${user.seller_id}`} replace />;
  }
  
  return children;
};

export default SellerRegistrationRoute;