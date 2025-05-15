import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useLogin } from '../../pages/public/Login/LoginProvider';

function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useLogin();
  const location = useLocation();

  if (loading) {
    return <div>Cargando...</div>;
  }

  if (!isAuthenticated()) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  return children;
}

export default ProtectedRoute;
