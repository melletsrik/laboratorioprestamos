const express = require('express');
const router = express.Router();

// Importar todas las rutas
const materialRoutes = require('./material.routes');

// Configurar rutas
router.use('/materiales', materialRoutes);

module.exports = router;