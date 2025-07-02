import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import ReporteBusqueda from "../components/ReportePrestamo/ReporteBusqueda";
import ReporteTabla from "../components/ReportePrestamo/ReporteTabla";
import ReporteExportar from "../components/ReportePrestamo/ReporteExportar";
import { LuClipboardList, LuLogOut } from "react-icons/lu";
import { IoArrowBackCircleOutline } from "react-icons/io5";
import { RiFileExcel2Line } from "react-icons/ri";
export default function VentanaReporte() {
  const navegar = useNavigate();
  const [datos, setDatos] = useState([]);
  const [datosFiltrados, setDatosFiltrados] = useState([]);
  const [cargando, setCargando] = useState(false);
  const [mensaje, setMensaje] = useState('');
  const [filtros, setFiltros] = useState({
    fechaInicio: '',  // Inicialmente vacío
    fechaFin: '',
    estado: '', // Inicialmente vacío para mostrar todos
    busqueda: ''
  });

 const token = localStorage.getItem("token");
  // Cargar datos del reporte
  const cargarReporte = async () => {
    if (!filtros.fechaInicio || !filtros.fechaFin) {
      setMensaje('Por favor selecciona un rango de fechas');
      return;
    }
    setCargando(true);
    setMensaje('');
    try {
      const token= localStorage.getItem("token");
      if (!token) {
        throw new Error('No se encontró token de autenticación');
      }
      // Ajustar fechas para zona horaria boliviana (UTC-4)
      const fechaInicioBolivia = new Date(filtros.fechaInicio);
      const fechaFinBolivia = new Date(filtros.fechaFin);
      
      // Ajustar para que sea UTC-4
      fechaInicioBolivia.setHours(fechaInicioBolivia.getHours() - 4);
      fechaFinBolivia.setHours(fechaFinBolivia.getHours() - 4);
      
      // Asegurarse de que las fechas estén en formato YYYY-MM-DD
      const fechaInicioStr = fechaInicioBolivia.toISOString().split('T')[0];
      const fechaFinStr = fechaFinBolivia.toISOString().split('T')[0];
      
      const response = await axios.get(
        `http://localhost:4000/api/reporte/prestamos`,
        {
          params: {
            fechaInicio: fechaInicioStr,
            fechaFin: fechaFinStr,
            estado: filtros.estado || null
          },
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          }
        }
      );
      if (response.data?.success) {
        setDatos(response.data.data || []);
        setDatosFiltrados(response.data.data || []);
        setMensaje(`Se encontraron ${response.data.data?.length || 0} registros`);
      } else {
        throw new Error(response.data.message || 'Error al cargar el reporte');
      }
    } catch (error) {
      setMensaje(error.response?.data?.message || 'Error al cargar el reporte: ' + error.message);
      setDatos([]);
      setDatosFiltrados([]);
    } finally {
      setCargando(false);
    }
  };
  const filtrarDatos = (textoBusqueda) => {
    if (!textoBusqueda.trim()) {
      setDatosFiltrados(datos);
      return;
    }
    const texto = textoBusqueda.toLowerCase();
    const filtrados = datos.filter(item => 
      item.nombre_estudiante?.toLowerCase().includes(texto) ||
      item.apellido_estudiante?.toLowerCase().includes(texto) ||
      item.registro_estudiante?.toLowerCase().includes(texto) ||
      item.material?.toLowerCase().includes(texto) ||
      item.docente?.toLowerCase().includes(texto) ||
      item.materia?.toLowerCase().includes(texto)
    );
    
    setDatosFiltrados(filtrados);
  };
  const manejarFiltros = (nuevosFiltros) => {
    setFiltros(prev => ({
      ...prev,
      ...nuevosFiltros
    }));
  };

  // Manejar búsqueda
  const manejarBusqueda = (textoBusqueda) => {
    setFiltros(prev => ({
      ...prev,
      busqueda: textoBusqueda
    }));
     filtrarDatos(textoBusqueda);
  };

    
  return (
    <div className="min-h-screen max-w-6xl mx-auto p-6 space-y-6">
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
      <div className="p-6 max-w-6xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
          <RiFileExcel2Line  className="w-6 h-6 text-red-600 " />
          <h1 className="text-2xl font-bold text-gray-800"> Reporte de Préstamos</h1>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row lg:items-end gap-4 mb-6">
          <div className="flex-1">
            <ReporteBusqueda 
              filtros={filtros}  
              onFiltrosChange={manejarFiltros}  
              mensaje={mensaje}  
              onBuscar={cargarReporte}   
              onBusquedaChange={manejarBusqueda}    
              cargando={cargando}  
              setMensaje={setMensaje}
            />
          </div>
           {/* Botón de Excel alineado con el botón Buscar */}
          <div className="lg:pb-0 lg:ml-2">
            <ReporteExportar datos={datosFiltrados} filtros={filtros} />
          </div>
        </div>

        {mensaje && (
          <div className={`mb-4 p-4 rounded-lg border ${
            mensaje.includes('Error') 
              ? 'bg-red-50 border-red-200 text-red-700' 
              : 'bg-gray-50 border-gray-200 text-gray-700'
          }`}>
            {mensaje}
          </div>
        )}
        <ReporteTabla datos={datosFiltrados || []} cargando={cargando} />
    </div>
   </div>

);
}
