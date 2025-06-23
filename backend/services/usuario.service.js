const bcrypt = require("bcrypt");
const { Usuario, Rol, sequelize } = require("../models");

class UsuarioService {
  static async createUsuario(usuarioData) {
    const transaction = await sequelize.transaction();
    try {
      // Validación básica
      if (
        !usuarioData.nombre ||
        !usuarioData.apellido ||
        !usuarioData.nombre_usuario ||
        !usuarioData.password_ ||
        !usuarioData.estado
      ) {
        return {
          success: false,
          message: "Datos incompletos",
        };
      }

      // Verificar si el rol existe
      const rol = await Rol.findByPk(usuarioData.id_rol, { transaction });
      if (!rol) {
        return {
          success: false,
          message: "Rol no válido",
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
          id_rol: usuarioData.id_rol,
          estado: usuarioData.estado !== undefined ? usuarioData.estado : true,
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
        message: "Usuario registrado correctamente",
      };
    } catch (error) {
      await transaction.rollback();
      console.error("Error en UsuarioService.createUsuario:", error);
      return {
        success: false,
        message: "Error al registrar",
      };
    }
  }

  static async getAll(filter = {}) {
    try {
      const usuarios = await Usuario.findAll({
        where: filter,
        include: {
          model: Rol,
          as: "rol",
          attributes: ["id_rol", "descripcion"],
        },
        attributes: { exclude: ["password_"] },
      });

      return {
        success: true,
        data: usuarios,
        message: "Lista de usuarios obtenida",
      };
    } catch (error) {
      console.error("Error en UsuarioService.getAll:", error);
      return {
        success: false,
        message: "Error al obtener usuarios",
      };
    }
  }
}

module.exports = UsuarioService;