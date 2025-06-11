const express = require('express');
const router = express.Router();
const materialController = require('../controllers/material.controller');
const roleMiddleware = require('../middlewares/role.middleware');

// Rutas de consulta (para ambos roles)
router.get('/', 
  roleMiddleware(['listar_materiales']),
  materialController.getAll
);

router.get('/:id', 
  roleMiddleware(['listar_materiales']),
  materialController.getById
);

router.get('/buscar/nombre', 
  roleMiddleware(['listar_materiales']),
  materialController.getByName
);

router.get('/codigo/:codigo', 
  roleMiddleware(['listar_materiales']),
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

router.delete('/:id', 
  roleMiddleware(['eliminar_materiales']),
  materialController.delete
);

module.exports = router;