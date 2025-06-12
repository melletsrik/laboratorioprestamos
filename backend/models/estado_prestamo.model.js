module.exports = (sequelize, DataTypes) => {
  const Estado_Prestamo = sequelize.define(
    "Estado_Prestamo",
    {
      id_estado: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      nombre: {
        type: DataTypes.STRING(20),
        allowNull: false,
        unique: true,
      },
    },
    {
      tableName: "Estado_Prestamo",
      timestamps: false,
    }
  );

  Estado_Prestamo.associate = function (models) {
    Estado_Prestamo.hasMany(models.Prestamo, {
      foreignKey: "id_estado",
      as: "prestamos",
    });
  };

  return Estado_Prestamo;
};