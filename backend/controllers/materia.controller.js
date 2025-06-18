const MateriaService = require("../services/materia.service");

exports.getAll = async (req, res) => {
  try {
    const result = await MateriaService.getAll();
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
    if (!req.body.nombre || !req.body.id_carrera) {
      return res.status(400).json({
        success: false,
        message: "Nombre y carrera son requeridos"
      });
    }

    const result = await MateriaService.create(req.body);
    res.status(result.success ? 201 : 400).json(result);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error del servidor"
    });
  }
};

exports.getById = async (req, res) => {
  try {
    const result = await MateriaService.getById(req.params.id);
    res.status(result.success ? 200 : 404).json(result);
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

    const result = await MateriaService.getByName(nombre);
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
    const result = await MateriaService.update(req.params.id, req.body);
    res.status(result.success ? 200 : 400).json(result);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error del servidor"
    });
  }
};