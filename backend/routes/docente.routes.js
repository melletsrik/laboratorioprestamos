const express = require('express');
const router = express.Router();
const docenteController = require('../controllers/docente.controller');
const roleMiddleware = require('../middlewares/role.middleware');

router.get('/', 
  roleMiddleware(['listar_docentes']),
  docenteController.getAll
);

router.get('/buscar/docente', 
  roleMiddleware(['listar_docentes']),
  docenteController.getByName
);

router.post('/', 
  roleMiddleware(['registrar_docentes']),
  docenteController.create
);

router.put('/:id',
  roleMiddleware(['editar_docentes']),
  docenteController.update
);

module.exports = router;