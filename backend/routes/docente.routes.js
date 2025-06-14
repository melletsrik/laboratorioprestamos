const express = require('express');
const router = express.Router();
const docenteController = require('../controllers/docente.controller');
const permissionMiddleware = require('../middlewares/permission.middleware');
const { PERMISSIONS } = require('../constants/permissions');

router.get('/', 
  permissionMiddleware([PERMISSIONS.DOCENTE_LISTAR]),
  docenteController.getAll
);

router.get('/buscar/docente', 
  permissionMiddleware([PERMISSIONS.DOCENTE_LISTAR]),
  docenteController.getByName
);

router.post('/', 
  permissionMiddleware([PERMISSIONS.DOCENTE_REGISTRAR]),
  docenteController.create
);

router.put('/:id',
  permissionMiddleware([PERMISSIONS.DOCENTE_EDITAR]),
  docenteController.update
);

module.exports = router;