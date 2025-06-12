const DocenteService = require('../services/docente.service');

exports.getAll = async (req, res) => {
  const result = await DocenteService.getAll();
  
  if (!result.success) {
    return res.status(400).json({
      error: result.error
    });
  }

  res.json(result.data);
};

exports.getById = async (req, res) => {
  const result = await DocenteService.getById(req.params.id);
  
  if (!result.success) {
    return res.status(result.error === 'Docente no encontrado' ? 404 : 400).json({
      error: result.error
    });
  }

  res.json(result.data);
};

exports.create = async (req, res) => {
  // Validación básica
  if (!req.body.nombre || !req.body.apellido) {
    return res.status(400).json({
      error: 'Nombre y apellido son requeridos'
    });
  }

  const result = await DocenteService.create(req.body);
  
  if (!result.success) {
    return res.status(400).json({
      error: result.error
    });
  }

  res.status(201).json(result.data);
};

// Más métodos según necesidades...