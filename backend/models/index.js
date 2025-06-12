const { Sequelize, DataTypes } = require('sequelize');
const config = require('../config/database');

const sequelize = new Sequelize(config);

// Importar modelos manteniendo exactamente los mismos nombres que en los archivos
const db = {
  Rol: require('./rol.model')(sequelize, DataTypes),
  Usuario: require('./usuario.model')(sequelize, DataTypes),
  Persona: require('./persona.model')(sequelize, DataTypes),
  Estudiante: require('./estudiante.model')(sequelize, DataTypes),
  Docente: require('./docente.model')(sequelize, DataTypes),
  Facultad: require('./facultad.model')(sequelize, DataTypes),
  Carrera: require('./carrera.model')(sequelize, DataTypes),
  Materia: require('./materia.model')(sequelize, DataTypes),
  Docente_Materia: require('./docente_materia.model')(sequelize, DataTypes),
  Estudiante_Materia: require('./estudiante_materia.model')(sequelize, DataTypes),
  Estado_Prestamo: require('./estado_prestamo.model')(sequelize, DataTypes),
  Material: require('./material.model')(sequelize, DataTypes),
  Prestamo: require('./prestamo.model')(sequelize, DataTypes),
  Detalle_Prestamo: require('./detalle_prestamo.model')(sequelize, DataTypes)
};

// Configurar relaciones
Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

// Sincronizar modelos con la base de datos
sequelize.sync({ alter: true })
  .then(() => console.log('✅ Modelos sincronizados'))
  .catch(err => console.error('❌ Error de sincronización:', err));

module.exports = {
  sequelize,
  Sequelize,
  ...db
};