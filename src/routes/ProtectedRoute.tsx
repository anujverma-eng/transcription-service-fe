import React from 'react';
import { useAppSelector } from '@/store/hooks';
import { Navigate, useLocation } from 'react-router-dom';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const auth = useAppSelector((state) => state.auth);
  const location = useLocation();

  if (!auth.user) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }
  return <>{children}</>;
}
