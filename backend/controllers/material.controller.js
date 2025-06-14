const MaterialService = require("../services/material.service");

exports.getAll = async (req, res) => {
  try {
    const result = await MaterialService.getAll();
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
    if (!req.body.codigo_material || !req.body.nombre) {
      return res.status(400).json({
        success: false,
        message: "Datos incompletos"
      });
    }

    const result = await MaterialService.create(req.body);
    res.status(result.success ? 201 : 400).json(result);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error del servidor"
    });
  }
};

exports.getByCode = async (req, res) => {
  try {
    const result = await MaterialService.getByCode(req.params.codigo);
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

    const result = await MaterialService.getByName(nombre);
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
    const result = await MaterialService.update(req.params.id, req.body);
    res.status(result.success ? 200 : 400).json(result);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error del servidor"
    });
  }
};