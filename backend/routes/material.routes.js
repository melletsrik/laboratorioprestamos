const express = require('express');
const router = express.Router();
const materialController = require('../controllers/material.controller');

// CRUD básico para materiales
router.get('/', materialController.getAll);
router.get('/:id', materialController.getById);
router.post('/', materialController.create);
router.put('/:id', materialController.update);
router.delete('/:id', materialController.delete);

// Ruta especial para buscar por código
router.get('/codigo/:codigo', materialController.getByCode);

module.exports = router;