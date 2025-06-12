const { Docente, Persona, sequelize } = require("../models");
const { Op } = require("sequelize");

class DocenteService {
  static async getAll() {
    try {
      const docentes = await Docente.findAll({
        include: {
          model: Persona,
          as: 'persona'
        }
      });
      return {
        success: true,
        data: docentes,
        message: "Docentes obtenidos exitosamente"
      };
    } catch (error) {
      console.error("Error en DocenteService.getAll:", error);
      return {
        success: false,
        error: error.message,
        message: "Error al obtener docentes"
      };
    }
  }

  static async create(dataDocente) {
    const transaction = await sequelize.transaction();
    try {
      if (!dataDocente.nombre || !dataDocente.apellido) {
        throw new Error("Nombre y apellido son obligatorios");
      }

      const persona = await Persona.create({
        nombre: dataDocente.nombre,
        apellido: dataDocente.apellido
      }, { transaction });

      const docente = await Docente.create({
        id_persona: persona.id_persona
      }, { transaction });

      await transaction.commit();
      return {
        success: true,
        data: { ...docente.toJSON(), persona: persona.toJSON() },
        message: "Docente creado exitosamente"
      };
    } catch (error) {
      await transaction.rollback();
      console.error("Error en DocenteService.create:", error);
      return {
        success: false,
        error: error.message,
        message: "Error al crear docente"
      };
    }
  }

  static async getByName(nombreDocenteBuscado) {
    try {
      const docentes = await Docente.findAll({
        include: {
          model: Persona,
          as: 'persona',
          where: {
            [Op.or]: [
              { nombre: { [Op.like]: `%${nombreDocenteBuscado}%` } },
              { apellido: { [Op.like]: `%${nombreDocenteBuscado}%` } }
            ]
          }
        }
      });

      if (docentes.length === 0) {
        return {
          success: false,
          message: "No se encontraron docentes con ese nombre"
        };
      }
      
      return {
        success: true,
        data: docentes,
        message: "Búsqueda exitosa"
      };
    } catch (error) {
      console.error("Error en DocenteService.searchByName:", error);
      return {
        success: false,
        error: error.message,
        message: "Error al buscar docentes"
      };
    }
  }

  static async update(id, dataDocente) {
    const transaction = await sequelize.transaction();
    try {
      const docente = await Docente.findByPk(id, {
        include: {
          model: Persona,
          as: 'persona'
        }
      });
      
      if (!docente) {
        throw new Error("Docente no encontrado");
      }

      // Actualizar datos de persona
      await docente.persona.update({
        nombre: dataDocente.nombre || docente.persona.nombre,
        apellido: dataDocente.apellido || docente.persona.apellido
      }, { transaction });

      await transaction.commit();
      return {
        success: true,
        data: docente,
        message: "Docente actualizado exitosamente"
      };
    } catch (error) {
      await transaction.rollback();
      console.error("Error en DocenteService.update:", error);
      return {
        success: false,
        error: error.message,
        message: "Error al actualizar docente"
      };
    }
  }
}

module.exports = DocenteService;