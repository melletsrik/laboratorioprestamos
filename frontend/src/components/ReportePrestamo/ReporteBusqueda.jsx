import { IoMdSearch } from "react-icons/io";
import ReporteExportar from "./ReporteExportar";

export default function ReporteBusqueda({filtros, onFiltrosChange, onBuscar, cargando, setMensaje}) {
  // Obtener fecha actual para límites
  const fechaActual = new Date().toISOString().split('T')[0];

  // Funciones para rangos rápidos
  const establecerRangoRapido = (tipo) => {
    const hoy = new Date();
    let fechaInicio, fechaFin;
    
    switch (tipo) {
      case 'mes':
        fechaInicio = new Date(hoy.getFullYear(), hoy.getMonth(), 1);
        fechaFin = hoy;
        break;
      case 'modular': // 3 meses
        fechaInicio = new Date(hoy.getFullYear(), hoy.getMonth() - 3, 1);
        fechaFin = hoy;
        break;
      case 'semestral': // 6 meses
        fechaInicio = new Date(hoy.getFullYear(), hoy.getMonth() - 6, 1);
        fechaFin = hoy;
        break;
      case 'anual':
        fechaInicio = new Date(hoy.getFullYear(), 0, 1);
        fechaFin = hoy;
        break;
      default:
        return;
    }

    onFiltrosChange({
      fechaInicio: fechaInicio.toISOString().split('T')[0],
      fechaFin: fechaFin.toISOString().split('T')[0]
    });
  };

  return (
    <form className="w-full max-w-3xl">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Desde</label>
          <input
            type="date"
            value={filtros.fechaInicio}
            onChange={(e) => onFiltrosChange({ fechaInicio: e.target.value })}
            max={fechaActual}
            className="w-full px-4 py-2 border rounded-md"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Hasta</label>
          <input
            type="date"
            value={filtros.fechaFin}
            onChange={(e) => onFiltrosChange({ fechaFin: e.target.value })}
            max={fechaActual}
            className="w-full px-4 py-2 border rounded-md"
          />
        </div>
        <div className="flex items-end gap-4">
           <button
            type="button"
            onClick={() => {
              if (filtros.fechaInicio && filtros.fechaFin) {
                onBuscar();
              } else {
                setMensaje('Por favor selecciona un rango de fechas');
              }
            }}
            disabled={cargando}
            className="bg-red-600 text-white px-6 py-2 rounded-md hover:bg-red-700 disabled:bg-red-400 disabled:cursor-not-allowed flex items-center justify-center gap-2 min-w-[120px]"
          >
            <IoMdSearch />
            {cargando ? 'Cargando...' : 'Buscar'}
          </button>
        </div>
      </div>

      {filtros.mensaje && (
        <div className="mt-4 p-4 bg-blue-50 text-blue-700 rounded-md">
          {filtros.mensaje}
        </div>
      )}

      {/* Rangos Rápidos */}
      <div className="flex flex-wrap gap-2 mt-4">
        <span className="text-sm font-medium text-gray-700 mr-2">Rangos rápidos:</span>
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            establecerRangoRapido('mes');
          }}
          className="px-3 py-1 text-xs bg-gray-100 hover:bg-gray-200 border border-gray-300 rounded-full text-gray-700 transition-colors"
        >
          Último mes
        </button>
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            establecerRangoRapido('modular');
          }}
          className="px-3 py-1 text-xs bg-gray-100 hover:bg-gray-200 border border-gray-300 rounded-full text-gray-700 transition-colors"
        >
          Modular (3 meses)
        </button>
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            establecerRangoRapido('semestral');
          }}
          className="px-3 py-1 text-xs bg-gray-100 hover:bg-gray-200 border border-gray-300 rounded-full text-gray-700 transition-colors"
        >
          Semestral (6 meses)
        </button>
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            establecerRangoRapido('anual');
          }}
          className="px-3 py-1 text-xs bg-gray-100 hover:bg-gray-200 border border-gray-300 rounded-full text-gray-700 transition-colors"
        >
          Anual
        </button>
      </div>
    </form>
  );
}
