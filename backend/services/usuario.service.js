const bcrypt = require("bcrypt");
const { Usuario, Rol, sequelize } = require("../models");
const { ROLES } = require("../constants/permissions");

class UsuarioService {
  static async createUsuario(usuarioData, req) {
    const transaction = await sequelize.transaction();
    try {
      // Validación básica de datos requeridos
      if (
        !usuarioData.nombre ||
        !usuarioData.apellido ||
        !usuarioData.nombre_usuario ||
        !usuarioData.password_ ||
        !usuarioData.id_rol
      ) {
        await transaction.rollback();
        return {
          success: false,
          message:
            "Datos incompletos: nombre, apellido, nombre_usuario, password_ e id_rol son requeridos",
        };
      }

      // Validar que solo admins puedan crear usuarios
      if (req.user.id_rol !== 1) {
        await transaction.rollback();
        return {
          success: false,
          message: "Solo administradores pueden crear usuarios",
        };
      }

      // Validar que el rol exista
      const rol = await Rol.findByPk(usuarioData.id_rol, { transaction });
      if (!rol) {
        await transaction.rollback();
        return {
          success: false,
          message: "Rol no válido",
        };
      }

      // Validar que no se pueda crear otro admin
      if (rol.descripcion === ROLES.ADMINISTRATIVO) {
        await transaction.rollback();
        return {
          success: false,
          message: "No se pueden crear nuevos administradores",
        };
      }

      // Verificar si el nombre de usuario ya existe
      const usuarioExistente = await Usuario.findOne({
        where: { nombre_usuario: usuarioData.nombre_usuario },
        transaction,
      });

      if (usuarioExistente) {
        await transaction.rollback();
        return {
          success: false,
          message: "El nombre de usuario ya está en uso",
        };
      }

      // Hash de la contraseña
      const hashedPassword = await bcrypt.hash(usuarioData.password_, 10);

      // Crear el usuario
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

      // No devolver la contraseña en la respuesta
      const usuarioSinPassword = usuario.toJSON();
      delete usuarioSinPassword.password_;

      return {
        success: true,
        data: usuarioSinPassword,
        message: "Usuario registrado correctamente",
      };
    } catch (error) {
      await transaction.rollback();
      console.error("Error detallado en UsuarioService.createUsuario:", {
        error: error.message,
        stack: error.stack,
        inputData: usuarioData,
      });

      return {
        success: false,
        message: "Error al registrar usuario",
        error:
          process.env.NODE_ENV === "development" ? error.message : undefined,
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

  static async updateRol(id, id_rol, userMakingRequest) {
    const transaction = await sequelize.transaction();
    try {
      // Validar que solo admins puedan modificar roles
      if (userMakingRequest.id_rol !== 1) {
        await transaction.rollback();
        return {
          success: false,
          message: "Solo administradores pueden modificar roles",
        };
      }

      // Validar que el rol exista
      const rol = await Rol.findByPk(id_rol, { transaction });
      if (!rol) {
        await transaction.rollback();
        return {
          success: false,
          message: "Rol no válido",
        };
      }

      // Buscar el usuario
      const usuario = await Usuario.findByPk(id, { transaction });
      if (!usuario) {
        await transaction.rollback();
        return {
          success: false,
          message: "Usuario no encontrado",
        };
      }

      // No permitir cambiar el rol de administradores
      if (usuario.id_rol === 1) {
        await transaction.rollback();
        return {
          success: false,
          message: "No se puede cambiar el rol de un administrador",
        };
      }

      // Actualizar el rol
      await usuario.update({ id_rol }, { transaction });
      await transaction.commit();

      return {
        success: true,
        message: "Rol actualizado correctamente"
      };
    } catch (error) {
      await transaction.rollback();
      console.error("Error en updateRol:", error);
      return {
        success: false,
        message: "Error al actualizar el rol",
        error: error.message
      };
    }
  }

  static async updateEstado(id, nuevoEstado, userIdMakingRequest) {
    const transaction = await sequelize.transaction();
    try {
      const usuario = await Usuario.findByPk(id, { transaction });

      if (!usuario) {
        await transaction.rollback();
        return {
          success: false,
          message: "Usuario no encontrado",
        };
      }

      // No permitir desactivar a sí mismo
      if (usuario.id_usuario === userIdMakingRequest) {
        await transaction.rollback();
        return {
          success: false,
          message: "No puedes desactivar tu propio usuario",
        };
      }

      // Validar que el estado sea booleano
      if (typeof nuevoEstado !== "boolean") {
        await transaction.rollback();
        return {
          success: false,
          message: "El estado debe ser true o false",
        };
      }

      await usuario.update({ estado: nuevoEstado }, { transaction });
      await transaction.commit();

      return {
        success: true,
        data: {
          id: usuario.id_usuario,
          nombre: usuario.nombre,
          estado: usuario.estado,
        },
        message: "Estado de usuario actualizado correctamente",
      };
    } catch (error) {
      await transaction.rollback();
      console.error("Error en UsuarioService.updateEstado:", {
        error: error.message,
        stack: error.stack,
        params: { id, nuevoEstado, userIdMakingRequest },
      });

      return {
        success: false,
        message: "Error al actualizar estado de usuario",
        error:
          process.env.NODE_ENV === "development" ? error.message : undefined,
      };
    }
  }
}

module.exports = UsuarioService;
