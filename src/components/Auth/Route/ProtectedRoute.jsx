import { Navigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext"; // Update path if needed
import Loading from "../../Common/Loading";

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) return <Loading message="Checking authentication..." />;
  // if (!user) return <Navigate to="/login" replace />;

  return children;
}
