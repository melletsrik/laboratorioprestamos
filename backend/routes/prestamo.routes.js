const express = require('express');
const router = express.Router();
const prestamoController = require('../controllers/prestamo.controller');
const permissionMiddleware = require('../middlewares/permission.middleware');
const { PERMISSIONS } = require('../constants/permissions');

router.get('/',
  permissionMiddleware([PERMISSIONS.PRESTAMO_LISTAR]),
  prestamoController.getAll
);

router.get('/activos',
  permissionMiddleware([PERMISSIONS.PRESTAMO_LISTAR]),
  prestamoController.getActivos
);

router.get('/estudiante/:idEstudiante',
  permissionMiddleware([PERMISSIONS.PRESTAMO_BUSCAR]),
  prestamoController.getByEstudiante
);

router.get('/material/:idMaterial',
  permissionMiddleware([PERMISSIONS.PRESTAMO_BUSCAR]),
  prestamoController.getByMaterial
);

router.get('/:id',
  permissionMiddleware([PERMISSIONS.PRESTAMO_BUSCAR]),
  prestamoController.getById
);

router.post('/',
  permissionMiddleware([PERMISSIONS.PRESTAMO_REGISTRAR]),
  prestamoController.create
);

router.put('/:id/devolucion',
  permissionMiddleware([PERMISSIONS.PRESTAMO_DEVOLVER]),
  prestamoController.registrarDevolucion
);

module.exports = router;