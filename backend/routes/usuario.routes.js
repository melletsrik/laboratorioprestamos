const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/usuario.controller');
const permissionMiddleware = require('../middlewares/permission.middleware');
const { PERMISSIONS } = require('../constants/permissions');

// Rutas protegidas para administradores
router.post('/',
  permissionMiddleware([PERMISSIONS.USUARIO_REGISTRAR]),
  usuarioController.createUsuario
);

router.get('/',
  permissionMiddleware([PERMISSIONS.USUARIO_LISTAR]),
  usuarioController.getAll
);

router.put('/:id/estado',
  permissionMiddleware([PERMISSIONS.USUARIO_MODIFICAR]),
  usuarioController.updateEstado
);

module.exports = router;