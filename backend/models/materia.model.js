module.exports = (sequelize, DataTypes) => {
  const Materia = sequelize.define(
    "Materia",
    {
      id_materia: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      nombre: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      id_carrera: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      tableName: "Materia",
      timestamps: false,
    }
  );

  Materia.associate = function (models) {
    Materia.belongsTo(models.Carrera, {
      foreignKey: "id_carrera",
      as: "carrera",
    });
    Materia.hasMany(models.Docente_Materia, {
      foreignKey: "id_materia",
      as: "docentes",
    });
  };

  return Materia;
};