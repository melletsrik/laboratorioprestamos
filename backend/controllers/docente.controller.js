const DocenteService = require("../services/docente.service");

exports.getAll = async (req, res) => {
  try {
    const result = await DocenteService.getAll();
    res.status(result.success ? 200 : 400).json(result);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error del servidor"
    });
  }
};

exports.create = async (req, res) => {
  try {
    if (!req.body.nombre || !req.body.apellido) {
      return res.status(400).json({
        success: false,
        message: "Nombre y apellido son requeridos"
      });
    }

    const result = await DocenteService.create(req.body);
    res.status(result.success ? 201 : 400).json(result);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error del servidor"
    });
  }
};

exports.getByName = async (req, res) => {
  try {
    const { nombre } = req.query;
    
    if (!nombre) {
      return res.status(400).json({
        success: false,
        message: "Nombre requerido"
      });
    }

    const result = await DocenteService.getByName(nombre);
    res.status(result.success ? 200 : 404).json(result);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error del servidor"
    });
  }
};

exports.update = async (req, res) => {
  try {
    const result = await DocenteService.update(req.params.id, req.body);
    res.status(result.success ? 200 : 404).json(result);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error del servidor"
    });
  }
};