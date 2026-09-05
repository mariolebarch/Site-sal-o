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
