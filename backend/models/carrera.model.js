module.exports = (sequelize, DataTypes) => {
  const Carrera = sequelize.define(
    "Carrera",
    {
      id_carrera: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      nombre: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      id_facultad: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      tableName: "Carrera",
      timestamps: false,
    }
  );

  Carrera.associate = function (models) {
    Carrera.belongsTo(models.Facultad, {
      foreignKey: "id_facultad",
      as: "facultad",
    });
    Carrera.hasMany(models.Materia, {
      foreignKey: "id_carrera",
      as: "materias",
    });
  };

  return Carrera;
};
