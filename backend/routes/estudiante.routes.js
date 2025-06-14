  const express = require('express');
  const router = express.Router();
  const estudianteController = require('../controllers/estudiante.controller');
  const roleMiddleware = require('../middlewares/permission.middleware');

  router.get('/', 
    roleMiddleware(['listar_estudiantes']),
    estudianteController.getAll
  );

  router.get('/buscar/nombre', 
    roleMiddleware(['buscar_estudiante']),
    estudianteController.getByName
  );

  router.get('/buscar/registro', 
    roleMiddleware(['buscar_estudiante']),
    estudianteController.getByRegister
  );

  router.post('/', 
    roleMiddleware(['registrar_estudiantes']),
    estudianteController.create
  );

  router.put('/:id',
    roleMiddleware(['editar_estudiantes']),
    estudianteController.update
  );

  module.exports = router;