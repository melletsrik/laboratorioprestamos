require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { sequelize } = require('./models'); // Importar sequelize para verificar conexión
const routes = require('./routes');

const app = express();

// Verificar conexión a la base de datos al iniciar
sequelize.authenticate()
  .then(() => console.log('✅ Conexión a la base de datos establecida'))
  .catch(err => console.error('❌ Error de conexión a la base de datos:', err));

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rutas
app.use('/api', routes);

// Manejo de errores
app.use((err, req, res, next) => {
  console.error('🔥 Error:', err.stack);
  res.status(500).json({
    success: false,
    message: 'Error interno del servidor',
    error: err.message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
});

// Iniciar servidor
const PORT = process.env.SERVER_PORT || 4000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
  console.log('📌 Endpoints disponibles:');
  console.log(`   - Materiales: http://localhost:${PORT}/api/materiales`);
});

module.exports = app;