import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from 'react';
import { Auth } from './utils/auth';
import ProtectedRoute from './components/ProtectedRoute';
import RegistrarPrestamo from "./pages/RegistrarPrestamo"
import ListadoPrestamos from "./pages/ListadoPrestamos";
import Login from "./pages/Login";
import MenuAdmin from "./pages/MenuAdmin"
import MenuAux from "./pages/MenuAux";
import RegistrarEstudiante from "./pages/RegistrarEstudiante";
import GestionarMaterial from "./pages/GestionarMaterial";
import Docente from "./pages/Docentes";
import VentanaUsuario from "./pages/VentanaUsuario";
import VentanaMateria from "./pages/VentanaMateria";
import ReportePrestamo from "./pages/ReportePrestamo";
import Unauthorized from "./pages/Unauthorized";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize authentication when app loads
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // Initialize auth
        await Auth.initAuth();
        setIsInitialized(true);
      } catch (error) {
        console.error('Error initializing auth:', error);
        setIsInitialized(true); // Asegurarse de que la aplicación se renderice incluso si hay un error
      }
    };

    initializeAuth();
    
    // Add a global error handler for 401 Unauthorized responses
    const originalFetch = window.fetch;
    window.fetch = async function(...args) {
      const response = await originalFetch.apply(this, args);
      if (response.status === 401) {
        Auth.clearToken();
        window.location.href = '/';
      }
      return response;
    };
    
    return () => {
      // Cleanup
      window.fetch = originalFetch;
    };
  }, []);

  if (!isInitialized) {
    return <div className="flex items-center justify-center min-h-screen">Cargando...</div>;
  }

  // Redirigir a login si no está autenticado
  const RequireAuth = ({ children }) => {
    if (!Auth.isAuthenticated()) {
      return <Navigate to="/" replace />;
    }
    return children;
  };

  return (
    <BrowserRouter>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      <Routes>
        <Route path="/" element={
          !isInitialized ? (
            <div className="flex items-center justify-center min-h-screen">Cargando...</div>
          ) : (
            <Login />
          )
        } />
        {/* Rutas protegidas */}
        <Route path="/menu-admin" element={
          <RequireAuth>
            <ProtectedRoute requiredRole="Administrativo">
              <MenuAdmin />
            </ProtectedRoute>
          </RequireAuth>
        } />
        
        <Route path="/registrar-estudiante" element={
          <RequireAuth>
            <ProtectedRoute>
              <RegistrarEstudiante />
            </ProtectedRoute>
          </RequireAuth>
        } />
        
        <Route path="/VentanaUsuario" element={
          <RequireAuth>
            <ProtectedRoute requiredRole="Administrativo">
              <VentanaUsuario />
            </ProtectedRoute>
          </RequireAuth>
        } />

        {/* Rutas de Auxiliar */}
        <Route path="/menu-aux" element={
          <RequireAuth>
            <ProtectedRoute requiredRole="Auxiliar">
              <MenuAux />
            </ProtectedRoute>
          </RequireAuth>
        } />

        {/* Rutas protegidas para ambos roles */}
        <Route path="/registrar-prestamo" element={
          <RequireAuth>
            <ProtectedRoute>
              <RegistrarPrestamo />
            </ProtectedRoute>
          </RequireAuth>
        } />
        
        <Route path="/prestamo-activos" element={
          <RequireAuth>
            <ProtectedRoute>
              <ListadoPrestamos />
            </ProtectedRoute>
          </RequireAuth>
        } />
        
        <Route path="/material" element={
          <RequireAuth>
            <ProtectedRoute>
              <GestionarMaterial />
            </ProtectedRoute>
          </RequireAuth>
        } />
        
        <Route path="/docentes" element={
          <RequireAuth>
            <ProtectedRoute>
              <Docente />
            </ProtectedRoute>
          </RequireAuth>
        } />
        
        <Route path="/VentanaMateria" element={
          <RequireAuth>
            <ProtectedRoute>
              <VentanaMateria />
            </ProtectedRoute>
          </RequireAuth>
        } />
        
        <Route path="/ReportePrestamo" element={
          <RequireAuth>
            <ProtectedRoute>
              <ReportePrestamo />
            </ProtectedRoute>
          </RequireAuth>
        } />
        
        {/* Redirigir a login para rutas no coincidentes */}
        <Route path="*" element={
          <Navigate to="/" replace />
        } />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
