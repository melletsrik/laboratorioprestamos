const express = require('express');
const router = express.Router();
const estudianteController = require('../controllers/estudiante.controller');
const permissionMiddleware = require('../middlewares/permission.middleware');
const { PERMISSIONS } = require('../constants/permissions');

// Obtener todos los estudiantes
router.get('/', 
  permissionMiddleware([PERMISSIONS.ESTUDIANTE_LISTAR]),
  estudianteController.getAll
);

// Buscar estudiantes por nombre o apellido
router.get('/buscar',
  permissionMiddleware([PERMISSIONS.ESTUDIANTE_BUSCAR]),
  estudianteController.getByName
);

// Obtener estudiante por registro
router.get('/registro/:registro',
  permissionMiddleware([PERMISSIONS.ESTUDIANTE_BUSCAR]),
  estudianteController.getByRegister
);

// Crear nuevo estudiante
router.post('/', 
  permissionMiddleware([PERMISSIONS.ESTUDIANTE_REGISTRAR]),
  estudianteController.create
);

// Actualizar estudiante
router.put('/:id',
  permissionMiddleware([PERMISSIONS.ESTUDIANTE_MODIFICAR]),
  estudianteController.update
);
module.exports = router;