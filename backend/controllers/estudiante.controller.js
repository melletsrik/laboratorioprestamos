const EstudianteService = require("../services/estudiante.service");

exports.getAll = async (req, res) => {
  try {
    const result = await EstudianteService.getAll();
    res.status(result.success ? 200 : 400).json(result);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error del servidor",
    });
  }
};

exports.create = async (req, res) => {
  try {
    if (!req.body.nombre || !req.body.apellido || !req.body.registro) {
      return res.status(400).json({
        success: false,
        message: "Datos incompletos",
      });
    }

    const result = await EstudianteService.create(req.body);
    res.status(result.success ? 201 : 400).json(result);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error del servidor",
    });
  }
};

exports.getByName = async (req, res) => {
  try {
    const { nombre } = req.query;

    if (!nombre) {
      return res.status(400).json({
        success: false,
        message: "Nombre requerido",
      });
    }

    const result = await EstudianteService.getByName(nombre);
    res.status(result.success ? 200 : 404).json(result);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error del servidor",
    });
  }
};

exports.update = async (req, res) => {
  try {
    const result = await EstudianteService.update(req.params.id, req.body);
    res.status(result.success ? 200 : 404).json(result);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error del servidor",
    });
  }
};

exports.getByRegister = async (req, res) => {
  try {
    const { registro } = req.query;

    if (!registro) {
      return res.status(400).json({
        success: false,
        message: "Registro requerido",
      });
    }

    const result = await EstudianteService.getByRegister(registro);
    res.status(result.success ? 200 : 404).json(result);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error del servidor",
    });
  }
};
