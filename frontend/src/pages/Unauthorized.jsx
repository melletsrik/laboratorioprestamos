import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Auth } from '../utils/auth';

export default function Unauthorized() {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to appropriate page after 3 seconds
    const timer = setTimeout(() => {
      if (Auth.isAuthenticated()) {
        const role = Auth.getRol();
        navigate(role === 'Administrativo' ? '/menu-admin' : '/menu-aux');
      } else {
        navigate('/login');
      }
    }, 3000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md text-center">
        <h1 className="text-2xl font-bold text-red-600 mb-4">Acceso No Autorizado</h1>
        <p className="text-gray-700 mb-4">
          No tienes permiso para acceder a esta página.
        </p>
        <p className="text-gray-500 text-sm">
          Serás redirigido automáticamente en unos segundos...
        </p>
      </div>
    </div>
  );
}
