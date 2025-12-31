import React from "react";
import { Navigate } from "react-router-dom";
import Loading from "../../../Common/Loading";
import { useAuth } from '../../../../context/AuthContext';

const ProtectedTeacherRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <Loading message="Checking authentication..." />;
  }


  // if (!user.teacher_id) {
  //   return <Navigate to="/teacher-registration" replace />;
  // }
  return children;
};

export default ProtectedTeacherRoute;