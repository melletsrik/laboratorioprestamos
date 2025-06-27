const PrestamoService = require("../services/prestamo.service");

exports.getReportePrestamos = async (req, res) => {
  try {
    const { fechaInicio, fechaFin, periodo, estado } = req.query;
    
    // Validar parámetros
    if (!fechaInicio || !fechaFin) {
      return res.status(400).json({
        success: false,
        message: "Se requieren fechaInicio y fechaFin"
      });
    }

    // Validar formato de fechas
    const fechaInicioValida = new Date(fechaInicio);
    const fechaFinValida = new Date(fechaFin);
    
    if (isNaN(fechaInicioValida) || isNaN(fechaFinValida)) {
      return res.status(400).json({
        success: false,
        message: "Formato de fecha inválido"
      });
    }

    // Obtener préstamos con los filtros necesarios
    const result = await PrestamoService.getReportePrestamos({
      fechaInicio,
      fechaFin,
      periodo,
      estado
    });

    res.status(result.success ? 200 : 400).json(result);
  } catch (error) {
    console.error("Error en getReportePrestamos:", error);
    res.status(500).json({
      success: false,
      message: "Error del servidor al obtener el reporte"
    });
  }
};
