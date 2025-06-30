const ReporteService = require("../services/reporte.service");

exports.getReportePrestamos = async (req, res) => {
  try {
    const { fechaInicio, fechaFin, estado } = req.query;
    
    // Validar parámetros
    if (!fechaInicio || !fechaFin) {
      return res.status(400).json({
        success: false,
        message: "Se requieren fechaInicio y fechaFin"
      });
    }

    // Pasar parámetros al servicio
    const result = await ReporteService.getReportePrestamos({
      fechaInicio,
      fechaFin,
      estado: estado || null
    });

    res.status(result.success ? 200 : 400).json(result);
  } catch (error) {
    console.error("Error completo en controlador:", {
      error: error,
      stack: error.stack,
      message: error.message
    });
    res.status(500).json({
      success: false,
      message: "Error del servidor al obtener el reporte",
      error: error.message  // Agregamos el mensaje de error
    });
  }
};