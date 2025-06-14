const { PERMISSIONS } = require('../constants/permissions');

module.exports = (requiredPermissions) => {
  return (req, res, next) => {
    try {
      if (!req.user) {
        throw new Error('Usuario no autenticado');
      }

      // Verificar cada permiso requerido
      const hasAllPermissions = requiredPermissions.every(permission => 
        req.user.permissions.includes(permission)
      );

      if (!hasAllPermissions) {
        throw new Error('No tienes los permisos necesarios para esta acción');
      }

      next();
    } catch (error) {
      return res.status(403).json({
        success: false,
        error: error.message
      });
    }
  };
};