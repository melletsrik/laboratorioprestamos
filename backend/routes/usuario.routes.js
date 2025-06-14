const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/usuario.controller');
const permissionMiddleware = require('../middlewares/permission.middleware');
const { PERMISSIONS } = require('../constants/permissions');

// Rutas protegidas para administradores
router.post('/',
  permissionMiddleware([PERMISSIONS.AUXILIAR_REGISTRAR]),
  usuarioController.createAuxiliar
);

router.get('/',
  permissionMiddleware([PERMISSIONS.AUXILIAR_LISTAR]),
  usuarioController.getAllAuxiliares
);

module.exports = router;