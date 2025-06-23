module.exports = (sequelize, DataTypes) => {
  const Detalle_Prestamo = sequelize.define(
    "Detalle_Prestamo",
    {
      id_detalle_prestamo: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      id_prestamo: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      id_material: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      cantidad: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          min: 1,
        },
      },
      cantidad_devuelta: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        validate: {
          min: 0,
        },
      },
    },
    {
      tableName: "Detalle_Prestamo",
      timestamps: false,
    }
  );

  Detalle_Prestamo.associate = function (models) {
    Detalle_Prestamo.belongsTo(models.Prestamo, {
      foreignKey: "id_prestamo",
      as: "prestamo",
    });
    
    Detalle_Prestamo.belongsTo(models.Material, {
      foreignKey: "id_material",
      as: "material",
    });
  };

  return Detalle_Prestamo;
};