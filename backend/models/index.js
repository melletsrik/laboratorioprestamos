const { Sequelize, DataTypes } = require('sequelize');
const config = require('../config/database');

const sequelize = new Sequelize(config);

// Importar modelos en el orden correcto
const db = {
  Rol: require('./rol.model')(sequelize, DataTypes),
  Usuario: require('./usuario.model')(sequelize, DataTypes),
  Persona: require('./persona.model')(sequelize, DataTypes),
  Estudiante: require('./estudiante.model')(sequelize, DataTypes),
  Docente: require('./docente.model')(sequelize, DataTypes),
  Material: require('./material.model')(sequelize, DataTypes),
  Prestamo: require('./prestamo.model')(sequelize, DataTypes),
  DetallePrestamo: require('./detalle_prestamo.model')(sequelize, DataTypes)
};

// Configurar relaciones
Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

// Sincronizar modelos con la base de datos
sequelize.sync({ alter: true, logging: console.log })
  .then(() => console.log('✅ Modelos sincronizados'))
  .catch(err => console.error('❌ Error de sincronización:', err));

module.exports = {
  sequelize,
  Sequelize,
  ...db
};