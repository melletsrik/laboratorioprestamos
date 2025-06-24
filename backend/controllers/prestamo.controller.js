const PrestamoService = require("../services/prestamo.service");

exports.getAll = async (req, res) => {
  try {
    const result = await PrestamoService.getAll();
    res.status(result.success ? 200 : 400).json(result);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error del servidor al obtener préstamos"
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
      message: "Error del servidor al buscar préstamo"
    });
  }
};

exports.create = async (req, res) => {
  try {
    // Validación básica
    if (!req.body.id_estudiantes_materia || !req.body.id_usuario_entrega || 
        !req.body.fecha_prestamo || !req.body.id_estado || !req.body.detalles) {
      return res.status(400).json({
        success: false,
        message: "Datos incompletos para crear préstamo"
      });
    }

    const result = await PrestamoService.create(req.body);
    res.status(result.success ? 201 : 400).json(result);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error del servidor al crear préstamo"
    });
  }
};

exports.update = async (req, res) => {
  try {
    // Validar que solo se envien campos modificables
    const camposPermitidos = ['id_estado', 'id_usuario_recibe', 'fecha_devolucion', 'observaciones'];
    const datosActualizacion = {};
    
    camposPermitidos.forEach(campo => {
      if (req.body[campo] !== undefined) {
        datosActualizacion[campo] = req.body[campo];
      }
    });

    // Validación adicional para devoluciones
    if (datosActualizacion.id_estado) {
      const estado = await Estado_Prestamo.findByPk(datosActualizacion.id_estado);
      if (estado.nombre.toLowerCase() === 'devuelto') {
        if (!datosActualizacion.id_usuario_recibe) {
          return res.status(400).json({
            success: false,
            message: "Debe especificar el usuario que recibe la devolución"
          });
        }
        datosActualizacion.fecha_devolucion = datosActualizacion.fecha_devolucion || new Date();
      }
    }

    const result = await PrestamoService.update(req.params.id, datosActualizacion);
    res.status(result.success ? 200 : 400).json(result);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error del servidor al actualizar préstamo"
    });
  }
};

exports.getByStudent = async (req, res) => {
  try {
    if (!req.params.registro) {
      return res.status(400).json({
        success: false,
        message: "Registro de estudiante requerido"
      });
    }

    const result = await PrestamoService.getByStudent(req.params.registro);
    res.status(result.success ? 200 : 404).json(result);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error del servidor al buscar préstamos del estudiante"
    });
  }
};