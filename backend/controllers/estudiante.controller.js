const EstudianteService = require("../services/estudiante.service");

exports.getAll = async (req, res) => {
  try {
    const result = await EstudianteService.getAll();
    res.status(200).json({
      success: true,
      data: result.data,
      message: result.message,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Error al obtener estudiantes",
      message: error.message,
    });
  }
};

exports.create = async (req, res) => {
  try {
    const result = await EstudianteService.create(req.body);

    if (!result.success) {
      return res.status(400).json({
        success: false,
        error: result.error,
        message: result.message,
      });
    }

    res.status(201).json({
      success: true,
      data: result.data,
      message: result.message,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Error al crear estudiante",
      message: error.message,
    });
  }
};

exports.getByName = async (req, res) => {
  try {
    const { nombre } = req.query;
    if (!nombre) {
      return res.status(400).json({
        success: false,
        error: "El parámetro 'nombre' es requerido",
      });
    }

    const result = await EstudianteService.getByName(nombre);

    if (!result.success) {
      return res.status(404).json({
        success: false,
        error: result.error,
        message: result.message,
      });
    }

    res.status(200).json({
      success: true,
      data: result.data,
      message: result.message,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Error al buscar estudiantes por nombre",
      message: error.message,
    });
  }
};

exports.update = async (req, res) => {
  try {
    const result = await EstudianteService.update(req.params.id, req.body);

    if (!result.success) {
      return res
        .status(result.error === "Estudiante no encontrado" ? 404 : 400)
        .json({
          success: false,
          error: result.error,
          message: result.message,
        });
    }

    res.status(200).json({
      success: true,
      data: result.data,
      message: result.message,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Error al actualizar estudiante",
      message: error.message,
    });
  }
};

exports.getByRegister = async (req, res) => {
  try {
    const { registro } = req.query;
    if (!registro) {
      return res.status(400).json({
        success: false,
        error: "El parámetro 'registro' es requerido",
      });
    }

    const result = await EstudianteService.getByRegister(registro);

    if (!result.success) {
      return res.status(404).json({
        success: false,
        error: result.error,
        message: result.message,
      });
    }

    res.status(200).json({
      success: true,
      data: result.data,
      message: result.message,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Error al buscar estudiantes por registro",
      message: error.message,
    });
  }
};
