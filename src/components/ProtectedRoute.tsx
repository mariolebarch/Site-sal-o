import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAppStore } from "../store/useAppStore";

export function ProtectedRoute({ children }: { children: ReactNode }) {
  const isAuthenticated = useAppStore((s) => s.isAdminAuthenticated);
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
}

export function AdminOnlyRoute({ children }: { children: ReactNode }) {
  const isAuthenticated = useAppStore((s) => s.isAdminAuthenticated);
  const isAdmin = useAppStore((s) => s.isAdmin);
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  if (!isAdmin) {
    return <Navigate to="/admin" replace />;
  }
  return <>{children}</>;
}
