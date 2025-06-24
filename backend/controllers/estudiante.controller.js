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

exports.addMateria = async (req, res) => {
    try {
        const { idDocenteMateria, modulo, semestre } = req.body;
        
        // Validación más estricta
        if (!idDocenteMateria || !modulo || !semestre) {
            return res.status(400).json({
                success: false,
                message: "Todos los campos son requeridos: idDocenteMateria, modulo, semestre",
                details: {
                    recibido: req.body,
                    requerido: {
                        idDocenteMateria: "number",
                        modulo: "number (1-12)",
                        semestre: "number (ej. 2023)"
                    }
                }
            });
        }

        const result = await EstudianteService.addMateria(
            req.params.id, 
            idDocenteMateria, 
            modulo, 
            semestre
        );
        
        res.status(result.success ? 200 : 400).json(result);
    } catch (error) {
        console.error("Error en controller addMateria:", error);
        res.status(500).json({
            success: false,
            message: "Error interno del servidor al procesar la solicitud",
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};
exports.getMaterias = async (req, res) => {
    try {
        const result = await EstudianteService.getMaterias(req.params.id);
        res.status(result.success ? 200 : 404).json(result);
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error del servidor"
        });
    }
};