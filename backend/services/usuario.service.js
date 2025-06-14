const bcrypt = require('bcrypt');
const { Usuario, Rol, sequelize } = require('../models');

class UsuarioService {
  static async createAuxiliar(usuarioData) {
    const transaction = await sequelize.transaction();
    try {
      // Validación básica
      if (!usuarioData.nombre || !usuarioData.apellido || 
          !usuarioData.nombre_usuario || !usuarioData.password_) {
        throw new Error('Nombre, apellido, nombre de usuario y contraseña son obligatorios');
      }

      // Forzar rol Auxiliar (id_rol = 2)
      usuarioData.id_rol = 2;

      // Verificar si el rol auxiliar existe
      const rolAuxiliar = await Rol.findByPk(2);
      if (!rolAuxiliar) {
        throw new Error('El rol Auxiliar no está configurado en el sistema');
      }

      // Verificar si el nombre de usuario ya existe
      const usuarioExistente = await Usuario.findOne({
        where: { nombre_usuario: usuarioData.nombre_usuario }
      });
      if (usuarioExistente) {
        throw new Error('El nombre de usuario ya está en uso');
      }

      // Hash de la contraseña
      const hashedPassword = await bcrypt.hash(usuarioData.password_, 10);

      const usuario = await Usuario.create({
        nombre: usuarioData.nombre,
        apellido: usuarioData.apellido,
        nombre_usuario: usuarioData.nombre_usuario,
        password_: hashedPassword,
        id_rol: 2 // Siempre rol Auxiliar
      }, { transaction });

      await transaction.commit();
      
      // No devolver la contraseña
      const usuarioSinPassword = usuario.toJSON();
      delete usuarioSinPassword.password_;

      return {
        success: true,
        data: usuarioSinPassword,
        message: 'Auxiliar creado exitosamente'
      };
    } catch (error) {
      await transaction.rollback();
      console.error('Error en UsuarioService.createAuxiliar:', error);
      return {
        success: false,
        error: error.message,
        message: 'Error al crear auxiliar'
      };
    }
  }

  static async getAuxiliarById(id) {
    try {
      const auxiliar = await Usuario.findOne({
        where: { id_usuario: id, id_rol: 2 },
        include: {
          model: Rol,
          as: 'rol',
          attributes: ['id_rol', 'descripcion']
        },
        attributes: { exclude: ['password_'] }
      });
      
      if (!auxiliar) {
        throw new Error('Auxiliar no encontrado');
      }
      
      return {
        success: true,
        data: auxiliar,
        message: 'Auxiliar encontrado exitosamente'
      };
    } catch (error) {
      console.error('Error en UsuarioService.getAuxiliarById:', error);
      return {
        success: false,
        error: error.message,
        message: 'Error al buscar auxiliar'
      };
    }
  }
}

module.exports = UsuarioService;