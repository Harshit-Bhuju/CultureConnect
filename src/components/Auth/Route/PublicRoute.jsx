import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import Loading from "../../Common/Loading";

export default function PublicRoute({ children }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  // Check if URL has action=add parameter
  const searchParams = new URLSearchParams(location.search);
  const isAddingAccount = searchParams.get("action") === "add";

  if (loading) return <Loading message="Checking authentication..." />;

  // Allow access to login if adding account, even when authenticated
  if (user && !isAddingAccount) {
    if (user.role === "admin") {
      return <Navigate to="/admin" replace />;
    }
    if (user.role === "delivery") {
      return <Navigate to="/delivery" replace />;
    }
    return <Navigate to="/" replace />;
  }
  return children;
}
