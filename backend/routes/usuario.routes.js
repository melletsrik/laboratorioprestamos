// const express = require('express');
// const router = express.Router();
// const usuarioController = require('../controllers/usuario.controller');
// const authMiddleware = require('../middlewares/auth.middleware');
// const roleMiddleware = require('../middlewares/role.middleware');

// // Solo administrativos pueden gestionar auxiliares
// router.use(authMiddleware);
// router.use(roleMiddleware(['registrar_auxiliares']));

// router.post('/', usuarioController.createAuxiliar);
// router.get('/:id', usuarioController.getAuxiliarById);

// module.exports = router;