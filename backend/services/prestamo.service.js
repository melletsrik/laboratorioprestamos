const { Prestamo, Detalle_Prestamo, Material, Estudiante, Docente, Materia, Usuario, Estado_Prestamo, Estudiante_Materia, sequelize } = require("../models");
const { Op } = require("sequelize");

class PrestamoService {
  static async getAll() {
    try {
      const prestamos = await Prestamo.findAll({
        include: [
          {
            model: Estudiante,
            as: 'estudiante',
            include: [{ model: sequelize.models.Persona, as: 'persona' }]
          },
          { model: Docente, as: 'docente' },
          { model: Materia, as: 'materia' },
          { model: Usuario, as: 'usuarioEntrega' },
          { model: Usuario, as: 'usuarioRecibe' },
          { model: Estado_Prestamo, as: 'estado' },
          {
            model: Detalle_Prestamo,
            as: 'detalles',
            include: [{ model: Material, as: 'material' }]
          }
        ],
        order: [['fecha_prestamo', 'DESC']]
      });
      
      return {
        success: true,
        data: prestamos,
        message: "Lista de préstamos obtenida"
      };
    } catch (error) {
      console.error("Error en PrestamoService.getAll:", error);
      return {
        success: false,
        message: "Error al obtener préstamos"
      };
    }
  }

  static async getById(id) {
    try {
      const prestamo = await Prestamo.findByPk(id, {
        include: [
          {
            model: Estudiante,
            as: 'estudiante',
            include: [{ model: sequelize.models.Persona, as: 'persona' }]
          },
          { model: Docente, as: 'docente' },
          { model: Materia, as: 'materia' },
          { model: Usuario, as: 'usuarioEntrega' },
          { model: Usuario, as: 'usuarioRecibe' },
          { model: Estado_Prestamo, as: 'estado' },
          {
            model: Detalle_Prestamo,
            as: 'detalles',
            include: [{ model: Material, as: 'material' }]
          }
        ]
      });

      if (!prestamo) {
        return {
          success: false,
          message: "Préstamo no encontrado"
        };
      }

      return {
        success: true,
        data: prestamo,
        message: "Préstamo encontrado"
      };
    } catch (error) {
      console.error("Error en PrestamoService.getById:", error);
      return {
        success: false,
        message: "Error al buscar préstamo"
      };
    }
  }

  static async create(prestamoData) {
    const transaction = await sequelize.transaction();
    try {
      // Validaciones básicas
      if (!prestamoData.id_estudiante || !prestamoData.id_usuario_entrega || !prestamoData.detalles || prestamoData.detalles.length === 0) {
        await transaction.rollback();
        return {
          success: false,
          message: "Datos incompletos para crear préstamo"
        };
      }

      // Verificar que el estudiante existe y está activo
      const estudiante = await Estudiante.findByPk(prestamoData.id_estudiante, { 
        include: [{ model: sequelize.models.Persona, as: 'persona' }],
        transaction 
      });
      
      if (!estudiante || !estudiante.estado) {
        await transaction.rollback();
        return {
          success: false,
          message: "Estudiante no encontrado o inactivo"
        };
      }

      // Verificar que los materiales existen y hay suficiente cantidad
      for (const detalle of prestamoData.detalles) {
        const material = await Material.findByPk(detalle.id_material, { transaction });
        if (!material) {
          await transaction.rollback();
          return {
            success: false,
            message: `Material con ID ${detalle.id_material} no encontrado`
          };
        }
        if (material.cantidad_total < detalle.cantidad) {
          await transaction.rollback();
          return {
            success: false,
            message: `No hay suficiente cantidad disponible para el material ${material.nombre}`
          };
        }
      }

      // Verificar relación estudiante-materia si se especifica materia
      if (prestamoData.id_materia) {
        const estudianteMateria = await Estudiante_Materia.findOne({
          where: {
            id_estudiante: prestamoData.id_estudiante,
            '$docente_materia.id_materia$': prestamoData.id_materia
          },
          include: [{
            model: sequelize.models.Docente_Materia,
            as: 'docente_materia'
          }],
          transaction
        });

        if (!estudianteMateria) {
          await transaction.rollback();
          return {
            success: false,
            message: "El estudiante no está inscrito en esta materia"
          };
        }
      }

      // Crear el préstamo con estado "Activo" (asumimos que id_estado=1 es activo)
      const nuevoPrestamo = await Prestamo.create({
        id_estudiante: prestamoData.id_estudiante,
        id_docente: prestamoData.id_docente || null,
        id_materia: prestamoData.id_materia || null,
        id_usuario_entrega: prestamoData.id_usuario_entrega,
        id_usuario_recibe: null,
        id_estado: 1, // Estado "Activo"
        observaciones: prestamoData.observaciones || null
      }, { transaction });

      // Crear detalles del préstamo y actualizar inventario
      for (const detalle of prestamoData.detalles) {
        await Detalle_Prestamo.create({
          id_prestamo: nuevoPrestamo.id_prestamo,
          id_material: detalle.id_material,
          cantidad: detalle.cantidad,
          cantidad_devuelta: 0
        }, { transaction });

        // Descontar del inventario
        await Material.decrement('cantidad_total', {
          by: detalle.cantidad,
          where: { id_material: detalle.id_material },
          transaction
        });
      }

      await transaction.commit();

      // Obtener el préstamo recién creado con todos sus detalles
      const prestamoCompleto = await Prestamo.findByPk(nuevoPrestamo.id_prestamo, {
        include: [
          {
            model: Estudiante,
            as: 'estudiante',
            include: [{ model: sequelize.models.Persona, as: 'persona' }]
          },
          { model: Estado_Prestamo, as: 'estado' },
          {
            model: Detalle_Prestamo,
            as: 'detalles',
            include: [{ model: Material, as: 'material' }]
          }
        ]
      });

      return {
        success: true,
        data: prestamoCompleto,
        message: "Préstamo creado correctamente"
      };
    } catch (error) {
      await transaction.rollback();
      console.error("Error en PrestamoService.create:", error);
      return {
        success: false,
        message: "Error al crear préstamo"
      };
    }
  }

  static async registrarDevolucion(idPrestamo, devolucionData) {
    const transaction = await sequelize.transaction();
    try {
      // Validaciones básicas
      if (!devolucionData.id_usuario_recibe || !devolucionData.detalles || devolucionData.detalles.length === 0) {
        await transaction.rollback();
        return {
          success: false,
          message: "Datos incompletos para registrar devolución"
        };
      }

      // Obtener el préstamo
      const prestamo = await Prestamo.findByPk(idPrestamo, {
        include: [{
          model: Detalle_Prestamo,
          as: 'detalles'
        }],
        transaction
      });

      if (!prestamo) {
        await transaction.rollback();
        return {
          success: false,
          message: "Préstamo no encontrado"
        };
      }

      // Verificar que el préstamo no esté ya devuelto
      if (prestamo.id_estado !== 1) { // Asumiendo que 1 es "Activo"
        await transaction.rollback();
        return {
          success: false,
          message: "El préstamo ya ha sido devuelto o está en otro estado"
        };
      }

      // Procesar cada detalle de devolución
      for (const detalleDev of devolucionData.detalles) {
        // Buscar el detalle original
        const detalleOriginal = prestamo.detalles.find(d => d.id_material === detalleDev.id_material);
        
        if (!detalleOriginal) {
          await transaction.rollback();
          return {
            success: false,
            message: `Material con ID ${detalleDev.id_material} no pertenece a este préstamo`
          };
        }

        // Validar cantidades
        if (detalleDev.cantidad_devuelta < 0 || 
            detalleDev.cantidad_devuelta > (detalleOriginal.cantidad - detalleOriginal.cantidad_devuelta)) {
          await transaction.rollback();
          return {
            success: false,
            message: `Cantidad inválida para material ID ${detalleDev.id_material}`
          };
        }

        // Actualizar detalle
        await Detalle_Prestamo.update({
          cantidad_devuelta: detalleOriginal.cantidad_devuelta + detalleDev.cantidad_devuelta
        }, {
          where: {
            id_detalle_prestamo: detalleOriginal.id_detalle_prestamo
          },
          transaction
        });

        // Actualizar inventario si se devolvió material en buen estado
        if (detalleDev.cantidad_devuelta > 0) {
          await Material.increment('cantidad_total', {
            by: detalleDev.cantidad_devuelta,
            where: { id_material: detalleDev.id_material },
            transaction
          });
        }
      }

      // Verificar si se devolvió todo el material
      const detallesActualizados = await Detalle_Prestamo.findAll({
        where: { id_prestamo: idPrestamo },
        transaction
      });

      const totalPrestado = detallesActualizados.reduce((sum, d) => sum + d.cantidad, 0);
      const totalDevuelto = detallesActualizados.reduce((sum, d) => sum + d.cantidad_devuelta, 0);

      // Actualizar estado del préstamo
      let nuevoEstado;
      if (totalDevuelto === 0) {
        nuevoEstado = 1; // "Activo" (no se devolvió nada)
      } else if (totalDevuelto < totalPrestado) {
        nuevoEstado = 3; // "Parcialmente devuelto" (asumiendo que 3 es este estado)
      } else {
        nuevoEstado = 2; // "Completamente devuelto"
      }

      await Prestamo.update({
        id_estado: nuevoEstado,
        id_usuario_recibe: devolucionData.id_usuario_recibe,
        fecha_devolucion: sequelize.fn('NOW'),
        observaciones: devolucionData.observaciones || null
      }, {
        where: { id_prestamo: idPrestamo },
        transaction
      });

      await transaction.commit();

      // Obtener el préstamo actualizado
      const prestamoActualizado = await Prestamo.findByPk(idPrestamo, {
        include: [
          {
            model: Estudiante,
            as: 'estudiante',
            include: [{ model: sequelize.models.Persona, as: 'persona' }]
          },
          { model: Estado_Prestamo, as: 'estado' },
          {
            model: Detalle_Prestamo,
            as: 'detalles',
            include: [{ model: Material, as: 'material' }]
          }
        ]
      });

      return {
        success: true,
        data: prestamoActualizado,
        message: "Devolución registrada correctamente"
      };
    } catch (error) {
      await transaction.rollback();
      console.error("Error en PrestamoService.registrarDevolucion:", error);
      return {
        success: false,
        message: "Error al registrar devolución"
      };
    }
  }

  static async getByEstudiante(idEstudiante) {
    try {
      const prestamos = await Prestamo.findAll({
        where: { id_estudiante: idEstudiante },
        include: [
          { model: Materia, as: 'materia' },
          { model: Estado_Prestamo, as: 'estado' },
          {
            model: Detalle_Prestamo,
            as: 'detalles',
            include: [{ model: Material, as: 'material' }]
          }
        ],
        order: [['fecha_prestamo', 'DESC']]
      });

      return {
        success: true,
        data: prestamos,
        message: "Préstamos del estudiante obtenidos"
      };
    } catch (error) {
      console.error("Error en PrestamoService.getByEstudiante:", error);
      return {
        success: false,
        message: "Error al obtener préstamos del estudiante"
      };
    }
  }

  static async getActivos() {
    try {
      const prestamos = await Prestamo.findAll({
        where: { id_estado: 1 }, // Asumiendo que 1 es "Activo"
        include: [
          {
            model: Estudiante,
            as: 'estudiante',
            include: [{ model: sequelize.models.Persona, as: 'persona' }]
          },
          { model: Materia, as: 'materia' },
          {
            model: Detalle_Prestamo,
            as: 'detalles',
            include: [{ model: Material, as: 'material' }]
          }
        ],
        order: [['fecha_prestamo', 'DESC']]
      });

      return {
        success: true,
        data: prestamos,
        message: "Préstamos activos obtenidos"
      };
    } catch (error) {
      console.error("Error en PrestamoService.getActivos:", error);
      return {
        success: false,
        message: "Error al obtener préstamos activos"
      };
    }
  }

  static async getByMaterial(idMaterial) {
    try {
      const prestamos = await Detalle_Prestamo.findAll({
        where: { id_material: idMaterial },
        include: [
          {
            model: Prestamo,
            as: 'prestamo',
            include: [
              {
                model: Estudiante,
                as: 'estudiante',
                include: [{ model: sequelize.models.Persona, as: 'persona' }]
              },
              { model: Estado_Prestamo, as: 'estado' }
            ]
          }
        ],
        order: [[{ model: Prestamo, as: 'prestamo' }, 'fecha_prestamo', 'DESC']]
      });

      return {
        success: true,
        data: prestamos,
        message: "Préstamos del material obtenidos"
      };
    } catch (error) {
      console.error("Error en PrestamoService.getByMaterial:", error);
      return {
        success: false,
        message: "Error al obtener préstamos del material"
      };
    }
  }
}

module.exports = PrestamoService;