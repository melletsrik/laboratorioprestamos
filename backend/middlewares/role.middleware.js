module.exports = (requiredPermissions) => {
  return (req, res, next) => {
    try {
      const userRole = req.user.rol;
      
      // Definir permisos por rol
      const rolePermissions = {
        'Administrativo': [
          'registrar_prestamos', 'registrar_estudiantes', 'registrar_auxiliares',
          'registrar_devoluciones', 'registrar_docentes', 'registrar_materiales',
          'registrar_materias', 'listar_materiales', 'listar_prestamos', 'listar_docentes'
        ],
        'Auxiliar': [
           'registrar_prestamos', 'registrar_devoluciones', 'registrar_docentes', 
           'registrar_materias', 
          'listar_materiales', 'listar_prestamos', 'listar_docentes'
        ]
      };

      // Verificar si el rol tiene los permisos requeridos
      const tienePermiso = requiredPermissions.every(perm => 
        rolePermissions[userRole]?.includes(perm)
      );

      if (!tienePermiso) {
        throw new Error('No tienes permisos para esta acción');
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