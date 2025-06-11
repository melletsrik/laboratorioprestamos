const { Material } = require("../models");

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
        details:
          process.env.NODE_ENV === "development" ? error.stack : undefined,
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
        details:
          process.env.NODE_ENV === "development" ? error.stack : undefined,
      };
    }
  }

  static async getById(id) {
    return await Material.findByPk(id);
  }

  static async update(id, materialData) {
    const material = await Material.findByPk(id);
    if (!material) {
      throw new Error("Material no encontrado");
    }
    return await material.update(materialData);
  }

  static async delete(id) {
    const material = await Material.findByPk(id);
    if (!material) {
      throw new Error("Material no encontrado");
    }
    return await material.destroy();
  }

  static async getByCode(codigo) {
    return await Material.findOne({ where: { codigo_material: codigo } });
  }
}

module.exports = MaterialService;
