  const express = require('express');
  const router = express.Router();
  const estudianteController = require('../controllers/estudiante.controller');
  const roleMiddleware = require('../middlewares/permission.middleware');
  const { PERMISSIONS } = require('../constants/permissions');


  router.get('/', 
    roleMiddleware([PERMISSIONS.ESTUDIANTE_LISTAR]),
    estudianteController.getAll
  );

  router.get('/buscar/nombre', 
  roleMiddleware([PERMISSIONS.ESTUDIANTE_LISTAR]),
    estudianteController.getByName
  );

  router.get('/buscar/registro',
    roleMiddleware(['buscar_estudiante']),
    estudianteController.getByRegister
  );

  router.post('/', 
    roleMiddleware([PERMISSIONS.ESTUDIANTE_REGISTRAR]),
    estudianteController.create
  );

  router.put('/:id',
    roleMiddleware([PERMISSIONS.ESTUDIANTE_MODIFICAR]),
    estudianteController.update
  );

module.exports = router;