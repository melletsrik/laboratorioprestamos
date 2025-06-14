const bcrypt = require("bcrypt");
const { Usuario, Rol, sequelize } = require("../models");

class UsuarioService {
  static async createAuxiliar(usuarioData) {
    const transaction = await sequelize.transaction();
    try {
      // Validación básica
      if (
        !usuarioData.nombre ||
        !usuarioData.apellido ||
        !usuarioData.nombre_usuario ||
        !usuarioData.password_
      ) {
        return {
          success: false,
          message: "Datos incompletos",
        };
      }

      // Verificar si el rol auxiliar existe
      const rolAuxiliar = await Rol.findOne({
        where: { descripcion: "Auxiliar" },
      });
      if (!rolAuxiliar) {
        return {
          success: false,
          message: "Rol no configurado",
        };
      }

      // Verificar si el nombre de usuario ya existe
      const usuarioExistente = await Usuario.findOne({
        where: { nombre_usuario: usuarioData.nombre_usuario },
      });
      if (usuarioExistente) {
        return {
          success: false,
          message: "Usuario ya existe",
        };
      }

      // Hash de la contraseña
      const hashedPassword = await bcrypt.hash(usuarioData.password_, 10);

      const usuario = await Usuario.create(
        {
          nombre: usuarioData.nombre,
          apellido: usuarioData.apellido,
          nombre_usuario: usuarioData.nombre_usuario,
          password_: hashedPassword,
          id_rol: rolAuxiliar.id_rol,
        },
        { transaction }
      );

      await transaction.commit();

      // No devolver la contraseña
      const usuarioSinPassword = usuario.toJSON();
      delete usuarioSinPassword.password_;

      return {
        success: true,
        data: usuarioSinPassword,
        message: "Auxiliar registrado",
      };
    } catch (error) {
      await transaction.rollback();
      console.error("Error en UsuarioService.createAuxiliar:", error);
      return {
        success: false,
        message: "Error al registrar",
      };
    }
  }

  static async getAllAuxiliares() {
    try {
      const auxiliares = await Usuario.findAll({
        include: {
          model: Rol,
          as: "rol",
          where: { descripcion: "Auxiliar" },
          attributes: ["descripcion"],
        },
        attributes: { exclude: ["password_"] },
      });

      return {
        success: true,
        data: auxiliares,
        message: "Lista de auxiliares",
      };
    } catch (error) {
      console.error("Error en UsuarioService.getAllAuxiliares:", error);
      return {
        success: false,
        message: "Error al obtener auxiliares",
      };
    }
  }
}

module.exports = UsuarioService;