const express = require('express');
const router = express.Router();

// Importar todas las rutas
const authRoutes = require('./auth.routes');
const materialRoutes = require('./material.routes');

// Rutas publicas
router.use('/auth', authRoutes);

// Rutas protegidas (requieren autenticación)
router.use('/materiales', materialRoutes);

module.exports = router;