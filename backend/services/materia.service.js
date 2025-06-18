const { Materia, Carrera, Facultad, sequelize } = require("../models");
const { Op } = require("sequelize");

class MateriaService {
  static async getAll() {
    try {
      const materias = await Materia.findAll({
        include: [{
          model: Carrera,
          as: 'carrera',
          include: [{
            model: Facultad,
            as: 'facultad',
            attributes: ['nombre']
          }],
          attributes: ['nombre']
        }],
        attributes: ['id_materia', 'nombre']
      });
      return {
        success: true,
        data: materias,
        message: "Lista de materias obtenida"
      };
    } catch (error) {
      console.error("Error en MateriaService.getAll:", error);
      return {
        success: false,
        message: "Error al obtener materias"
      };
    }
  }

  static async create(materiaData) {
    const transaction = await sequelize.transaction();
    try {
      if (!materiaData.nombre || !materiaData.id_carrera) {
        return {
          success: false,
          message: "Nombre y carrera son requeridos"
        };
      }

      // Verificar si la carrera existe
      const carrera = await Carrera.findByPk(materiaData.id_carrera);
      if (!carrera) {
        return {
          success: false,
          message: "Carrera no encontrada"
        };
      }

      // Verificar si la materia ya existe en la carrera
      const materiaExistente = await Materia.findOne({
        where: {
          nombre: materiaData.nombre,
          id_carrera: materiaData.id_carrera
        }
      });

      if (materiaExistente) {
        return {
          success: false,
          message: "La materia ya existe en esta carrera"
        };
      }

      const materia = await Materia.create(materiaData, { transaction });
      await transaction.commit();

      return {
        success: true,
        data: materia,
        message: "Materia creada correctamente"
      };
    } catch (error) {
      await transaction.rollback();
      console.error("Error en MateriaService.create:", error);
      return {
        success: false,
        message: "Error al crear materia"
      };
    }
  }

  static async getById(id) {
    try {
      const materia = await Materia.findByPk(id, {
        include: [{
          model: Carrera,
          as: 'carrera',
          include: [{
            model: Facultad,
            as: 'facultad',
            attributes: ['nombre']
          }],
          attributes: ['nombre']
        }],
        attributes: ['id_materia', 'nombre']
      });

      if (!materia) {
        return {
          success: false,
          message: "Materia no encontrada"
        };
      }

      return {
        success: true,
        data: materia,
        message: "Materia encontrada"
      };
    } catch (error) {
      console.error("Error en MateriaService.getById:", error);
      return {
        success: false,
        message: "Error al buscar materia"
      };
    }
  }

  static async getByName(nombreMateria) {
    try {
      const materias = await Materia.findAll({
        where: {
          nombre: {
            [Op.like]: `%${nombreMateria}%`
          }
        },
        include: [{
          model: Carrera,
          as: 'carrera',
          include: [{
            model: Facultad,
            as: 'facultad',
            attributes: ['nombre']
          }],
          attributes: ['nombre']
        }],
        attributes: ['id_materia', 'nombre']
      });

      if (materias.length === 0) {
        return {
          success: false,
          message: "No se encontraron materias"
        };
      }

      return {
        success: true,
        data: materias,
        message: "Búsqueda completada"
      };
    } catch (error) {
      console.error("Error en MateriaService.getByName:", error);
      return {
        success: false,
        message: "Error al buscar materias"
      };
    }
  }

  static async update(id, materiaData) {
    const transaction = await sequelize.transaction();
    try {
      const materia = await Materia.findByPk(id);
      
      if (!materia) {
        return {
          success: false,
          message: "Materia no encontrada"
        };
      }

      // Verificar si se está cambiando el nombre y si ya existe en la carrera
      if (materiaData.nombre && materiaData.nombre !== materia.nombre) {
        const materiaExistente = await Materia.findOne({
          where: {
            nombre: materiaData.nombre,
            id_carrera: materia.id_carrera
          }
        });

        if (materiaExistente) {
          return {
            success: false,
            message: "El nombre ya existe en esta carrera"
          };
        }
      }

      // Verificar si se está cambiando la carrera
      if (materiaData.id_carrera && materiaData.id_carrera !== materia.id_carrera) {
        const carrera = await Carrera.findByPk(materiaData.id_carrera);
        if (!carrera) {
          return {
            success: false,
            message: "Carrera no encontrada"
          };
        }

        // Verificar si el nombre ya existe en la nueva carrera
        const materiaExistente = await Materia.findOne({
          where: {
            nombre: materia.nombre,
            id_carrera: materiaData.id_carrera
          }
        });

        if (materiaExistente) {
          return {
            success: false,
            message: "La materia ya existe en la nueva carrera"
          };
        }
      }

      const materiaActualizada = await materia.update(materiaData, { transaction });
      await transaction.commit();

      return {
        success: true,
        data: materiaActualizada,
        message: "Materia actualizada"
      };
    } catch (error) {
      await transaction.rollback();
      console.error("Error en MateriaService.update:", error);
      return {
        success: false,
        message: "Error al actualizar materia"
      };
    }
  }
}

module.exports = MateriaService;