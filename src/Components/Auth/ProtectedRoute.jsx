import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

const ProtectedRoute = ({ children, requiredRole = null }) => {
  const { currentUser, userData } = useAuth();
  const location = useLocation();

  if (!currentUser) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requiredRole && userData?.role !== requiredRole) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
