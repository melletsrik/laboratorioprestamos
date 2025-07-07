import { IoMdSearch } from "react-icons/io";
import { useState, useEffect } from "react";

export default function ReporteBusqueda({
  filtros,
  onFiltrosChange,
  onBuscar,
  cargando,
  setMensaje, setFiltros
}) {
  const [localError, setLocalError] = useState(null);
  const fechaActual = new Date().toISOString().split('T')[0];

  // Validate date range
    // Add this useEffect right after the cargarReporte function
  useEffect(() => {
    // Set default date range to last 30 days
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 30);
    
    setFiltros(prev => ({
      ...prev,
      fechaInicio: startDate.toISOString().split('T')[0],
      fechaFin: endDate.toISOString().split('T')[0]
    }));
  }, []);


  const handleSearch = (e) => {
    e?.preventDefault();
    if (localError) {
      setMensaje(localError);
      return;
    }
    if (!filtros.fechaInicio || !filtros.fechaFin) {
      setMensaje('Por favor selecciona un rango de fechas');
      return;
    }
    onBuscar();
  };

  const establecerRangoRapido = (tipo) => {
    const hoy = new Date();
    let fechaInicio, fechaFin;
    
    // Set time to beginning of day
    hoy.setHours(0, 0, 0, 0);
    
    switch (tipo) {
      case 'mes':
        fechaInicio = new Date(hoy.getFullYear(), hoy.getMonth(), 1);
        fechaFin = new Date(hoy);
        break;
      case 'modular': // 3 meses
        fechaInicio = new Date(hoy.getFullYear(), hoy.getMonth() - 2, 1);
        fechaFin = new Date(hoy);
        break;
      case 'semestral': // 6 meses
        fechaInicio = new Date(hoy.getFullYear(), hoy.getMonth() - 5, 1);
        fechaFin = new Date(hoy);
        break;
      case 'anual':
        fechaInicio = new Date(hoy.getFullYear(), 0, 1);
        fechaFin = new Date(hoy);
        break;
      default:
        return;
    }

    // Format dates as YYYY-MM-DD
    const formatDate = (date) => date.toISOString().split('T')[0];
    
    onFiltrosChange({
      fechaInicio: formatDate(fechaInicio),
      fechaFin: formatDate(fechaFin)
    });
  };

  return (
    <form onSubmit={handleSearch} className="w-full max-w-3xl">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label 
            htmlFor="fechaInicio" 
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Desde
          </label>
          <input
            id="fechaInicio"
            type="date"
            value={filtros.fechaInicio || ''}
            onChange={(e) => onFiltrosChange({ fechaInicio: e.target.value })}
            max={fechaActual}
            className={`w-full px-4 py-2 border rounded-md ${
              localError ? 'border-red-500' : 'border-gray-300'
            }`}
            aria-invalid={!!localError}
            aria-describedby={localError ? "date-error" : undefined}
          />
        </div>
        <div>
          <label 
            htmlFor="fechaFin" 
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Hasta
          </label>
          <input
            id="fechaFin"
            type="date"
            value={filtros.fechaFin || ''}
            onChange={(e) => onFiltrosChange({ fechaFin: e.target.value })}
            max={fechaActual}
            min={filtros.fechaInicio}
            className={`w-full px-4 py-2 border rounded-md ${
              localError ? 'border-red-500' : 'border-gray-300'
            }`}
            aria-invalid={!!localError}
            aria-describedby={localError ? "date-error" : undefined}
          />
        </div>
        <div className="flex items-end gap-4">
          <button
            type="submit"
            disabled={cargando || !!localError}
            className="bg-red-600 text-white px-6 py-2 rounded-md hover:bg-red-700 disabled:bg-red-300 disabled:cursor-not-allowed flex items-center justify-center gap-2 min-w-[120px] transition-colors"
            aria-busy={cargando}
          >
            <IoMdSearch className="w-5 h-5" />
            {cargando ? 'Cargando...' : 'Buscar'}
          </button>
        </div>
      </div>

      {localError && (
        <p id="date-error" className="mt-2 text-sm text-red-600">
          {localError}
        </p>
      )}

      {/* Quick Date Ranges */}
      <fieldset className="mt-4">
        <legend className="sr-only">Rangos rápidos de fechas</legend>
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm font-medium text-gray-700">Rangos rápidos:</span>
          {[
            { id: 'mes', label: 'Último mes' },
            { id: 'modular', label: 'Modular (3 meses)' },
            { id: 'semestral', label: 'Semestral (6 meses)' },
            { id: 'anual', label: 'Anual' }
          ].map(({ id, label }) => (
            <button
              key={id}
              type="button"
              onClick={(e) => {
                e.preventDefault();
                establecerRangoRapido(id);
              }}
              disabled={cargando}
              className="px-3 py-1 text-xs bg-white hover:bg-gray-50 border border-gray-300 rounded-full text-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {label}
            </button>
          ))}
        </div>
      </fieldset>
    </form>
  );
}