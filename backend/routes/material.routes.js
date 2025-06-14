const express = require('express');
const router = express.Router();
const materialController = require('../controllers/material.controller');
const permissionMiddleware = require('../middlewares/permission.middleware');
const { PERMISSIONS } = require('../constants/permissions');

// Rutas de consulta (para ambos roles)
router.get('/', 
  permissionMiddleware([PERMISSIONS.MATERIAL_LISTAR]),
  materialController.getAll
);

router.get('/buscar/material', 
  permissionMiddleware([PERMISSIONS.MATERIAL_BUSCAR]),
  materialController.getByName
);

router.get('/:codigo', 
  permissionMiddleware([PERMISSIONS.MATERIAL_BUSCAR]),
  materialController.getByCode
);

// Rutas de SOLO ADMIN
router.post('/', 
  permissionMiddleware([PERMISSIONS.MATERIAL_REGISTRAR]),
  materialController.create
);

router.put('/:id', 
  permissionMiddleware([PERMISSIONS.MATERIAL_MODIFICAR]),
  materialController.update
);

module.exports = router;