import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../../../context/AuthContext";
import Loading from "../../../Common/Loading";

const TeacherRegistrationRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <Loading message="Checking expert status..." />;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (user.teacher_id) {
    return <Navigate to={`/teacherprofile/${user.teacher_id}`} replace />;
  }

  return children;
};

export default TeacherRegistrationRoute;
