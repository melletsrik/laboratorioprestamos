const { Material, sequelize } = require("../models");
const { Op } = require("sequelize");

class MaterialService {
  static async getAll() {
    try {
      const materiales = await Material.findAll();
      return {
        success: true,
        data: materiales,
        message: "Materiales obtenidos correctamente"
      };
    } catch (error) {
      console.error("Error en MaterialService.getAll:", error);
      return {
        success: false,
        message: "Error al obtener materiales"
      };
    }
  }

  static async create(materialData) {
    try {
      if (!materialData.codigo_material || !materialData.nombre) {
        return {
          success: false,
          message: "Código y nombre son requeridos"
        };
      }

      const existe = await Material.findOne({
        where: { codigo_material: materialData.codigo_material }
      });

      if (existe) {
        return {
          success: false,
          message: "El material ya existe"
        };
      }

      const material = await Material.create(materialData);
      return {
        success: true,
        data: material,
        message: "Material creado correctamente"
      };
    } catch (error) {
      console.error("Error en MaterialService.create:", error);
      return {
        success: false,
        message: "Error al crear material"
      };
    }
  }

  static async getByCode(codigo) {
    try {
      const material = await Material.findOne({
        where: { codigo_material: codigo }
      });
      
      if (!material) {
        return {
          success: false,
          message: "Material no encontrado"
        };
      }
      
      return {
        success: true,
        data: material,
        message: "Material encontrado"
      };
    } catch (error) {
      console.error("Error en MaterialService.getByCode:", error);
      return {
        success: false,
        message: "Error al buscar material"
      };
    }
  }

  static async getByName(nombreBuscado) {
    try {
      const materiales = await Material.findAll({
        where: {
          nombre: {
            [Op.like]: `%${nombreBuscado}%`
          }
        }
      });

      if (materiales.length === 0) {
        return {
          success: false,
          message: "No se encontraron materiales"
        };
      }
      
      return {
        success: true,
        data: materiales,
        message: "Búsqueda completada"
      };
    } catch (error) {
      console.error("Error en MaterialService.getByName:", error);
      return {
        success: false,
        message: "Error al buscar materiales"
      };
    }
  }

  static async update(codigo, materialData) {
    const transaction = await sequelize.transaction();
    try {
      const material = await Material.findOne({
        where: { codigo_material: codigo },
        transaction
      });

      if (!material) {
        return {
          success: false,
          message: "Material no encontrado"
        };
      }

      if (materialData.codigo_material && materialData.codigo_material !== codigo) {
        const existeCodigo = await Material.findOne({
          where: { codigo_material: materialData.codigo_material },
          transaction
        });

        if (existeCodigo) {
          return {
            success: false,
            message: "El código ya está en uso"
          };
        }
      }

      const updatedMaterial = await material.update(materialData, { transaction });
      await transaction.commit();

      return {
        success: true,
        data: updatedMaterial,
        message: "Material actualizado"
      };
    } catch (error) {
      await transaction.rollback();
      console.error("Error en MaterialService.update:", error);
      return {
        success: false,
        message: "Error al actualizar material"
      };
    }
  }
}

module.exports = MaterialService;