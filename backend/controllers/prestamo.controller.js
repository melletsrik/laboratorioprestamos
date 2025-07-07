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
    // Validación básica con los nuevos campos requeridos
    if (
      req.body.id_estudiante === undefined ||
      req.body.id_usuario_entrega === undefined ||
      req.body.fecha_prestamo === undefined ||
      req.body.id_estado === undefined ||
      req.body.id_modulo === undefined ||
      req.body.id_semestre === undefined ||
      req.body.detalles === undefined
    ) {
      return res.status(400).json({
        success: false,
        message: "Datos incompletos para crear préstamo. Se requieren: id_estudiante, id_usuario_entrega, fecha_prestamo, id_estado, id_modulo, id_semestre y detalles",
      });
    }

    // Validación de tipos y valores válidos
    if (
      typeof req.body.id_estudiante !== 'number' ||
      typeof req.body.id_usuario_entrega !== 'number' ||
      typeof req.body.id_estado !== 'number' ||
      typeof req.body.id_modulo !== 'number' ||
      typeof req.body.id_semestre !== 'number' ||
      req.body.id_modulo < 0 ||
      req.body.id_semestre <= 0
    ) {
      return res.status(400).json({
        success: false,
        message: "Valores numéricos inválidos en los campos requeridos",
      });
    }

    const result = await PrestamoService.create(req.body);
    res.status(result.success ? 201 : 400).json(result);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error del servidor al crear préstamo: " + error.message,
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
      message: "Error del servidor al buscar préstamos del estudiante: " + error.message,
    });
  }
};

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

    // Validar que al menos un campo fue proporcionado
    if (Object.keys(datosActualizacion).length === 0) {
      return res.status(400).json({
        success: false,
        message: "Se requiere al menos uno de los siguientes campos: observaciones, id_estado"
      });
    }

    const result = await PrestamoService.update(req.params.id, datosActualizacion);
    res.status(result.success ? 200 : 400).json(result);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error del servidor al actualizar préstamo: " + error.message
    });
  }
};

exports.registrarDevolucion = async (req, res) => {
  try {
    // Validación más completa
    if (!req.body.id_usuario_recibe || !req.body.detalles) {
      return res.status(400).json({
        success: false,
        message: "Datos incompletos. Se requieren: id_usuario_recibe y detalles",
        detalles: {
          recibido: req.body,
          requerido: {
            id_usuario_recibe: "number (ID del usuario que recibe)",
            detalles: "array de objetos con id_detalle_prestamo y cantidad_devuelta"
          }
        }
      });
    }

    // Validar estructura de los detalles (aquí estaba el error de sintaxis)
    if (!Array.isArray(req.body.detalles)) {
      return res.status(400).json({
        success: false,
        message: "El campo detalles debe ser un array"
      });
    }

    const detallesValidos = req.body.detalles.every(d => 
      d.id_detalle_prestamo && d.cantidad_devuelta !== undefined
    );

    if (!detallesValidos) {
      return res.status(400).json({
        success: false,
        message: "Cada detalle debe tener id_detalle_prestamo y cantidad_devuelta"
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
      message: "Error del servidor al registrar devolución: " + error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};