const express = require('express');
const router = express.Router();
const estudianteController = require('../controllers/estudiante.controller');
const permissionMiddleware = require('../middlewares/permission.middleware');
const { PERMISSIONS } = require('../constants/permissions');

router.get('/',
  permissionMiddleware([PERMISSIONS.ESTUDIANTE_LISTAR]),
  estudianteController.getAll
);

router.get('/buscar/estudiante',
  permissionMiddleware([PERMISSIONS.ESTUDIANTE_BUSCAR]),
  estudianteController.getByName
);

router.get('/:registro',
  permissionMiddleware([PERMISSIONS.ESTUDIANTE_BUSCAR]),
  estudianteController.getByRegister
);

router.post('/',
  permissionMiddleware([PERMISSIONS.ESTUDIANTE_REGISTRAR]),
  estudianteController.create
);

router.put('/:id',
  permissionMiddleware([PERMISSIONS.ESTUDIANTE_MODIFICAR]),
  estudianteController.update
);

module.exports = router;