const { Estudiante, Persona,Estudiante_Materia, Docente_Materia, sequelize} = require("../models");
const { Op } = require("sequelize");

class EstudianteService {
  static async getAll() {
    try {
      const estudiantes = await Estudiante.findAll({
        include: {
          model: Persona,
          as: "persona",
          attributes: ["nombre", "apellido"],
        },
        attributes: ["id_estudiante", "Registro"],
      });
      return {
        success: true,
        data: estudiantes,
        message: "Lista de estudiantes obtenida",
      };
    } catch (error) {
      console.error("Error en EstudianteService.getAll:", error);
      return {
        success: false,
        message: "Error al obtener estudiantes",
      };
    }
  }

  static async create(dataEstudiante) {
    const transaction = await sequelize.transaction();
    try {
      if (
        !dataEstudiante.nombre ||
        !dataEstudiante.apellido ||
        !dataEstudiante.registro
      ) {
        return {
          success: false,
          message: "Datos incompletos",
        };
      }

      // Verificar si el registro ya existe
      const registroExistente = await Estudiante.findOne({
        where: { Registro: dataEstudiante.registro },
      });

      if (registroExistente) {
        return {
          success: false,
          message: "El registro ya existe",
        };
      }

      const persona = await Persona.create(
        {
          nombre: dataEstudiante.nombre,
          apellido: dataEstudiante.apellido,
        },
        { transaction }
      );

      const estudiante = await Estudiante.create(
        {
          id_persona: persona.id_persona,
          Registro: dataEstudiante.registro,
        },
        { transaction }
      );

      await transaction.commit();

      return {
        success: true,
        data: { ...estudiante.toJSON(), persona },
        message: "Estudiante registrado",
      };
    } catch (error) {
      await transaction.rollback();
      console.error("Error en EstudianteService.create:", error);
      return {
        success: false,
        message: "Error al registrar estudiante",
      };
    }
  }

  static async getByName(nameEstudiante) {
    try {
      const estudiantes = await Estudiante.findAll({
        include: {
          model: Persona,
          as: "persona",
          where: {
            [Op.or]: [
              { nombre: { [Op.like]: `%${nameEstudiante}%` } },
              { apellido: { [Op.like]: `%${nameEstudiante}%` } },
            ],
          },
        },
      });

      if (estudiantes.length === 0) {
        return {
          success: false,
          message: "No se encontraron estudiantes",
        };
      }
      return {
        success: true,
        data: estudiantes,
        message: "Búsqueda completada",
      };
    } catch (error) {
      console.error("Error en EstudianteService.getByName:", error);
      return {
        success: false,
        message: "Error al buscar estudiantes",
      };
    }
  }

  static async update(id, dataEstudiante) {
    const transaction = await sequelize.transaction();
    try {
      const estudiante = await Estudiante.findByPk(id, {
        include: {
          model: Persona,
          as: "persona",
        },
      });

      if (!estudiante) {
        return {
          success: false,
          message: "Estudiante no encontrado",
        };
      }

      // Verificar si se está cambiando el registro y si ya existe
      if (
        dataEstudiante.registro &&
        dataEstudiante.registro !== estudiante.Registro
      ) {
        const existeRegistro = await Estudiante.findOne({
          where: { Registro: dataEstudiante.registro },
          transaction,
        });

        if (existeRegistro) {
          return {
            success: false,
            message: "El registro ya está en uso",
          };
        }
      }

      // Actualizar datos de persona
      await estudiante.persona.update(
        {
          nombre: dataEstudiante.nombre || estudiante.persona.nombre,
          apellido: dataEstudiante.apellido || estudiante.persona.apellido,
        },
        { transaction }
      );

      // Actualizar datos de estudiante
      await estudiante.update(
        {
          Registro: dataEstudiante.registro || estudiante.Registro,
        },
        { transaction }
      );

      await transaction.commit();

      return {
        success: true,
        data: estudiante,
        message: "Estudiante actualizado",
      };
    } catch (error) {
      await transaction.rollback();
      console.error("Error en EstudianteService.update:", error);
      return {
        success: false,
        message: "Error al actualizar estudiante",
      };
    }
  }

  static async getByRegister(registro) {
    try {
      const estudiante = await Estudiante.findOne({
        where: { Registro: registro },
        include: {
          model: Persona,
          as: "persona",
          attributes: ["nombre", "apellido"],
        },
        attributes: ["id_estudiante", "Registro"],
      });

      if (!estudiante) {
        return {
          success: false,
          message: "Estudiante no encontrado",
        };
      }

      return {
        success: true,
        data: estudiante,
        message: "Estudiante encontrado",
      };
    } catch (error) {
      console.error("Error en EstudianteService.getByRegister:", error);
      return {
        success: false,
        message: "Error al buscar estudiante",
      };
    }
  }

  static async addMateria(idEstudiante, idDocenteMateria, modulo, semestre) {
    const transaction = await sequelize.transaction();
    try {
        // 1. Validar que el estudiante existe
        const estudiante = await Estudiante.findByPk(idEstudiante, { 
            transaction,
            include: [{
                model: Persona,
                as: 'persona'
            }]
        });
        
        if (!estudiante) {
            await transaction.rollback();
            return { 
                success: false, 
                message: `El estudiante con ID ${idEstudiante} no existe` 
            };
        }

        // 2. Validar que la relación docente-materia existe
        const docenteMateria = await Docente_Materia.findByPk(idDocenteMateria, {
            transaction,
            include: ['docente', 'materia']
        });
        
        if (!docenteMateria) {
            await transaction.rollback();
            return { 
                success: false, 
                message: `La relación docente-materia con ID ${idDocenteMateria} no existe` 
            };
        }

        // 3. Verificar si ya está inscrito
        const existeInscripcion = await Estudiante_Materia.findOne({
            where: {
                id_estudiante: idEstudiante,
                id_docente_materia: idDocenteMateria,
                id_modulo: modulo
            },
            transaction
        });

        if (existeInscripcion) {
            await transaction.rollback();
            return { 
                success: false, 
                message: `El estudiante ya está inscrito en esta materia para el módulo ${modulo}` 
            };
        }

        // 4. Crear la nueva inscripción
        const nuevaInscripcion = await Estudiante_Materia.create({
            id_estudiante: idEstudiante,
            id_docente_materia: idDocenteMateria,
            id_modulo: modulo,
            id_semestre: semestre
        }, { transaction });

        await transaction.commit();

        // 5. Preparar respuesta detallada
        return {
            success: true,
            data: {
                inscripcionId: nuevaInscripcion.id_estudiantes_materia,
                estudiante: {
                    id: estudiante.id_estudiante,
                    registro: estudiante.Registro,
                    nombre: estudiante.persona.nombre,
                    apellido: estudiante.persona.apellido
                },
                materia: {
                    id: docenteMateria.materia.id_materia,
                    nombre: docenteMateria.materia.nombre
                },
                docente: {
                    id: docenteMateria.docente.id_docente,
                    nombre: docenteMateria.docente.persona?.nombre,
                    apellido: docenteMateria.docente.persona?.apellido
                },
                modulo,
                semestre
            },
            message: "Materia agregada correctamente al estudiante"
        };

    } catch (error) {
        await transaction.rollback();
        console.error("Error detallado en addMateria:", error);
        
        return {
            success: false,
            message: "Error al agregar materia",
            error: process.env.NODE_ENV === 'development' ? {
                name: error.name,
                message: error.message,
                stack: error.stack
            } : undefined
        };
    }
}

  static async getMaterias(idEstudiante) {
    try {
      const estudiante = await Estudiante.findByPk(idEstudiante, {
        include: [
          {
            model: Estudiante_Materia,
            as: "materias",
            include: ["docente_materia"],
          },
        ],
      });

      if (!estudiante) {
        return { success: false, message: "Estudiante no encontrado" };
      }

      return {
        success: true,
        data: estudiante.materias,
        message: "Materias del estudiante obtenidas",
      };
    } catch (error) {
      console.error("Error en EstudianteService.getMaterias:", error);
      return { success: false, message: "Error al obtener materias" };
    }
  }
}

module.exports = EstudianteService;
