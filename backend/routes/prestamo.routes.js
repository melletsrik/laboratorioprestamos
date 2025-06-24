const express = require('express');
const router = express.Router();
const prestamoController = require('../controllers/prestamo.controller');
const permissionMiddleware = require('../middlewares/permission.middleware');
const { PERMISSIONS } = require('../constants/permissions');

router.get('/', 
  permissionMiddleware([PERMISSIONS.PRESTAMO_LISTAR]),
  prestamoController.getAll
);

router.get('/estudiante/:registro',
  permissionMiddleware([PERMISSIONS.PRESTAMO_LISTAR]),
  prestamoController.getByStudent
);

router.get('/:id',
  permissionMiddleware([PERMISSIONS.PRESTAMO_BUSCAR]),
  prestamoController.getById
);

// Rutas para registrar y actualizar
router.post('/',
  permissionMiddleware([PERMISSIONS.PRESTAMO_REGISTRAR]),
  prestamoController.create
);

router.put('/:id',
  permissionMiddleware([PERMISSIONS.PRESTAMO_MODIFICAR]),
  prestamoController.update
);

module.exports = router;