import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Loading from "../Common/Loading";

export default function PublicRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) return <Loading message="Checking authentication..." />;
  if (user) return <Navigate to="/" replace />;

  return children;
}
