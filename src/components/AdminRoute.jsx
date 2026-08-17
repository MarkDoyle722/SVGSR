import { Navigate, Outlet, useLocation } from "react-router";

import { useAuth } from "../context/AuthContext";

export default function AdminRoute() {
  const location = useLocation();
  const { loading, user, isAdmin } = useAuth();

  if (loading) {
    return (
      <div className="admin-route-loading">
        <div className="admin-spinner" />
        <span>Checking admin access…</span>
      </div>
    );
  }

  if (!user) {
    return (
      <Navigate
        to="/admin/login"
        replace
        state={{ from: location.pathname }}
      />
    );
  }

  if (!isAdmin) {
    return <Navigate to="/admin/login?unauthorized=1" replace />;
  }

  return <Outlet />;
}
