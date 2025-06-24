const bcrypt = require("bcrypt");
const { Usuario, Rol, sequelize } = require("../models");

class UsuarioService {
  static async createUsuario(usuarioData, userMakingRequest) {
    const transaction = await sequelize.transaction();
    try {
      // Validar que solo admins puedan crear usuarios
      if (userMakingRequest.rol !== ROLES.ADMINISTRATIVO) {
        return {
          success: false,
          message: "Solo administradores pueden crear usuarios",
        };
      }

      // Validar que no se pueda crear otro admin
      const rol = await Rol.findByPk(usuarioData.id_rol, { transaction });
      if (rol.descripcion === ROLES.ADMINISTRATIVO) {
        return {
          success: false,
          message: "No se pueden crear nuevos administradores",
        };
      }

      // Resto de la lógica existente...
    } catch (error) {
      await transaction.rollback();
      console.error("Error en UsuarioService.createUsuario:", error);
      return {
        success: false,
        message: "Error al registrar usuario",
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

  static async updateEstado(id, nuevoEstado) {
    const transaction = await sequelize.transaction();
    try {
      const usuario = await Usuario.findByPk(id, { transaction });

      if (!usuario) {
        return {
          success: false,
          message: "Usuario no encontrado",
        };
      }

      // No permitir desactivar a sí mismo
      if (usuario.id_usuario === req.user.id) {
        return {
          success: false,
          message: "No puedes desactivar tu propio usuario",
        };
      }

      const updatedUsuario = await usuario.update(
        { estado: nuevoEstado },
        { transaction }
      );
      await transaction.commit();

      return {
        success: true,
        data: updatedUsuario,
        message: "Estado de usuario actualizado",
      };
    } catch (error) {
      await transaction.rollback();
      console.error("Error en UsuarioService.updateEstado:", error);
      return {
        success: false,
        message: "Error al actualizar estado de usuario",
      };
    }
  }
}

module.exports = UsuarioService;
