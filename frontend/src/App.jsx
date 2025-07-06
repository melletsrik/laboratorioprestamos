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
    // Initialize auth
    Auth.initAuth();
    setIsInitialized(true);
    
    // Add a global error handler for 401 Unauthorized responses
    const originalFetch = window.fetch;
    window.fetch = async function(...args) {
      const response = await originalFetch.apply(this, args);
      if (response.status === 401) {
        Auth.clearToken();
        window.location.href = '/login';
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
        <Route path="/login" element={
          Auth.isAuthenticated() ? (
            Auth.getRol() === 'Administrativo' ? (
              <Navigate to="/menu-admin" replace />
            ) : (
              <Navigate to="/menu-aux" replace />
            )
          ) : (
            <Login />
          )
        } />
        
        <Route path="/" element={
          Auth.isAuthenticated() ? 
            (Auth.getRol() === 'Administrativo' ? 
              <Navigate to="/menu-admin" replace /> : 
              <Navigate to="/menu-aux" replace />) : 
            <Navigate to="/login" replace /> 
        } />

        {/* Protected Admin Routes */}
        <Route path="/menu-admin" element={
          <ProtectedRoute requiredRole="Administrativo">
            <MenuAdmin />
          </ProtectedRoute>
        } />
        
        <Route path="/registrar-estudiante" element={
          <ProtectedRoute requiredRole="Administrativo">
            <RegistrarEstudiante />
          </ProtectedRoute>
        } />
        
        <Route path="/VentanaUsuario" element={
          <ProtectedRoute requiredRole="Administrativo">
            <VentanaUsuario />
          </ProtectedRoute>
        } />

        {/* Protected Auxiliar Routes */}
        <Route path="/menu-aux" element={
          <ProtectedRoute requiredRole="Auxiliar">
            <MenuAux />
          </ProtectedRoute>
        } />

        {/* Protected Routes for Both Roles */}
        <Route path="/registrar-prestamo" element={
          <ProtectedRoute>
            <RegistrarPrestamo />
          </ProtectedRoute>
        } />
        
        <Route path="/prestamo-activos" element={
          <ProtectedRoute>
            <ListadoPrestamos />
          </ProtectedRoute>
        } />
        
        <Route path="/material" element={
          <ProtectedRoute>
            <GestionarMaterial />
          </ProtectedRoute>
        } />
        
        <Route path="/docentes" element={
          <ProtectedRoute>
            <Docente />
          </ProtectedRoute>
        } />
        
        <Route path="/VentanaMateria" element={
          <ProtectedRoute>
            <VentanaMateria />
          </ProtectedRoute>
        } />
        
        <Route path="/ReportePrestamo" element={
          <ProtectedRoute>
            <ReportePrestamo />
          </ProtectedRoute>
        } />
        
        {/* Catch all other routes */}
        <Route path="*" element={
          Auth.isAuthenticated() ? 
            <Navigate to={
              Auth.getRol() === 'Administrativo' ? 
                "/menu-admin" : 
                "/menu-aux"
            } replace /> : 
            <Navigate to="/login" replace />
        } />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
