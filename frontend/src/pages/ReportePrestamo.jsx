import { useEffect, useState } from "react";
import axios from "axios";
import ReporteBusqueda from "../components/ReportePrestamo/ReporteBusqueda";
import ReporteTabla from "../components/ReportePrestamo/ReporteTabla";
import ReporteExportar from "../components/ReportePrestamo/ReporteExportar";

export default function VentanaReporte() {
  const [datos, setDatos] = useState([]);
  const [datosFiltrados, setDatosFiltrados] = useState([]);
  const [cargando, setCargando] = useState(false);
  const [mensaje, setMensaje] = useState('');
  const [filtros, setFiltros] = useState({
    fechaInicio: '',
    fechaFin: '',
    estado: 'todos',
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
      const response = await axios.get(
        `http://localhost:4000/api/reporte`,
        {
          params: {
            fechaInicio: filtros.fechaInicio,
            fechaFin: filtros.fechaFin,
            estado: filtros.estado
          },
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
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
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <h1 className="text-2xl font-bold text-gray-800">📊 Reporte de Préstamos</h1>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex-1">
            <ReporteBusqueda filtros={filtros}  onFiltrosChange={manejarFiltros}   onBuscar={cargarReporte}   onBusquedaChange={manejarBusqueda}    cargando={cargando}  />
          </div>
          <div className="flex items-center">
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
        <ReporteTabla datos={datosFiltrados} cargando={cargando} />
    </div>
   </div>
  );
}
