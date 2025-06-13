const MaterialService = require("../services/material.service");

exports.getAll = async (req, res) => {
  try {
    const result = await MaterialService.getAll();
    res.json({
      success: true,
      data: result.data,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

exports.create = async (req, res) => {
  try {
    // El middleware ya validó que el usuario tiene rol adecuado
    const result = await MaterialService.create(req.body);
    res.status(201).json({
      success: true,
      data: result.data,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
};

exports.getByCode = async (req, res, next) => {
  try {
    const result = await MaterialService.getByCode(req.params.codigo);
    if (!result.success) {
      return res.status(404).json({
        success: false,
        message: result.message || "Material no encontrado",
        error: result.error,
      });
    }
    res.json(result);
  } catch (error) {
    next(error);
  }
};

exports.getByName = async (req, res) => {
  const { nombre } = req.query;

  if (!nombre || nombre.trim() === "") {
    return res.status(400).json({
      success: false,
      message: 'El parámetro de búsqueda "nombre" es requerido',
    });
  }

  const result = await MaterialService.getByName(nombre);

  if (!result.success) {
    return res.status(400).json({
      success: false,
      message: result.message,
      error: result.error,
    });
  }

  res.status(200).json({
    success: true,
    data: result.data,
    message: result.message,
    searchTerm: nombre,
  });
};

exports.update = async (req, res, next) => {
  try {
    const materialActualizado = await MaterialService.update(
      req.params.id,
      req.body
    );
    if (!materialActualizado) {
      return res.status(404).json({ message: "Material no encontrado" });
    }
    res.json(materialActualizado);
  } catch (error) {
    next(error);
  }
};
