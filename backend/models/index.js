const { Sequelize, DataTypes, Op } = require("sequelize");
const config = require("../config/database");

const sequelize = new Sequelize(config);

// Importar modelos manteniendo exactamente los mismos nombres que en los archivos
const db = {
  Rol: require("./rol.model")(sequelize, DataTypes),
  Usuario: require("./usuario.model")(sequelize, DataTypes),
  Persona: require("./persona.model")(sequelize, DataTypes),
  Estudiante: require("./estudiante.model")(sequelize, DataTypes),
  Docente: require("./docente.model")(sequelize, DataTypes),
  Facultad: require("./facultad.model")(sequelize, DataTypes),
  Carrera: require("./carrera.model")(sequelize, DataTypes),
  Materia: require("./materia.model")(sequelize, DataTypes),
  Estado_Prestamo: require("./estado_prestamo.model")(sequelize, DataTypes),
  Material: require("./material.model")(sequelize, DataTypes),
  Prestamo: require("./prestamo.model")(sequelize, DataTypes),
  Detalle_Prestamo: require("./detalle_prestamo.model")(sequelize, DataTypes),
};

// Configurar relaciones
Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

const initializeDatabase = async () => {
  try {
    // Opción 1: Sincronización normal (solo crea lo que no existe)
    await sequelize.sync();
    console.log("✅ Modelos sincronizados");

    // Opción 2: Si necesitas forzar cambios (usa con precaución)
    // await sequelize.sync({ alter: true });
    // console.log('✅ Modelos actualizados (modo alter)');
  } catch (error) {
    console.error("❌ Error de sincronización:", error);
  }
};

initializeDatabase();

module.exports = {
  sequelize,
  Sequelize,
  Op: Op,
  ...db,

};
