const express = require('express');
const router = express.Router();
const prestamoController = require('../controllers/prestamo.controller');
const permissionMiddleware = require('../middlewares/permission.middleware');
const { PERMISSIONS } = require('../constants/permissions');

// Listar préstamos
router.get('/', 
  permissionMiddleware([PERMISSIONS.PRESTAMO_LISTAR]),
  prestamoController.getAll
);

// Obtener préstamos por estudiante
router.get('/estudiante/:registro',
  permissionMiddleware([PERMISSIONS.PRESTAMO_LISTAR]),
  prestamoController.getByStudent
);

// Obtener préstamo por ID
router.get('/:id',
  permissionMiddleware([PERMISSIONS.PRESTAMO_BUSCAR]),
  prestamoController.getById
);

// Registrar nuevo préstamo
router.post('/',
  permissionMiddleware([PERMISSIONS.PRESTAMO_REGISTRAR]),
  prestamoController.create
);

// Registrar devolución (Endpoint específico)
router.put('/:id/devolver',
  permissionMiddleware([PERMISSIONS.PRESTAMO_MODIFICAR]),
  prestamoController.registrarDevolucion
);

// Actualización general (solo campos no críticos)
router.put('/:id',
  permissionMiddleware([PERMISSIONS.PRESTAMO_MODIFICAR]),
  prestamoController.update
);

module.exports = router;