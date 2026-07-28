import { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function ProtectedRoute({ children, adminOnly = false }) {
  const { isAuthenticated, loading, user, openAuthModal } = useAuth();
  const location = useLocation();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      const targetUrl = location.pathname + location.search + location.hash;
      openAuthModal('login', targetUrl);
    }
  }, [loading, isAuthenticated, openAuthModal, location]);

  if (loading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-gaming-dark">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-gaming-cyan border-t-transparent" />
      </div>
    );
  }

  if (!isAuthenticated) {
    // Open Auth Popup Modal and preserve requested target in navigation state
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  if (adminOnly && user?.role !== 'admin') {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}
