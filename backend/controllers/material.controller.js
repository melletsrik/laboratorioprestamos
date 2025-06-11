const MaterialService = require("../services/material.service");

exports.getAll = async (req, res) => {
  const result = await MaterialService.getAll();

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
  });
};

exports.create = async (req, res) => {
  // Validación básica de campos requeridos
  if (
    !req.body.codigo_material ||
    !req.body.nombre ||
    !req.body.cantidad_total
  ) {
    return res.status(400).json({
      success: false,
      message:
        "Faltan campos obligatorios: codigo_material, nombre, cantidad_total",
    });
  }

  const result = await MaterialService.create(req.body);

  if (!result.success) {
    return res.status(400).json({
      success: false,
      message: result.message,
      error: result.error || "Error desconocido",
    });
  }

  res.status(201).json({
    success: true,
    data: result.data,
    message: result.message,
  });
};

exports.getById = async (req, res, next) => {
  try {
    const material = await MaterialService.getById(req.params.id);
    if (!material) {
      return res.status(404).json({ message: "Material no encontrado" });
    }
    res.json(material);
  } catch (error) {
    next(error);
  }
};

exports.getByCode = async (req, res, next) => {
  try {
    const material = await MaterialService.getByCode(req.params.codigo);
    if (!material) {
      return res.status(404).json({ message: "Material no encontrado" });
    }
    res.json(material);
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

exports.delete = async (req, res, next) => {
  try {
    await MaterialService.delete(req.params.id);
    res.status(204).end();
  } catch (error) {
    next(error);
  }
};
