const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { Usuario, Rol } = require('../models');
const { ROLES, ROLE_PERMISSIONS } = require('../constants/permissions');

class AuthService {
  static async login(nombreUsuario, password) {
    try {
      const usuario = await Usuario.findOne({ 
        where: { nombre_usuario: nombreUsuario },
        include: [{
          model: Rol,
          as: 'rol'
        }]
      });
      
      if (!usuario) {
        throw new Error('Usuario no encontrado');
      }

      const match = await bcrypt.compare(password, usuario.password_);
      if (!match) {
        throw new Error('Contraseña incorrecta');
      }

      // Verificar que el rol sea válido
      if (!Object.values(ROLES).includes(usuario.rol.descripcion)) {
        throw new Error('Rol de usuario no válido');
      }

      const token = jwt.sign(
        { 
          id: usuario.id_usuario,
          rol: usuario.rol.descripcion,
          nombre: usuario.nombre,
          apellido: usuario.apellido,
          permissions: ROLE_PERMISSIONS[usuario.rol.descripcion] || []
        },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN || '8h' }
      );

      return {
        success: true,
        token,
        usuario: {
          id: usuario.id_usuario,
          nombre: usuario.nombre,
          apellido: usuario.apellido,
          rol: usuario.rol.descripcion,
          permissions: ROLE_PERMISSIONS[usuario.rol.descripcion] || []
        }
      };
    } catch (error) {
      console.error('Error en AuthService.login:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }
}

module.exports = AuthService;