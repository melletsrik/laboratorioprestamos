import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Auth } from "../utils/auth";
import { IoArrowBackCircleOutline } from "react-icons/io5";
import { LuLogOut } from "react-icons/lu";
import PrestamoBusqueda from "../components/GestionarPrestamo/PrestamoBusqueda";

export default function ListadoPrestamos() {
  const [aPrestamos, setAPrestamos] = useState([]);
  const [lLoading, setLLoading] = useState(true);
  const [cError, setCError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const token = Auth.getToken("token");
  const navegar = useNavigate();

  useEffect(() => {
    if (!token) {
      navegar("/");
    }
  }, [token, navegar]);

  if (!token) return null;

  useEffect(() => {
    const controller = new AbortController();

    const f_fetchPrestamos = async () => {
      try {
        const token = localStorage.getItem("token");
       ;
        if (!token) {
          throw new Error('No hay token de autenticación');
        }
        const response = await fetch("http://localhost:4000/api/prestamos", {
          signal: controller.signal,
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
        });
        
        if (!response.ok) {
          const errorData = await response.json().catch(() => {});
          console.error('Error en la respuesta:', {
            status: response.status,
            statusText: response.statusText,
            errorData
            
          });
          throw new Error(`Error ${response.status}: ${response.statusText}`);
        }
        const data = await response.json();
        
        if (!data) {
          throw new Error('No se recibieron datos del servidor');
        }
        
        if (data.success && Array.isArray(data.data)) {
          // Asegurarse de que todos los préstamos tengan un id_estado
          const prestamosConEstado = data.data.map(prestamo => ({
            ...prestamo,
            id_estado: prestamo.id_estado || '0' // Valor por defecto si no tiene estado
          }));
         
          if (prestamosConEstado.length > 0) {
            
            console.log('prestamos cargado', 
             
            );
          } else {
            console.log('No hay préstamos para mostrar');
          }
          
          setAPrestamos(prestamosConEstado);
        } else {
          console.error('Error en la respuesta del backend:', data);
          setCError(data.message || 'Error al cargar los préstamos');
        }
      } catch (err) {
        if (err.name !== "AbortError") {
          console.error('Error:', err);
          if (err.message === 'No hay token de autenticación') {
            setCError('Debe iniciar sesión para ver los préstamos');
          } else {
            setCError(err.message || 'Error al cargar los préstamos');
          }
        }
      } finally {
        setLLoading(false);
      }
    };

    f_fetchPrestamos();

    return () => controller.abort();
  }, []);

  const f_irAEditar = (idPrestamo) => {
    navegar(`/registrar-prestamo?editar=${idPrestamo}`);
  };

  const f_irADevolver = (p_prestamo) => {
    // Obtener el usuario actual
    const usuarioActual = JSON.parse(localStorage.getItem('user'));
    
    // Preparar los datos para el formulario de devolución
    const datosDevolucion = {
      ...p_prestamo,
      registro: p_prestamo.estudiante?.Registro,
      nombres: p_prestamo.estudiante?.persona?.nombre,
      apellidos: p_prestamo.estudiante?.persona?.apellido,
      asistente_entrega: p_prestamo.usuarioEntrega?.nombre + ' ' + p_prestamo.usuarioEntrega?.apellido,
      asistente_recepcion: usuarioActual.nombre + ' ' + usuarioActual.apellido,
  
      id_estado: 3, // Estado "Devuelto"
      fecha_devolucion: new Date().toISOString(),
      semestre: p_prestamo.semestre?.nombre || "",
      id_materia: p_prestamo.materia?.id_materia,
      id_docente: p_prestamo.docente?.id_docente,
      id_modulo: p_prestamo.id_modulo,
      id_semestre: p_prestamo.id_semestre || p_prestamo.semestre?.id_semestre,
      observaciones: p_prestamo.observaciones || '', 
      detalles: p_prestamo.detalles.map(detalle => ({
        ...detalle,
          id_material: detalle.id_material,
  codigo_material: detalle.material?.codigo_material,
  nombre: detalle.material?.nombre,
  especificaciones: detalle.material?.especificaciones,
  cantidad: detalle.cantidad,
      cantidad_devuelta: detalle.cantidad // Por defecto se devuelve toda la cantidad
      })),
      
    };

    // Guardar los datos en localStorage
    localStorage.setItem('prestamoADevolver', JSON.stringify(datosDevolucion));
    // Redirigir a la página de registro con parámetro de devolución
    navegar('/registrar-prestamo?devolucion=1');
  };

  // Formatear valores numéricos o fechas
  const formatearValor = (valor) => {
    if (valor === null || valor === undefined) return "N/A";
    if (typeof valor === 'number') return valor.toString();
    const date = new Date(valor);
    if (isNaN(date)) return valor.toString();
    return date.toLocaleDateString("es-PE");
  };

  // Obtener clase de estado
  const obtenerClaseEstado = (estadoId) => {
    switch (estadoId) {
      case 1:
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 2:
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 3:
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  // Obtener texto de estado
  const obtenerTextoEstado = (estadoId) => {
    switch (estadoId) {
      case 1:
        return 'Prestado';
      case 2:
        return 'Parcial';
      case 3:
        return 'Devuelto';
      default:
        return 'N/A';
    }
  };

  // Formatear fecha
  const formatearFecha = (fecha) => {
    if (!fecha) return 'N/A';
    return new Date(fecha).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Filtrar préstamos basados en el término de búsqueda
  const filteredPrestamos = useMemo(() => {
    if (lLoading || !aPrestamos) return [];
    if (!searchTerm) return aPrestamos.filter(p => ['1', '2'].includes(String(p.id_estado)));
    
    const searchLower = searchTerm.toLowerCase();
    return aPrestamos.filter(p => 
      ['1','2'].includes(String(p.id_estado)) && (
        (p.estudiante?.persona?.nombre?.toLowerCase().includes(searchLower)) ||
        (p.estudiante?.persona?.apellido?.toLowerCase().includes(searchLower)) ||
        (p.estudiante?.Registro?.toLowerCase().includes(searchLower)) ||
        (p.materia?.nombre?.toLowerCase().includes(searchLower)) ||
        (p.docente?.persona?.nombre?.toLowerCase().includes(searchLower)) ||
        (p.id_modulo?.toString().toLowerCase().includes(searchLower)) ||
        (p.detalles?.some(d => d.material?.nombre?.toLowerCase().includes(searchLower)))
      )
    );
  }, [aPrestamos, searchTerm, lLoading]);

  if (lLoading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
        <div className="flex justify-center items-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
          <span className="ml-3 text-gray-600">Cargando préstamos...</span>
        </div>
      </div>
    );
  }

  if (cError) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
        <div className="text-center text-red-600">
          <h3 className="text-lg font-medium mb-2">Ocurrió un error</h3>
          <p>{cError}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-white">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={() => {
                const rol = localStorage.getItem("rol");
                if (rol === "Administrativo") {
                  navegar("/menu-admin");
                } else {
                  navegar("/menu-aux");
                }
              }}  
              className="flex items-center gap-2 text-red-600 hover:text-red-900 font-semibold"
            >
              <IoArrowBackCircleOutline className="w-6 h-6" />
              Volver al Menú
            </button>
            <button
              onClick={() => {
                localStorage.clear();
                navegar("/");
              }}
              className="flex items-center gap-2 text-red-600 hover:text-red-800 font-medium"
            >
              <LuLogOut className="w-5 h-5" />
              Cerrar Sesión
            </button>
          </div>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Título y búsqueda */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-red-100 rounded-xl">
              <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-gray-900">Lista de Préstamos Activos</h1>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="w-full">
              <PrestamoBusqueda 
                onBuscar={setSearchTerm} 
                placeholder="Buscar por nombre, registro, materia..."
              />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-6">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">NRO</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">REGISTRO</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ESTUDIANTE</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">FECHA PRÉSTAMO</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">MATERIA</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">DOCENTE</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">MÓDULO</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ENTREGADO POR</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">MATERIAL</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">CANTIDAD</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ESTADO</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"> OBSERVACIÓN</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ACCIÓN</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredPrestamos.map((p) => {
                  const cNombreCompleto = `${p.estudiante?.persona?.nombre || ''} ${p.estudiante?.persona?.apellido || ''}`.trim() || 'N/A';
                  const nombreMaterial = p.detalles?.[0]?.material?.nombre || 'N/A';
                  const cantidad = p.detalles?.[0]?.cantidad || 'N/A';
                  const nombreDocente = p.docente?.persona?.nombre || 'N/A';
                  const nombreEntrega = p.usuarioEntrega?.nombre && p.usuarioEntrega?.apellido 
                    ? `${p.usuarioEntrega.nombre} ${p.usuarioEntrega.apellido}` 
                    : 'N/A';

                  return (
                    <tr key={p.id_prestamo} className="hover:bg-gray-50">
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                        {p.id_prestamo || 'N/A'}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                        {p.estudiante?.Registro || 'N/A'}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                        {cNombreCompleto}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatearFecha(p.fecha_prestamo)}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                        {p.materia?.nombre || 'N/A'}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                        {nombreDocente}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatearValor(p.id_modulo)}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                        {nombreEntrega}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                        {nombreMaterial}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                        {cantidad}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <span 
                          className={`px-2 py-1 text-xs font-medium rounded-full ${obtenerClaseEstado(Number(p.id_estado))}`}
                        >
                          {obtenerTextoEstado(Number(p.id_estado))}
                        </span>
                      </td>
                       <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700"> {p.observaciones || '—'}</td>

                      <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                        <button
                          onClick={() => f_irAEditar(p.id_prestamo)}
                          type="button"
                          className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-md text-sm font-medium transition-colors"
                        >
                          Editar
                        </button>
                        <button
                          onClick={() => f_irADevolver(p)}
                          type="button"
                          className="bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded-md text-sm font-medium transition-colors"
                        >
                          Devolver
                        </button>
                      </td>
                    </tr>
                  );
                })}
                {filteredPrestamos.length === 0 && (
                  <tr>
                    <td colSpan="12" className="px-4 py-4 text-center text-sm text-gray-500">
                      No se encontraron préstamos activos
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
