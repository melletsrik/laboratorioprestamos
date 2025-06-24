const jwt = require('jsonwebtoken');
const { Usuario, Rol } = require('../models');
const { ROLES, PERMISSIONS, ROLE_PERMISSIONS } = require('../constants/permissions');

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

    // Verificar que el usuario esté activo
    if (!usuario.estado) {
      return res.status(403).json({
        success: false,
        error: 'Usuario inactivo'
      });
    }

    // Verificar que el rol sea válido
    if (!Object.values(ROLES).includes(usuario.rol.descripcion)) {
      return res.status(403).json({
        success: false,
        error: 'Rol de usuario no válido'
      });
    }

    // Adjuntar usuario y permisos al request
    req.user = {
      id: usuario.id_usuario,
      nombre: usuario.nombre,
      apellido: usuario.apellido,
      rol: usuario.rol.descripcion,
      permissions: ROLE_PERMISSIONS[usuario.rol.descripcion] || []
    };

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