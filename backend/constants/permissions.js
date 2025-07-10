module.exports = {
  ROLES: {
    ADMINISTRATIVO: 1,
    AUXILIAR: 2
  },
  
  PERMISSIONS: {
    // Materiales
    MATERIAL_REGISTRAR: 'material:registrar',
    MATERIAL_MODIFICAR: 'material:modificar',
    MATERIAL_LISTAR: 'material:listar',
    MATERIAL_BUSCAR: 'material:buscar',
    
    // Estudiantes
    ESTUDIANTE_REGISTRAR: 'estudiante:registrar',
    ESTUDIANTE_MODIFICAR: 'estudiante:modificar',
    ESTUDIANTE_LISTAR: 'estudiante:listar',
    ESTUDIANTE_BUSCAR: 'estudiante:buscar',
    
    // Docentes
    DOCENTE_REGISTRAR: 'docente:registrar',
    DOCENTE_LISTAR: 'docente:listar',
    DOCENTE_MODIFICAR: 'docente:modificar',
    
    // Usuario
    USUARIO_REGISTRAR: 'usuario:registrar',
    USUARIO_LISTAR: 'usuario:listar',
    USUARIO_MODIFICAR: 'usuario:modificar',

    // Materias
    MATERIA_REGISTRAR: 'materia:registrar',
    MATERIA_MODIFICAR: 'materia:modificar',
    MATERIA_LISTAR: 'materia:listar',
    MATERIA_BUSCAR: 'materia:buscar',
  
    //pretsamo
    PRESTAMO_REGISTRAR: 'prestamo:registrar',
    PRESTAMO_MODIFICAR: 'prestamo:modificar', //maneja la devolucion
    PRESTAMO_LISTAR: 'prestamo:listar',
    PRESTAMO_BUSCAR: 'prestamo:buscar',
  },
  
  ROLE_PERMISSIONS: {
    ADMINISTRATIVO: [
      'material:registrar', 'material:modificar', 'material:listar', 'material:buscar',
      'estudiante:registrar', 'estudiante:modificar', 'estudiante:listar', 'estudiante:buscar',
      'docente:registrar', 'docente:listar', 'docente:modificar',
      'prestamo:registrar', 'prestamo:devolucion',
      'usuario:registrar', 'usuario:listar', 'usuario:modificar',
      'materia:registrar', 'materia:modificar', 'materia:listar', 'materia:buscar',
      'prestamo:registrar', 'prestamo:modificar', 'prestamo:listar', 'prestamo:buscar'
    ],
    AUXILIAR: [
      'material:listar', 'material:buscar','material:registrar', 'material:modificar',
      'estudiante:registrar', 'estudiante:modificar', 'estudiante:listar', 'estudiante:buscar',
      'docente:listar', 
      'prestamo:registrar', 'prestamo:devolucion',
      'materia:registrar', 'materia:modificar', 'materia:listar', 'materia:buscar',
      'prestamo:registrar', 'prestamo:modificar', 'prestamo:listar', 'prestamo:buscar'
    ]
  }
};