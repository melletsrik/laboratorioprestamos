const { Sequelize, DataTypes } = require('sequelize'); // Añadir DataTypes aquí
const config = require('../config/database');

// 1. Configurar conexión a la base de datos
const sequelize = new Sequelize(
  config.development.database,
  config.development.username,
  config.development.password,
  {
    host: config.development.host,
    dialect: config.development.dialect,
  }
);

// 2. Importar modelos
const Material = require('./material.model')(sequelize, DataTypes); // Pasar DataTypes

// 3. Sincronizar modelos
sequelize.sync({ alter: true })
  .then(() => console.log('✅ Modelos sincronizados con la base de datos'))
  .catch(err => console.error('❌ Error al sincronizar modelos:', err));

module.exports = {
  sequelize,
  Material
};