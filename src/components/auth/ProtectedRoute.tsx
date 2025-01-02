import { Navigate } from "react-router-dom";
import { useDevMode } from "../../contexts/DevModeContext";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { isDevMode } = useDevMode();
  const isAuthenticated = false; // TODO: Replace with actual auth check when implemented

  if (!isAuthenticated && !isDevMode) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};
