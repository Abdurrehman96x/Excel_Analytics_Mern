import { Navigate } from 'react-router-dom';

const AdminRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('userRole');

  if (!token) {
    // Not logged in
    return <Navigate to="/login" />;
  }

  if (role !== 'admin') {
    // Logged in but not admin
    return <Navigate to="/dashboard" />;
  }

  // Logged in and is admin
  return children;
};

export default AdminRoute;
