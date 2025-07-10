const jwt = require('jsonwebtoken');
const { Usuario, Rol } = require('../models');
const { ROLES, PERMISSIONS, ROLE_PERMISSIONS } = require('../constants/permissions');

// Función auxiliar para obtener el rol desde el id
const getRoleDescription = (roleId) => {
  const role = Object.entries(ROLES).find(([key, value]) => value === roleId);
  return role ? role[0] : null;
};

module.exports = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        error: 'Token no proporcionado o formato incorrecto'
      });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    const usuario = await Usuario.findByPk(decoded.id, {
      include: [{
        model: Rol,
        as: 'rol',
        attributes: ['descripcion']
      }]
    });

    if (!usuario) {
      return res.status(401).json({
        success: false,
        error: 'Usuario no encontrado'
      });
    }

    // Verificar que el rol sea válido usando getRoleDescription
    const roleDescription = getRoleDescription(usuario.id_rol);
    if (!roleDescription) {
      return res.status(403).json({
        success: false,
        error: 'Rol de usuario no válido'
      });
    }

    // Verificar que el usuario esté activo
    if (!usuario.estado) {
      return res.status(403).json({
        success: false,
        error: 'Usuario inactivo'
      });
    }

    // Adjuntar usuario y permisos al request
    req.user = {
      id: usuario.id_usuario,
      id_rol: usuario.id_rol,
      nombre: usuario.nombre,
      apellido: usuario.apellido,
      rol: roleDescription,
      permissions: ROLE_PERMISSIONS[roleDescription] || []
    };

    console.log('Usuario autenticado:', req.user); // Debug
    console.log('Permisos:', req.user.permissions); // Debug

    next();
  } catch (error) {
    console.error('Error en auth middleware:', error);
    
    let errorMessage = 'Autenticación fallida';
    if (error.name === 'TokenExpiredError') {
      errorMessage = 'Token expirado';
    } else if (error.name === 'JsonWebTokenError') {
      errorMessage = 'Token inválido';
    }

    return res.status(401).json({
      success: false,
      error: errorMessage
    });
  }
};