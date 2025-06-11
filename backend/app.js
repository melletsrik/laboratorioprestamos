require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { sequelize } = require('./models');
const routes = require('./routes');

const app = express();

// Conexión a BD
sequelize.authenticate()
  .then(() => console.log('✅ Conectado a MySQL'))
  .catch(err => console.error('❌ Error de conexión:', err.message));

// Middlewares basicos
app.use(cors());
app.use(express.json());

// Rutas
app.use('/api', routes);

// Manejo de errores simplificado
app.use((err, req, res, next) => {
  console.error('Error:', err.message);
  res.status(500).json({ error: 'Error interno' });
});

// Inicio del servidor
const PORT = process.env.SERVER_PORT || 4000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});

module.exports = app;