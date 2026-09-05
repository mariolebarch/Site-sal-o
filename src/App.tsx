import { useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Home } from "./pages/Home";
import { Booking } from "./pages/Booking";
import { Login } from "./pages/Login";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { AdminLayout } from "./pages/admin/AdminLayout";
import { AdminDashboard } from "./pages/admin/AdminDashboard";
import { AdminAgenda } from "./pages/admin/AdminAgenda";
import { AdminBlocking } from "./pages/admin/AdminBlocking";
import { AdminServices } from "./pages/admin/AdminServices";
import { AdminHours } from "./pages/admin/AdminHours";
import { AdminSettings } from "./pages/admin/AdminSettings";
import { useAppStore } from "./store/useAppStore";
import { Monogram } from "./components/decor/Icons";

function App() {
  const ready = useAppStore((s) => s.ready);

  useEffect(() => {
    useAppStore.getState().init();
  }, []);

  if (!ready) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cream-100">
        <Monogram className="h-12 w-12 animate-pulse" />
      </div>
    );
  }

  return (
    <BrowserRouter basename={import.meta.env.BASE_URL.replace(/\/$/, "") || "/"}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/agendar" element={<Booking />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<AdminDashboard />} />
          <Route path="agenda" element={<AdminAgenda />} />
          <Route path="bloqueios" element={<AdminBlocking />} />
          <Route path="servicos" element={<AdminServices />} />
          <Route path="horarios" element={<AdminHours />} />
          <Route path="configuracoes" element={<AdminSettings />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
