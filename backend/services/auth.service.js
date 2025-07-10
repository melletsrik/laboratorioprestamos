const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { Usuario, Rol } = require('../models');
const { ROLES, ROLE_PERMISSIONS } = require('../constants/permissions');

class AuthService {
  static async login(nombreUsuario, password_) {
    try {
      const usuario = await Usuario.findOne({ 
        where: { 
          nombre_usuario: nombreUsuario,
          estado: true // Solo usuarios activos pueden iniciar sesión
        },
        include: [{
          model: Rol,
          as: 'rol'
        }]
      });
      
      if (!usuario) {
        console.log('Error: Usuario no encontrado o inactivo');
        throw new Error('Usuario no encontrado o inactivo');
      }

      console.log('Usuario encontrado:', {
        id: usuario.id_usuario,
        nombre: usuario.nombre,
        rol_id: usuario.id_rol,
        rol_desc: usuario.rol.descripcion
      });

      console.log('Verificando contraseña...');
      const match = await bcrypt.compare(password_, usuario.password_);
      console.log('Contraseña coincide:', match);
      if (!match) {
        throw new Error('Contraseña incorrecta');
      }

      // Verificar que el rol sea válido usando el ID del rol
      const rolId = usuario.id_rol;
      if (rolId !== ROLES.ADMINISTRATIVO && rolId !== ROLES.AUXILIAR) {
        throw new Error('Rol de usuario no válido');
      }

      // Obtener los permisos del rol
      const rolePermissions = ROLE_PERMISSIONS[usuario.rol.descripcion] || [];
      console.log('Permisos asignados:', rolePermissions);

      const token = jwt.sign(
        { 
          id: usuario.id_usuario,
          rol: usuario.rol.descripcion,
          nombre: usuario.nombre,
          apellido: usuario.apellido,
          permissions: rolePermissions
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
          permissions: rolePermissions
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