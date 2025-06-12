const DocenteService = require("../services/docente.service");

exports.getAll = async (req, res) => {
  try {
    const result = await DocenteService.getAll();
    res.status(200).json({
      success: true,
      data: result.data,
      message: result.message,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Error al obtener docentes",
      message: error.message,
    });
  }
};

exports.create = async (req, res) => {
  try {
    const result = await DocenteService.create(req.body);

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
      error: "Error al crear docente",
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

    const result = await DocenteService.getByName(nombre);

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
      error: "Error al buscar docentes por nombre",
      message: error.message,
    });
  }
};

exports.update = async (req, res) => {
  try {
    const result = await DocenteService.update(req.params.id, req.body);

    if (!result.success) {
      return res
        .status(result.error === "Docente no encontrado" ? 404 : 400)
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
      error: "Error al actualizar docente",
      message: error.message,
    });
  }
};
