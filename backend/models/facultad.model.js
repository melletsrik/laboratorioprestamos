module.exports = (sequelize, DataTypes) => {
  const Facultad = sequelize.define(
    "Facultad",
    {
      id_facultad: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      nombre: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
    },
    {
      tableName: "Facultad",
      timestamps: false,
    }
  );

  Facultad.associate = function (models) {
    Facultad.hasMany(models.Carrera, {
      foreignKey: "id_facultad",
      as: "carreras",
    });
  };

  return Facultad;
};
