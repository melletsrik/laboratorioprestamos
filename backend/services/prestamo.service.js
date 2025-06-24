const { Prestamo,Detalle_Prestamo, Material,Estudiante_Materia,Usuario, Estado_Prestamo,sequelize,
} = require("../models");
const { Op } = require("sequelize");

class PrestamoService {
  static async getAll() {
    try {
      const prestamos = await Prestamo.findAll({
        include: [
          {
            model: Estudiante_Materia,
            as: "estudiante_materia",
            include: ["estudiante", "docente_materia"],
          },
          { model: Usuario, as: "usuario_entrega" },
          { model: Usuario, as: "usuario_recibe" },
          { model: Estado_Prestamo, as: "estado" },
          {
            model: Detalle_Prestamo,
            as: "detalles",
            include: [{ model: Material, as: "material" }],
          },
        ],
        order: [["fecha_prestamo", "DESC"]],
      });

      return {
        success: true,
        data: prestamos,
        message: "Préstamos obtenidos correctamente",
      };
    } catch (error) {
      console.error("Error en PrestamoService.getAll:", error);
      return {
        success: false,
        message: "Error al obtener préstamos",
      };
    }
  }

  static async getById(id) {
    try {
      const prestamo = await Prestamo.findByPk(id, {
        include: [
          {
            model: Estudiante_Materia,
            as: "estudiante_materia",
            include: ["estudiante", "docente_materia"],
          },
          { model: Usuario, as: "usuario_entrega" },
          { model: Usuario, as: "usuario_recibe" },
          { model: Estado_Prestamo, as: "estado" },
          {
            model: Detalle_Prestamo,
            as: "detalles",
            include: [{ model: Material, as: "material" }],
          },
        ],
      });

      if (!prestamo) {
        return {
          success: false,
          message: "Préstamo no encontrado",
        };
      }

      return {
        success: true,
        data: prestamo,
        message: "Préstamo encontrado",
      };
    } catch (error) {
      console.error("Error en PrestamoService.getById:", error);
      return {
        success: false,
        message: "Error al buscar préstamo",
      };
    }
  }

  static async create(prestamoData) {
    const transaction = await sequelize.transaction();
    try {
      // Validación básica
      if (
        !prestamoData.id_estudiantes_materia ||
        !prestamoData.id_usuario_entrega ||
        !prestamoData.fecha_prestamo ||
        !prestamoData.id_estado
      ) {
        return {
          success: false,
          message: "Datos incompletos para crear préstamo",
        };
      }

      // Validar materiales
      if (!prestamoData.detalles || prestamoData.detalles.length === 0) {
        return {
          success: false,
          message: "Debe incluir al menos un material",
        };
      }

      // Crear préstamo
      const nuevoPrestamo = await Prestamo.create(
        {
          id_estudiantes_materia: prestamoData.id_estudiantes_materia,
          id_usuario_entrega: prestamoData.id_usuario_entrega,
          id_usuario_recibe: prestamoData.id_usuario_recibe || null,
          fecha_prestamo: prestamoData.fecha_prestamo,
          fecha_devolucion: prestamoData.fecha_devolucion || null,
          observaciones: prestamoData.observaciones || null,
          id_estado: prestamoData.id_estado,
        },
        { transaction }
      );

      // Crear detalles del préstamo
      const detalles = await Promise.all(
        prestamoData.detalles.map(async (detalle) => {
          // Verificar disponibilidad del material
          const material = await Material.findByPk(detalle.id_material, {
            transaction,
          });
          if (!material || material.cantidad_total < detalle.cantidad) {
            throw new Error(
              `Material no disponible o cantidad insuficiente: ${detalle.id_material}`
            );
          }

          // Crear detalle
          return Detalle_Prestamo.create(
            {
              id_prestamo: nuevoPrestamo.id_prestamo,
              id_material: detalle.id_material,
              cantidad: detalle.cantidad,
              cantidad_devuelta: 0,
            },
            { transaction }
          );
        })
      );

      await transaction.commit();

      return {
        success: true,
        data: { ...nuevoPrestamo.get(), detalles },
        message: "Préstamo creado correctamente",
      };
    } catch (error) {
      await transaction.rollback();
      console.error("Error en PrestamoService.create:", error);
      return {
        success: false,
        message: error.message || "Error al crear préstamo",
      };
    }
  }

  static async getByStudent(registroEstudiante) {
    try {
      const prestamos = await Prestamo.findAll({
        include: [
          {
            model: Estudiante_Materia,
            as: "estudiante_materia",
            include: [
              {
                association: "estudiante",
                where: { Registro: registroEstudiante },
              },
              "docente_materia",
            ],
          },
          { model: Usuario, as: "usuario_entrega" },
          { model: Usuario, as: "usuario_recibe" },
          { model: Estado_Prestamo, as: "estado" },
          {
            model: Detalle_Prestamo,
            as: "detalles",
            include: [{ model: Material, as: "material" }],
          },
        ],
        order: [["fecha_prestamo", "DESC"]],
      });

      return {
        success: true,
        data: prestamos,
        message: "Préstamos del estudiante obtenidos correctamente",
      };
    } catch (error) {
      console.error("Error en PrestamoService.getByStudent:", error);
      return {
        success: false,
        message: "Error al obtener préstamos del estudiante",
      };
    }
  }
  
  static async update(id, updateData) {
    const transaction = await sequelize.transaction();
    try {
        const prestamo = await Prestamo.findByPk(id, { transaction });
        
        if (!prestamo) {
            await transaction.rollback();
            return {
                success: false,
                message: "Préstamo no encontrado"
            };
        }

        // Solo permitir actualización de campos no críticos
        const updatedPrestamo = await prestamo.update(updateData, { transaction });
        
        await transaction.commit();
        return {
            success: true,
            data: updatedPrestamo,
            message: "Préstamo actualizado correctamente"
        };
    } catch (error) {
        await transaction.rollback();
        console.error("Error en PrestamoService.update:", error);
        return {
            success: false,
            message: "Error al actualizar préstamo"
        };
    }
}

static async registrarDevolucion(idPrestamo, devolucionData) {
    const transaction = await sequelize.transaction();
    try {
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

        // 1. Validar y actualizar detalles
        await Promise.all(
            devolucionData.detalles.map(async detalle => {
                const detallePrestamo = prestamo.detalles.find(d => d.id_detalle_prestamo === detalle.id_detalle_prestamo);
                
                if (!detallePrestamo) {
                    throw new Error(`Detalle de préstamo no encontrado: ${detalle.id_detalle_prestamo}`);
                }

                if (detalle.cantidad_devuelta > detallePrestamo.cantidad) {
                    throw new Error(`Cantidad devuelta excede lo prestado (${detallePrestamo.cantidad})`);
                }

                await detallePrestamo.update({
                    cantidad_devuelta: detalle.cantidad_devuelta
                }, { transaction });

                // Actualizar inventario
                const material = await Material.findByPk(detallePrestamo.id_material, { transaction });
                if (material) {
                    await material.increment('cantidad_total', {
                        by: detalle.cantidad_devuelta,
                        transaction
                    });
                }
            })
        );

        // 2. Marcar préstamo como devuelto
        const prestamoActualizado = await prestamo.update({
            id_estado: 2, // Estado "Devuelto"
            id_usuario_recibe: devolucionData.id_usuario_recibe,
            fecha_devolucion: new Date()
        }, { transaction });

        await transaction.commit();
        
        return {
            success: true,
            data: prestamoActualizado,
            message: "Devolución registrada exitosamente"
        };
    } catch (error) {
        await transaction.rollback();
        console.error("Error en registrarDevolucion:", error);
        return {
            success: false,
            message: error.message || "Error al registrar devolución"
        };
    }
}
}

module.exports = PrestamoService;
