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

function App() {
  return (
    <BrowserRouter>
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
