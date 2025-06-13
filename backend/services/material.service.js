const { Material, sequelize } = require("../models");
const { Op } = require("sequelize");

class MaterialService {
  static async getAll() {
    try {
      const materiales = await Material.findAll();
      return {
        success: true,
        data: materiales,
        message: "Materiales obtenidos exitosamente",
      };
    } catch (error) {
      console.error("Error en MaterialService.getAll:", error);
      return {
        success: false,
        error: error.message,
        message: "Error al obtener los materiales",
      };
    }
  }

  static async create(materialData) {
    try {
      if (!materialData.codigo_material || !materialData.nombre) {
        throw new Error("Código y nombre son campos obligatorios");
      }

      const existe = await Material.findOne({
        where: { codigo_material: materialData.codigo_material },
      });

      if (existe) {
        throw new Error("El código de material ya existe");
      }

      const material = await Material.create(materialData);
      return {
        success: true,
        data: material,
        message: "Material creado exitosamente",
      };
    } catch (error) {
      console.error("Error en MaterialService.create:", error);
      return {
        success: false,
        error: error.message,
        message: "Error al crear el material",
      };
    }
  }

  static async getByCode(codigo) {
    try {
      const material = await Material.findOne({
        where: { codigo_material: codigo },
      });
      if (!material) {
        return {
          success: false,
          message: "Material no encontrado",
          error: "Material no encontrado",
        };
      }
      return {
        success: true,
        data: material,
        message: "Material encontrado exitosamente",
      };
    } catch (error) {
      console.error("Error en MaterialService.getByCode:", error);
      return {
        success: false,
        error: error.message,
        message: "Error al buscar el material",
      };
    }
  }

  static async getByName(nombreBuscado) {
    try {
      const materiales = await Material.findAll({
        where: {
          nombre: {
            [Op.like]: `%${nombreBuscado}%`,
          },
        },
      });

      if (materiales.length === 0) {
        return {
          success: false,
          message: "No se encontraron materiales con ese nombre",
        };
      }
      return {
        success: true,
        data: materiales,
        message: "Búsqueda exitosa",
      };
    } catch (error) {
      console.error("Error en MaterialService.getByName:", error);
      return {
        success: false,
        error: error.message,
        message: "Error al buscar materiales",
      };
    }
  }

  static async update(codigo, materialData) {
    const transaction = await sequelize.transaction();
    try {
      // Buscar por código en lugar de ID
      const material = await Material.findOne({
        where: { codigo_material: codigo },
        transaction,
      });

      if (!material) {
        throw new Error("Material no encontrado");
      }

      // Verificar si se está cambiando el código y si ya existe
      if (
        materialData.codigo_material &&
        materialData.codigo_material !== codigo
      ) {
        const existeCodigo = await Material.findOne({
          where: { codigo_material: materialData.codigo_material },
          transaction,
        });

        if (existeCodigo) {
          throw new Error("El nuevo código de material ya está en uso");
        }
      }

      const updatedMaterial = await material.update(materialData, {
        transaction,
      });
      await transaction.commit();

      return {
        success: true,
        data: updatedMaterial,
        message: "Material actualizado exitosamente",
      };
    } catch (error) {
      await transaction.rollback();
      console.error("Error en MaterialService.update:", error);
      return {
        success: false,
        error: error.message,
        message: "Error al actualizar el material",
      };
    }
  }
}

module.exports = MaterialService;
