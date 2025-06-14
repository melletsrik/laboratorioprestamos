module.exports = {
  ROLES: {
    ADMINISTRATIVO: 'Administrativo',
    AUXILIAR: 'Auxiliar'
  },
  
  PERMISSIONS: {
    // Materiales
    MATERIAL_REGISTRAR: 'material:registrar',
    MATERIAL_MODIFICAR: 'material:modificar',
    MATERIAL_LISTAR: 'material:listar',
    MATERIAL_BUSCAR: 'material:buscar',
    
    // Estudiantes
    ESTUDIANTE_REGISTRAR: 'estudiante:registrar',
    ESTUDIANTE_EDITAR: 'estudiante:editar',
    ESTUDIANTE_LISTAR: 'estudiante:listar',
    ESTUDIANTE_BUSCAR: 'estudiante:buscar',
    
    // Docentes
    DOCENTE_REGISTRAR: 'docente:registrar',
    DOCENTE_LISTAR: 'docente:listar',
    
    // Préstamos
    PRESTAMO_REGISTRAR: 'prestamo:registrar',
    PRESTAMO_DEVOLUCION: 'prestamo:devolucion',
    
    // Auxiliares
    AUXILIAR_REGISTRAR: 'auxiliar:registrar'
  },
  
  ROLE_PERMISSIONS: {
    Administrativo: [
      'material:registrar', 'material:modificar', 'material:listar', 'material:buscar',
      'estudiante:registrar', 'estudiante:editar', 'estudiante:listar', 'estudiante:buscar',
      'docente:registrar', 'docente:listar',
      'prestamo:registrar', 'prestamo:devolucion',
      'auxiliar:registrar'
    ],
    Auxiliar: [
      'material:listar', 'material:buscar',
      'estudiante:registrar', 'estudiante:editar', 'estudiante:listar', 'estudiante:buscar',
      'docente:registrar', 'docente:listar',
      'prestamo:registrar', 'prestamo:devolucion'
    ]
  }
};