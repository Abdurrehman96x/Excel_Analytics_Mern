import { Navigate } from 'react-router-dom';

const NavigateToRoleDashboard = () => {
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('userRole');

  if (!token) return <Navigate to="/login" />;
  return role === 'admin' ? <Navigate to="/admin" /> : <Navigate to="/dashboard" />;
};

export default NavigateToRoleDashboard;
