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

  static async getById(id) {
    try {
      const material = await Material.findByPk(id);
      if (!material) {
        throw new Error("Material no encontrado");
      }
      return {
        success: true,
        data: material,
        message: "Material encontrado exitosamente",
      };
    } catch (error) {
      console.error("Error en MaterialService.getById:", error);
      return {
        success: false,
        error: error.message,
        message: "Error al buscar el material",
      };
    }
  }

  static async getByCode(codigo) {
    try {
      const material = await Material.findOne({
        where: { codigo_material: codigo },
      });
      if (!material) {
        throw new Error("Material no encontrado");
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

  static async update(id, materialData) {
    try {
      const material = await Material.findByPk(id);
      if (!material) {
        throw new Error("Material no encontrado");
      }
      const updatedMaterial = await material.update(materialData);
      return {
        success: true,
        data: updatedMaterial,
        message: "Material actualizado exitosamente",
      };
    } catch (error) {
      console.error("Error en MaterialService.update:", error);
      return {
        success: false,
        error: error.message,
        message: "Error al actualizar el material",
      };
    }
  }

  static async delete(id) {
    try {
      const material = await Material.findByPk(id);
      if (!material) {
        throw new Error("Material no encontrado");
      }
      await material.destroy();
      return {
        success: true,
        message: "Material eliminado exitosamente",
      };
    } catch (error) {
      console.error("Error en MaterialService.delete:", error);
      return {
        success: false,
        error: error.message,
        message: "Error al eliminar el material",
      };
    }
  }
}

module.exports = MaterialService;
