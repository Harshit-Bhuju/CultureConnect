import React from "react";
import { Navigate, useParams } from "react-router-dom";
import Loading from "../../../Common/Loading";
import { useAuth } from "../../../../context/AuthContext";

const ProtectedTeacherRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <Loading message="Verifying expert access..." />;
  }

  console.log("ProtectedTeacherRoute - User:", user);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (user.role === "delivery") {
    return <Navigate to="/delivery" replace />;
  }

  if (!user.teacher_id) {
    return <Navigate to="/teacher-registration" replace />;
  }

  const { teacherId } = useParams();

  if (teacherId && String(teacherId) !== String(user.teacher_id)) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedTeacherRoute;
