const express = require('express');
const router = express.Router();
const materialController = require('../controllers/material.controller');
const roleMiddleware = require('../middlewares/role.middleware');

// Rutas de consulta (para ambos roles)
router.get('/', 
  roleMiddleware(['listar_materiales']),
  materialController.getAll
);

router.get('/buscar/nombre', 
  roleMiddleware(['buscar_materiales']),
  materialController.getByName
);

router.get('/buscar/:codigo', 
  roleMiddleware(['buscar_material']),
  materialController.getByCode
);

// Rutas de SOLO ADMIN
router.post('/', 
  roleMiddleware(['registrar_materiales']),
  materialController.create
);

router.put('/:id', 
  roleMiddleware(['modificar_materiales']),
  materialController.update
);


module.exports = router;