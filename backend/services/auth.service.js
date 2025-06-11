const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { Usuario, Rol } = require('../models');

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

      const token = jwt.sign(
        { 
          id: usuario.id_usuario, 
          rol: usuario.rol.descripcion, // Accede a través del alias
          nombre: usuario.nombre,
          apellido: usuario.apellido
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
          rol: usuario.rol.descripcion
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