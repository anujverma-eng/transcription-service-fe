import React from 'react';
import { useAppSelector } from '@/store/hooks';
import { Navigate, useLocation } from 'react-router-dom';

interface RoleRouteProps {
  children: React.ReactNode;
  requiredRole?: string;  // e.g. "admin"
  requirePaidPlan?: boolean;
}

export default function RoleRoute({ children, requiredRole, requirePaidPlan }: RoleRouteProps) {
  const auth = useAppSelector((state) => state.auth);
  const location = useLocation();

  // must be logged in
  if (!auth.user) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  // if we require a specific role
  if (requiredRole && auth.user.role !== requiredRole) {
    return <Navigate to="/not-authorized" replace />;
  }

  // if we require a paid plan
  if (requirePaidPlan && auth.user.subscriptionPlan !== 'paid') {
    return <Navigate to="/upgrade" replace />;
  }

  return <>{children}</>;
}
