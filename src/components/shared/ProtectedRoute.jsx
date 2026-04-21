import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/useAuth';

const ProtectedRoute = ({ allowedRoles }) => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    const fallback = user.role === 'agent' ? '/agent' : user.role === 'supervisor' ? '/supervisor' : '/admin';
    return <Navigate to={fallback} replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
