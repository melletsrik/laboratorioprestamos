const { Estudiante, Persona, sequelize } = require("../models");
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

      const existe = await Estudiante.findOne({
        where: { Registro: dataEstudiante.registro }
      });
      if (existe) {
        throw new Error("Ya existe un estudiante con ese registro");
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
}

module.exports = EstudianteService;
