require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { sequelize } = require('./models');
const authMiddleware = require('./middlewares/auth.middleware');

const app = express();

// Conexión a BD
sequelize.authenticate()
  .then(() => console.log('✅ Conectado a MySQL'))
  .catch(err => console.error('❌ Error de conexión:', err.message));

// Middlewares básicos
app.use(cors());
app.use(express.json());

// Ruta de prueba pública
app.get('/api/public', (req, res) => {
  res.json({ message: 'Ruta pública accesible' });
});

// Importa las rutas
const authRoutes = require('./routes/auth.routes');
const protectedRoutes = require('./routes'); // Importa routes/index.js
const reporteRoutes = require('./routes/reporte.routes');

// Rutas públicas (login)
app.use('/api/auth', authRoutes);

// Middleware de autenticación para rutas API
app.use('/api', authMiddleware); // Aplica primero el middleware

// Monta todas las rutas protegidas
app.use('/api', protectedRoutes); // Luego las rutas protegidas
app.use('/api/reporte', reporteRoutes);

// Manejo de errores
app.use((err, req, res, next) => {
  console.error('Error:', err.message);
  res.status(500).json({ 
    success: false,
    error: 'Error interno del servidor' 
  });
});

// Ruta no encontrada
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Ruta no encontrada'
  });
});

// Inicio del servidor
const PORT = process.env.SERVER_PORT || 4000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});

module.exports = app;