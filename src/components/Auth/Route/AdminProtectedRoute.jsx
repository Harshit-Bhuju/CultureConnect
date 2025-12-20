import { Navigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import Loading from "../../Common/Loading";

export default function AdminProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) return <Loading message="Verifying access..." />;

  if (!user || user.role !== "admin") {
    return <Navigate to="/login" replace />;
  }

  return children;
}