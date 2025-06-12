const { Docente, Persona } = require('../models');

class DocenteService {
  static async getAll() {
    try {
      const docentes = await Docente.findAll({
        include: [{
          model: Persona,
          as: 'persona'
        }]
      });
      return {
        success: true,
        data: docentes
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  static async getById(id) {
    try {
      const docente = await Docente.findByPk(id, {
        include: [{
          model: Persona,
          as: 'persona'
        }]
      });
      if (!docente) {
        return {
          success: false,
          error: 'Docente no encontrado'
        };
      }
      return {
        success: true,
        data: docente
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  static async create(docenteData) {
    const transaction = await sequelize.transaction();
    try {
      // Primero crear la persona
      const persona = await Persona.create({
        nombre: docenteData.nombre,
        apellido: docenteData.apellido
      }, { transaction });

      // Luego crear el docente
      const docente = await Docente.create({
        id_persona: persona.id_persona
      }, { transaction });

      await transaction.commit();
      return {
        success: true,
        data: {
          ...docente.toJSON(),
          persona: persona.toJSON()
        }
      };
    } catch (error) {
      await transaction.rollback();
      return {
        success: false,
        error: error.message
      };
    }
  }
}

module.exports = DocenteService;