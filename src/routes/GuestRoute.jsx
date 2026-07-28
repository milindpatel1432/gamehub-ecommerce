import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function GuestRoute({ children }) {
  const { isAuthenticated, loading, user, authRedirectUrl } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-gaming-dark">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-gaming-cyan border-t-transparent" />
      </div>
    );
  }

  if (isAuthenticated) {
    if (user?.role === 'admin') {
      return <Navigate to="/admin" replace />;
    }
    const fromState = location.state?.from;
    let target = null;

    if (typeof fromState === 'string') {
      target = fromState;
    } else if (fromState && typeof fromState === 'object' && fromState.pathname) {
      target = fromState.pathname + (fromState.search || '') + (fromState.hash || '');
    }

    if (!target && authRedirectUrl) {
      target = authRedirectUrl;
    }

    if (target && target !== '/login' && target !== '/register') {
      return <Navigate to={target} replace />;
    }

    return <Navigate to="/dashboard" replace />;
  }

  return children;
}
