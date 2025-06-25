const express = require('express');
const router = express.Router();

// Importar todas las rutas
const authRoutes = require('./auth.routes');
const materialRoutes = require('./material.routes');
const docenteRoutes = require('./docente.routes');
const usuarioRoutes = require('./usuario.routes'); //EN SI SON LAS RUTAS DE USUARIO
const estudianteRoutes = require('./estudiante.routes');
const materiaRoutes = require('./materia.routes');
const prestamoRoutes = require('./prestamo.routes')
// Rutas publicas
router.use('/auth', authRoutes);

// Rutas protegidas (requieren autenticación)
router.use('/materiales', materialRoutes);
router.use('/docentes', docenteRoutes);
router.use('/usuarios', usuarioRoutes);
router.use('/estudiantes', estudianteRoutes);
router.use('/materias',materiaRoutes);
router.use('/prestamos',prestamoRoutes)

// Exporta el router
module.exports = router;