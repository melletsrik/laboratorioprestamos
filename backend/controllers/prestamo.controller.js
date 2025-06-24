const PrestamoService = require("../services/prestamo.service");

exports.getAll = async (req, res) => {
  try {
    const result = await PrestamoService.getAll();
    res.status(result.success ? 200 : 400).json(result);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error del servidor al obtener préstamos",
    });
  }
};

exports.getById = async (req, res) => {
  try {
    const result = await PrestamoService.getById(req.params.id);
    res.status(result.success ? 200 : 404).json(result);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error del servidor al buscar préstamo",
    });
  }
};

exports.create = async (req, res) => {
  try {
    // Validación básica
    if (
      !req.body.id_estudiantes_materia ||
      !req.body.id_usuario_entrega ||
      !req.body.fecha_prestamo ||
      !req.body.id_estado ||
      !req.body.detalles
    ) {
      return res.status(400).json({
        success: false,
        message: "Datos incompletos para crear préstamo",
      });
    }

    const result = await PrestamoService.create(req.body);
    res.status(result.success ? 201 : 400).json(result);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error del servidor al crear préstamo",
    });
  }
};

exports.getByStudent = async (req, res) => {
  try {
    if (!req.params.registro) {
      return res.status(400).json({
        success: false,
        message: "Registro de estudiante requerido",
      });
    }

    const result = await PrestamoService.getByStudent(req.params.registro);
    res.status(result.success ? 200 : 404).json(result);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error del servidor al buscar préstamos del estudiante",
    });
  }
  exports.registrarDevolucion = async (req, res) => {
    try {
      // Validación básica
      if (!req.body.id_usuario_recibe || !req.body.detalles) {
        return res.status(400).json({
          success: false,
          message: "Datos incompletos para registrar devolución",
        });
      }

      // Preparar datos para la devolución
      const datosDevolucion = {
        id_estado: 2, // ID del estado "Devuelto"
        id_usuario_recibe: req.body.id_usuario_recibe,
        fecha_devolucion: new Date(),
        detalles: req.body.detalles,
      };

      const result = await PrestamoService.registrarDevolucion(
        req.params.id,
        datosDevolucion
      );
      res.status(result.success ? 200 : 400).json(result);
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Error del servidor al registrar devolución",
      });
    }
  };
};

// Mantenemos el update para cambios generales
exports.update = async (req, res) => {
  try {
    // Campos permitidos para actualización general
    const camposPermitidos = ['observaciones', 'id_estado'];
    const datosActualizacion = {};
    
    camposPermitidos.forEach(campo => {
      if (req.body[campo] !== undefined) {
        datosActualizacion[campo] = req.body[campo];
      }
    });

    const result = await PrestamoService.update(req.params.id, datosActualizacion);
    res.status(result.success ? 200 : 400).json(result);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error del servidor al actualizar préstamo"
    });
  }
};

// Método específico para devoluciones
exports.registrarDevolucion = async (req, res) => {
  try {
    if (!req.body.id_usuario_recibe || !req.body.detalles) {
      return res.status(400).json({
        success: false,
        message: "Datos incompletos: id_usuario_recibe y detalles son requeridos"
      });
    }

    const result = await PrestamoService.registrarDevolucion(
      req.params.id, 
      {
        id_usuario_recibe: req.body.id_usuario_recibe,
        detalles: req.body.detalles
      }
    );
    
    res.status(result.success ? 200 : 400).json(result);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error del servidor al registrar devolución"
    });
  }
};
