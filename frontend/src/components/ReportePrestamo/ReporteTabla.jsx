export default function ReporteTabla({ datos, cargando }) {
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
  if (cargando) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
        <div className="flex justify-center items-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
          <span className="ml-3 text-gray-600">Cargando datos...</span>
        </div>
            </div>
    );
  }

  if (datos.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
        <div className="text-center text-gray-500">
          <h3 className="text-lg font-medium mb-2">No se encontraron datos</h3>
          <p>Selecciona un rango de fechas y presiona "Buscar" para ver los resultados</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-auto mt-4">
      <div className="overflow-x-auto">   </div>
      <table className="min-w-full divide-y divide-gray-200 text-sm ">
        <thead className="bg-gray-100">
                <tr>
<th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">Estudiante</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">Registro</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">Docente</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">Materia</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">Módulo</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">Semestre</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">Material</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">Código Material</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">Cantidad</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">Devuelto</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">Estado</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">Fecha Préstamo</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">Fecha Devolución</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">Entregado Por</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">Recibido Por</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">Observaciones</th>
                </tr>
              </thead>
        <tbody className="divide-y divide-gray-100 bg-white">
          {datos.map((item) =>
            item.detalles.map((detalle, i) => (
              <tr key={`${item.id_prestamo}-${i}`} className="hover:bg-gray-50">
                <td className="px-4 py-3 text-gray-900">
                   {item.estudiante?.nombres} {item.estudiante?.apellidos}
                </td>
                 <td className="px-4 py-3 text-gray-900">
                    {item.estudiante?.Registro || 'N/A'}
                </td>

                <td className="px-4 py-3 text-gray-900">
                  {item.docente?.nombres
                    ? `${item.docente.nombres} ${item.docente.apellidos}`
                    : "N/A"}
                </td>
                <td className="px-4 py-3 text-gray-900">
                  {item.materia?.nombre || "N/A"}
                </td>
                <td className="px-4 py-3 text-gray-900">
                  {item.modulo?.id_modulo || "N/A"}
                </td>
                <td className="px-4 py-3 text-gray-900">
                  {item.semestre?.id_semestre || "N/A"}
                </td>
                <td className="px-4 py-3 text-gray-900">
                  {detalle.material?.nombre || "N/A"}
                </td>
                <td className="px-4 py-3 text-gray-900">
                  {detalle.material?.codigo_material || "N/A"}
                </td>
                <td className="px-4 py-3 text-gray-900">{detalle.cantidad}</td>
                <td className="px-4 py-3 text-gray-900">
                  {detalle.cantidad_devuelta}
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full border ${obtenerClaseEstado(
                      item.estado?.id_estado
                    )}`}
                  >
                    {obtenerTextoEstado(item.estado?.id_estado)}
                  </span>
                </td>
                <td className="px-4 py-3 text-gray-900">
                  {formatearFecha(item.fecha_prestamo)}
                </td>
                <td className="px-4 py-3 text-gray-900">
                  {formatearFecha(detalle.fecha_devolucion)}
                </td>
                <td className="px-4 py-3 text-gray-900">
                  {item.usuario_entrega
                    ? `${item.usuario_entrega.nombres} ${item.usuario_entrega.apellidos}`
                    : "N/A"}
                </td>
                <td className="px-4 py-3 text-gray-900">
                  {detalle.usuario_recibe?.nombres
                    ? `${detalle.usuario_recibe.nombres} ${detalle.usuario_recibe.apellidos}`
                    : "N/A"}
                </td>
                <td className="px-4 py-3 text-gray-900">
                  {item.observaciones || 'N/A'}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}