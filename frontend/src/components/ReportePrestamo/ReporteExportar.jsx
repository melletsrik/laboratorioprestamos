import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import React from "react";

export default function ReporteExportar({ datos, filtros }) {
  if (datos.length === 0) return null;

  const exportarExcel = () => {
    if (!datos || datos.length === 0) {
      alert("No hay datos que exportar");
      return;
    }
 const encabezados = [
  'Estudiante',
  'Registro',
  'Docente',
  'Materia',
  'Módulo',
  'Semestre',
  'Material',
  'Código Material',
  'Cantidad',
  'Devuelto',
  'Estado',
  'Fecha Préstamo',
  'Descripción Préstamo',
  'Fecha Devolución',
  'Descripción Devolución',
  'Entregado Por',
  'Recibido Por',
  'Observaciones'
];
// Convertir datos a formato CSV
    const filas = [];

datos.forEach(item => {
   item.detalles.forEach((detalle) => {
      filas.push({
        Estudiante: `${item.estudiante?.nombres || ''} ${item.estudiante?.apellidos || ''}`,
        Registro: item.estudiante?.Registro || 'N/A',
        Docente: item.docente?.nombres ? `${item.docente.nombres} ${item.docente.apellidos}` : 'N/A',
        Materia: item.materia?.nombre || 'N/A',
        Módulo: item.modulo?.id_modulo || 'N/A',
        Semestre: item.semestre?.id_semestre || 'N/A',
        Material: detalle.material?.nombre || 'N/A',
        Código_Material: detalle.material?.codigo_material || 'N/A',
        Cantidad: detalle.cantidad,
        Devuelto: detalle.cantidad_devuelta,
        Estado: obtenerTextoEstado(item.estado?.id_estado),
        Fecha_Préstamo: new Date(item.fecha_prestamo).toLocaleString(),
        Descripción_Prestamo: item.descripcion_prestamo || 'N/A',
        Fecha_Devolución: detalle.fecha_devolucion
          ? new Date(detalle.fecha_devolucion).toLocaleString()
          : 'N/A',
        Descripción_Devolución: detalle.descripcion_devolucion || 'N/A',
        Entregado_Por: `${item.usuario_entrega?.nombres || ''} ${item.usuario_entrega?.apellidos || ''}`,
        Recibido_Por: detalle.usuario_recibe
          ? `${detalle.usuario_recibe.nombres} ${detalle.usuario_recibe.apellidos}`
          : 'N/A',
        Observaciones: obtenerTextoObservacion(item.observacion)
      });
    });
  });



    // Convertir los datos a formato compatible con XLSX
    const datosExcel = filas.map(fila => {
      return [
        fila.Estudiante,
        fila.Registro,
        fila.Docente,
        fila.Materia,
        fila.Módulo,
        fila.Semestre,
        fila.Material,
        fila.Código_Material,
        fila.Cantidad,
        fila.Devuelto,
        fila.Estado,
        fila.Fecha_Préstamo,
        fila.Descripción_Prestamo,
        fila.Fecha_Devolución,
        fila.Descripción_Devolución,
        fila.Entregado_Por,
        fila.Recibido_Por,
        fila.Observaciones
      ];
    });

    // Crear el archivo Excel
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.aoa_to_sheet([encabezados, ...datosExcel]);
    XLSX.utils.book_append_sheet(wb, ws, 'Reporte');

    // Generar el nombre del archivo
    const fechaActual = new Date().toISOString().split('T')[0];
    const rangoFechas = `${filtros.fechaInicio}_${filtros.fechaFin}`;
    const nombreArchivo = `reporte_prestamos_${rangoFechas}_${fechaActual}.xlsx`;

    // Descargar el archivo
    XLSX.writeFile(wb, nombreArchivo);
  };

  // Formatear fecha para Excel
  const formatearFechaExcel = (fecha) => {
    if (!fecha) return '';
    return new Date(fecha).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Obtener texto de estado
const obtenerTextoEstado = (estadoId) => {
  switch (estadoId) {
    case 1: return 'Prestado';
    case 2: return 'Parcial';
    case 3: return 'Devuelto';
    default: return 'N/A';
  }
};

  return (
      <button
        onClick={exportarExcel}
        className={`flex items-center px-3 py-1.5 rounded-md font-medium transition-colors ${
          datos.length === 0
            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
            : 'bg-green-600 hover:bg-green-700 text-white'
        }`}
        disabled={datos.length === 0}
      >
        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        Exportar Excel
      </button>
     
  
  );
}