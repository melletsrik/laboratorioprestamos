const express = require('express');
const router = express.Router();
const materiaController = require('../controllers/materia.controller');
const permissionMiddleware = require('../middlewares/permission.middleware');
const { PERMISSIONS } = require('../constants/permissions');

router.get('/',
  permissionMiddleware([PERMISSIONS.MATERIA_LISTAR]),
  materiaController.getAll
);

router.get('/buscar/nombre',
  permissionMiddleware([PERMISSIONS.MATERIA_BUSCAR]),
  materiaController.getByName
);

router.get('/:id',
  permissionMiddleware([PERMISSIONS.MATERIA_BUSCAR]),
  materiaController.getById
);

router.post('/',
  permissionMiddleware([PERMISSIONS.MATERIA_REGISTRAR]),
  materiaController.create
);

router.put('/:id',
  permissionMiddleware([PERMISSIONS.MATERIA_EDITAR]),
  materiaController.update
);

module.exports = router;