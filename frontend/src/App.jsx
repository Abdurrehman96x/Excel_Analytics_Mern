import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import Dashboard from "./pages/Dashboard";
import AdminDashboard from "./pages/AdminDashboard";
import ProtectedRoute from "./routes/ProtectedRoute";
import AdminRoute from "./routes/AdminRoute";
import NavigateToRoleDashboard from "./routes/NavigateToRoleDashboard"; // optional fallback
import AdminUploads from "./pages/AdminUploads";
import UploadPage from "./pages/UploadPage";

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Protected User Route */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        {/* Upload Page */}
        <Route path="/upload" element={<ProtectedRoute><UploadPage /></ProtectedRoute>} />
        {/* Admin-only Route */}
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          }
        />

        {/* Optional: Redirect unknown routes based on user role */}
        <Route path="*" element={<NavigateToRoleDashboard />} />
        <Route
          path="/admin/uploads"
          element={
            <AdminRoute>
              <AdminUploads />
            </AdminRoute>
          }
        />
        
      </Routes>
    </Router>
  );
}

export default App;
