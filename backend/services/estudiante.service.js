const { Estudiante, Persona, sequelize } = require("../models");
const { Op } = require("sequelize");

class EstudianteService {
  static async getAll() {
    try {
      const estudiantes = await Estudiante.findAll({
        include: {
          model: Persona,
          as: "persona",
        },
      });
      return {
        success: true,
        data: estudiantes,
        message: "Estudiantes obtenidos exitosamente",
      };
    } catch (error) {
      console.error("Error en EstudianteService.getAll:", error);
      return {
        success: false,
        error: error.message,
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
        throw new Error("Nombre, apellido y registro son obligatorios");
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
        data: { ...estudiante.toJSON(), persona: persona.toJSON() },
        message: "Estudiante creado exitosamente",
      };
    } catch (error) {
      await transaction.rollback();
      console.error("Error en EstudianteService.create:", error);
      return {
        success: false,
        error: error.message,
        message: "Error al crear estudiante",
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
          message: "No se encontraron estudiantes con ese nombre",
        };
      }

      return {
        success: true,
        data: estudiantes,
        message: "Búsqueda exitosa",
      };
    } catch (error) {
      console.error("Error en EstudianteService.getByName:", error);
      return {
        success: false,
        error: error.message,
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
        throw new Error("Estudiante no encontrado");
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
      const estActualizado = await estudiante.update(
        {
          Registro: dataEstudiante.registro || estudiante.Registro,
        },
        { transaction }
      );

      await transaction.commit();
      return {
        success: true,
        data: estActualizado,
        message: "Estudiante actualizado exitosamente",
      };
    } catch (error) {
      await transaction.rollback();
      console.error("Error en EstudianteService.update:", error);
      return {
        success: false,
        error: error.message,
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
        },
      });

      if (!estudiante) {
        throw new Error("Estudiante no encontrado");
      }

      return {
        success: true,
        data: estudiante,
        message: "Estudiante encontrado exitosamente",
      };
    } catch (error) {
      console.error("Error en EstudianteService.getByRegister:", error);
      return {
        success: false,
        error: error.message,
        message: "Error al buscar estudiante",
      };
    }
  }
}

module.exports = EstudianteService;
