import { Navigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import Loading from "../../Common/Loading";

export default function DeliveryProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) return <Loading message="Verifying delivery access..." />;

  // if (!user || user.role !== "delivery") {
  //   return <Navigate to="/login" replace />;
  // }

  return children;
}
