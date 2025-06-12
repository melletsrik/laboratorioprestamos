module.exports = (sequelize, DataTypes) => {
  const Material = sequelize.define(
    "Material",
    {
      id_material: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      codigo_material: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
      },
      nombre: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      cantidad_total: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        validate: {
          min: 0,
        },
      },
      especificaciones: {
        type: DataTypes.TEXT,
      },
    },
    {
      tableName: "Material",
      timestamps: false,
    }
  );

  Material.associate = function (models) {
    Material.hasMany(models.Detalle_Prestamo, {
      foreignKey: "id_material",
      as: "detalles_prestamos",
    });
  };

  return Material;
};