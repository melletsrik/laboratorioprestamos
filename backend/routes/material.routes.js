const express = require('express');
const router = express.Router();
const materialController = require('../controllers/material.controller');
const roleMiddleware = require('../middlewares/role.middleware');

// Rutas del material
router.get('/', materialController.getAll);
router.get('/:id', materialController.getById);
router.get('/buscar/nombre', materialController.getByName);
router.post('/', materialController.create);
router.put('/:id', materialController.update);
router.delete('/:id', materialController.delete);
router.get('/codigo/:codigo', materialController.getByCode);

router.post('/', 
  roleMiddleware(['Administrativo', 'Auxiliar']),
  materialController.create
);
router.put('/:id', 
  roleMiddleware(['Administrativo', 'Auxiliar']),
  materialController.update
);
router.delete('/:id', 
  roleMiddleware(['Administrativo']),
  materialController.delete
);



module.exports = router;