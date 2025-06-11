const jwt = require('jsonwebtoken');
const { Rol, Usuario } = require('../models');

module.exports = async (req, res, next) => {
  try {
    // 1. Verificar si el token existe
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        error: 'Token no proporcionado o formato incorrecto'
      });
    }

    const token = authHeader.split(' ')[1];
    
    // 2. Verificar y decodificar el token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // 3. Verificar si el usuario aún existe en la base de datos
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

    // 4. Adjuntar información del usuario al request
    req.user = {
      id: usuario.id_usuario,
      nombre: usuario.nombre,
      apellido: usuario.apellido,
      rol: usuario.rol.descripcion
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