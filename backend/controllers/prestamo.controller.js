const PrestamoService = require("../services/prestamo.service");

exports.getAll = async (req, res) => {
  try {
    const result = await PrestamoService.getAll();
    res.status(result.success ? 200 : 400).json(result);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error del servidor"
    });
  }
};

exports.getById = async (req, res) => {
  try {
    const result = await PrestamoService.getById(req.params.id);
    res.status(result.success ? 200 : 404).json(result);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error del servidor"
    });
  }
};

exports.create = async (req, res) => {
  try {
    // Validación básica
    if (!req.body.id_estudiante || !req.body.id_usuario_entrega || !req.body.detalles || req.body.detalles.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Datos incompletos para crear préstamo"
      });
    }

    const result = await PrestamoService.create(req.body);
    res.status(result.success ? 201 : 400).json(result);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error del servidor"
    });
  }
};

exports.registrarDevolucion = async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!req.body.id_usuario_recibe || !req.body.detalles || req.body.detalles.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Datos incompletos para registrar devolución"
      });
    }

    const result = await PrestamoService.registrarDevolucion(id, req.body);
    res.status(result.success ? 200 : 400).json(result);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error del servidor"
    });
  }
};

exports.getByEstudiante = async (req, res) => {
  try {
    const result = await PrestamoService.getByEstudiante(req.params.idEstudiante);
    res.status(result.success ? 200 : 404).json(result);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error del servidor"
    });
  }
};

exports.getActivos = async (req, res) => {
  try {
    const result = await PrestamoService.getActivos();
    res.status(result.success ? 200 : 400).json(result);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error del servidor"
    });
  }
};

exports.getByMaterial = async (req, res) => {
  try {
    const result = await PrestamoService.getByMaterial(req.params.idMaterial);
    res.status(result.success ? 200 : 404).json(result);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error del servidor"
    });
  }
};