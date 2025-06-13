module.exports = (requiredPermissions) => {
  return (req, res, next) => {
    try {
      const userRole = req.user.rol;

      // Definir permisos por rol
      const rolePermissions = {
        Administrativo: [
          // Estudiantes
          "registrar_estudiantes",
          "listar_estudiantes",
          "buscar_estudiante",
          'editar_estudiantes',
          // Docentes
          "registrar_docentes",
          "listar_docentes",
          // Materiales
          "listar_materiales",
          "registrar_materiales",
          "modificar_materiales",
          "buscar_material",
          "buscar_materiales",
          // Materias
          "registrar_materias",
          "listar_materias",
          // Préstamos
          "registrar_prestamos",
          "registrar_devoluciones",
          // Auxiliares
          "registrar_auxiliares",
        ],
        Auxiliar: [
          //Estudiante
          "registrar_estudiantes",
          "listar_estudiantes",
          "buscar_estudiante",
          'editar_estudiantes',
          // Docentes
          "registrar_docentes",
          "listar_docentes",
          //Docente
          "registrar_docentes",
          "registrar_materias",
          // Materiales
          "listar_materiales",
          "buscar_material",
          "buscar_materiales",
          //Prestamos
          "registrar_prestamos",
          "registrar_devoluciones",
          //Materia
        ],
      };

      // Verificar si el rol tiene los permisos requeridos
      const tienePermiso = requiredPermissions.every((perm) =>
        rolePermissions[userRole]?.includes(perm)
      );

      if (!tienePermiso) {
        throw new Error("No tienes permisos para esta acción");
      }

      next();
    } catch (error) {
      return res.status(403).json({
        success: false,
        error: error.message,
      });
    }
  };
};
