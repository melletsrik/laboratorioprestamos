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
 const encabezados = ['ID Préstamo', 'Asistente que Entrega', 'Asistente que Recepciona', 'Registro',  'Apellido', 'Nombre', 'Módulo',  'Materia', 'Docente','Fecha Entrega','Fecha Recepción','Material', 'Cantidad', 'Estado',  'Observaciones'  ];
  // Convertir datos a formato CSV
    const filas = datos.map(item => [
      item.id_prestamo || '',
      item.nombre_asistente_entrega || '',
      item.nombre_asistente_recepcion || '',
      item.registro_estudiante || '',
      item.apellido_estudiante || '',
      item.nombre_estudiante || '',
      item.modulo || '',
      item.materia || '',
      item.docente || '',
      formatearFechaExcel(item.fecha_entrega),
      formatearFechaExcel(item.fecha_recepcion),
      item.material || '',
      item.cantidad || '',
      obtenerTextoEstado(item.estado),
      item.observaciones || ''
    ]);

    // Crear el archivo Excel
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.aoa_to_sheet([encabezados, ...filas]);
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
  const obtenerTextoEstado = (estado) => {
    switch (estado?.toLowerCase()) {
      case 'prestado':
        return 'Prestado';
      case 'devuelto':
        return 'Devuelto';
      case 'parcial':
        return 'Parcialmente Devuelto';
      default:
        return 'N/A';
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
        Excel
      </button>
     
  
  );
}