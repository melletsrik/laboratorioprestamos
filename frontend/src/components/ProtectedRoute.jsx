import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { Auth } from '../utils/auth';
import { useEffect } from 'react';

export default function ProtectedRoute({ children, requiredRole = null }) {
  const location = useLocation();
  const navigate = useNavigate();
  const isAuthenticated = Auth.isAuthenticated();
  const userRole = Auth.getRol();
  const currentPath = location.pathname;

  useEffect(() => {
    // Prevent back button from working when logged out
    const handleBackButton = (e) => {
      if (!isAuthenticated && !Auth.publicPaths.includes(currentPath)) {
        e.preventDefault();
        navigate('/login', { replace: true });
        // Clear the forward stack to prevent going back
        window.history.pushState(null, '', window.location.href);
      }
    };

    // Add event listener for popstate
    window.addEventListener('popstate', handleBackButton);

    // Clear the forward stack
    window.history.pushState(null, '', window.location.href);

    return () => {
      window.removeEventListener('popstate', handleBackButton);
    };
  }, [isAuthenticated, currentPath, navigate]);

  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    // Store the attempted URL for redirecting after login
    const from = location.pathname || '/';
    return <Navigate to="/login" state={{ from }} replace />;
  }

  // If role is required and doesn't match, redirect to unauthorized
  if (requiredRole && userRole !== requiredRole) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
}
