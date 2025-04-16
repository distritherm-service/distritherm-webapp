import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    // Rediriger vers la page de connexion en conservant l'URL de destination
    return <Navigate to="/connexion" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute; 