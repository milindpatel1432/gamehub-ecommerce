import { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function ProtectedRoute({ children, adminOnly = false }) {
  const { isAuthenticated, loading, user, openAuthModal } = useAuth();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      openAuthModal('login');
    }
  }, [loading, isAuthenticated, openAuthModal]);

  if (loading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-gaming-dark">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-gaming-cyan border-t-transparent" />
      </div>
    );
  }

  if (!isAuthenticated) {
    // Open Auth Popup Modal and redirect to home instead of full login page
    return <Navigate to="/" replace />;
  }

  if (adminOnly && user?.role !== 'admin') {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}
