module.exports = (rolesPermitidos) => {
  return (req, res, next) => {
    try {
      if (!rolesPermitidos.includes(req.user.rol)) {
        throw new Error('No autorizado');
      }
      next();
    } catch (error) {
      return res.status(403).json({
        error: 'No tienes permisos para esta acción'
      });
    }
  };
};