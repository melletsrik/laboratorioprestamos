const express = require('express');
const router = express.Router();
const docenteController = require('../controllers/docente.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const roleMiddleware = require('../middlewares/role.middleware');

router.get('/', 
  authMiddleware,
  docenteController.getAll
);

router.get('/:id', 
  authMiddleware,
  docenteController.getById
);

router.post('/', 
  authMiddleware,
  roleMiddleware(['Administrativo']),
  docenteController.create
);

module.exports = router;