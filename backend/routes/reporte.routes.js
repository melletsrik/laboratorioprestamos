const express = require('express');
const router = express.Router();
const reporteController = require('../controllers/reporte.controller');

// Ruta para obtener reporte de préstamos
router.get('/prestamos', reporteController.getReportePrestamos);

module.exports = router;
