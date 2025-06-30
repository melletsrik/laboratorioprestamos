const { 
    Prestamo, 
    Estudiante, 
    Docente, 
    Materia, 
    Usuario, 
    Estado_Prestamo, 
    Detalle_Prestamo, 
    Material,
    Op 
  } = require("../models");

  class ReporteService {
    static async getReportePrestamos(filtros) {
      try {
        console.log("Parámetros recibidos:", filtros);
        
        // Verificar si los modelos están definidos
        console.log("Modelos disponibles:", {
          Prestamo: Prestamo !== undefined,
          Estudiante: Estudiante !== undefined,
          Docente: Docente !== undefined,
          Materia: Materia !== undefined,
          Usuario: Usuario !== undefined,
          Estado_Prestamo: Estado_Prestamo !== undefined,
          Detalle_Prestamo: Detalle_Prestamo !== undefined,
          Material: Material !== undefined
        });
  
        const prestamos = await Prestamo.findAll({
          where: {
            fecha_prestamo: {
              [Op.between]: [filtros.fechaInicio, filtros.fechaFin]
            },
            id_estado: filtros.estado ? filtros.estado : { [Op.ne]: null }
          },
          include: [
            {
              model: Estudiante,
              as: "estudiante",
             
              include: ["persona"]
            },
            {
              model: Docente,
              as: "docente",
              include: ["persona"]
            },
            {
              model: Materia,
              as: "materia"
            },
            { 
              model: Usuario, 
              as: "usuarioEntrega" 
            },
            { 
              model: Usuario, 
              as: "usuarioRecibe" 
            },
            { 
              model: Estado_Prestamo, 
              as: "estado" 
            },
            {
              model: Detalle_Prestamo,
              as: "detalles",
              include: [{ 
                model: Material, 
                as: "material" 
              }],
            },
          ],
          order: [["fecha_prestamo", "DESC"]]
        });
  
        console.log("Número de préstamos encontrados:", prestamos.length);
  
        // Formatear los datos
        const datosFormateados = prestamos.map(prestamo => {
          try {
            return {
              id_prestamo: prestamo.id_prestamo,
              observaciones: prestamo.observaciones || 'N/A',
              estudiante: {
                id_estudiante: prestamo.estudiante.id_estudiante,
                nombres: prestamo.estudiante.persona.nombre,
                apellidos: prestamo.estudiante.persona.apellido,
                Registro: prestamo.estudiante?.Registro
              },
              docente: {
                id_docente: prestamo.docente?.id_docente,
                nombres: prestamo.docente?.persona?.nombre,
                apellidos: prestamo.docente?.persona?.apellido
              },
              materia: {
                id_materia: prestamo.materia?.id_materia,
                nombre: prestamo.materia?.nombre
              },
              usuario_entrega: {
                id_usuario: prestamo.usuarioEntrega.id_usuario,
                nombres: prestamo.usuarioEntrega.nombre,
                apellidos: prestamo.usuarioEntrega.apellido
              },
              fecha_prestamo: prestamo.fecha_prestamo,
              modulo: {
                id_modulo: prestamo.id_modulo,
                nombre: prestamo.modulo?.nombre
              },
              semestre: {
                id_semestre: prestamo.id_semestre,
                nombre: prestamo.semestre?.nombre
              },
              estado: {
                id_estado: prestamo.estado.id_estado,
                descripcion: prestamo.estado.descripcion
              },
              detalles: prestamo.detalles.map(detalle => ({
                id_detalle_prestamo: detalle.id_detalle_prestamo,
                material: {
                  id_material: detalle.material.id_material,
                  nombre: detalle.material.nombre,
                  codigo_material: detalle.material.codigo_material
                },
                cantidad: detalle.cantidad,
                cantidad_devuelta: detalle.cantidad_devuelta,
                usuario_recibe: {
                  id_usuario: prestamo.usuarioRecibe?.id_usuario,
                  nombres: prestamo.usuarioRecibe?.nombre,
                  apellidos: prestamo.usuarioRecibe?.apellido
                },
                fecha_devolucion: prestamo.fecha_devolucion
              }))
            };
          } catch (error) {
            console.error("Error formateando préstamo:", error);
            throw error;
          }
        });
  
        return {
          success: true,
          data: datosFormateados,
          message: "Reporte generado correctamente"
        };
      } catch (error) {
        console.error("Error detallado en getReportePrestamos:", error);
        return {
          success: false,
          message: "Error al generar el reporte: " + error.message
        };
      }
    }
  }
  module.exports = ReporteService;