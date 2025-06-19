const { Docente, Persona, sequelize } = require("../models");
const { Op } = require("sequelize");

class DocenteService {
  static async getAll() {
    try {
      const docentes = await Docente.findAll({
        include: {
          model: Persona,
          as: 'persona',
          attributes: ['nombre', 'apellido']
        }
      });
      return {
        success: true,
        data: docentes,
        message: "Lista de docentes obtenida"
      };
    } catch (error) {
      console.error("Error en DocenteService.getAll:", error);
      return {
        success: false,
        message: "Error al obtener docentes"
      };
    }
  }

  static async create(dataDocente) {
    const transaction = await sequelize.transaction();
    try {
      console.log("Datos recibidos para crear docente:", dataDocente);
      if (!dataDocente.nombre || !dataDocente.apellido) {
        return {
          success: false,
          message: "Nombre y apellido son requeridos"
        };
      }

      const persona = await Persona.create({
        nombre: dataDocente.nombre,
        apellido: dataDocente.apellido
      }, { transaction });

      const docente = await Docente.create({
        id_persona: persona.id_persona,
        estado: dataDocente.estado !== undefined ? dataDocente.estado : 1
      }, { transaction });

      await transaction.commit();
      return {
        success: true,
        data: { ...docente.toJSON(), persona },
        message: "Docente registrado correctamente"
      };
    } catch (error) {
      await transaction.rollback();
      console.error("Error en DocenteService.create:", error);
      return {
        success: false,
        message: "Error al registrar docente"
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
          },
          attributes: ['nombre', 'apellido']
        }
      });

      if (docentes.length === 0) {
        return {
          success: false,
          message: "No se encontraron docentes"
        };
      }
      
      return {
        success: true,
        data: docentes,
        message: "Búsqueda completada"
      };
    } catch (error) {
      console.error("Error en DocenteService.getByName:", error);
      return {
        success: false,
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
        return {
          success: false,
          message: "Docente no encontrado"
        };
      }

      // Actualiza nombre y apellido
      await docente.persona.update({
        nombre: dataDocente.nombre || docente.persona.nombre,
        apellido: dataDocente.apellido || docente.persona.apellido
      }, { transaction });

      // Actualiza estado si viene en el body
      if (typeof dataDocente.estado !== "undefined") {
        await docente.update({
          estado: dataDocente.estado
        }, { transaction });
      }

      await transaction.commit();
      return {
        success: true,
        data: docente,
        message: "Docente actualizado"
      };
    } catch (error) {
      await transaction.rollback();
      console.error("Error en DocenteService.update:", error);
      return {
        success: false,
        message: "Error al actualizar docente"
      };
    }
  }
}

module.exports = DocenteService;