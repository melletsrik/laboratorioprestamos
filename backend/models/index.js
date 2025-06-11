const { Sequelize, DataTypes } = require('sequelize'); // Añadir DataTypes aquí
const config = require('../config/database');

const sequelize = new Sequelize(config);

const Material = require('./material.model')(sequelize, DataTypes);

sequelize.sync({ alter: true, logging: false })
  .then(() => console.log('✅ Modelos sincronizados'))
  .catch(err => console.error('❌ Error de sincronización:', err.message));

module.exports = {
  sequelize,
  Material
};