module.exports = (sequelize, DataTypes) => {
  const DetallePrestamo = sequelize.define('DetallePrestamo', {
    id_detalle_prestamo: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    id_prestamo: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    id_material: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    cantidad: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    cantidad_devuelta: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    }
  }, {
    tableName: 'Detalle_Prestamo',
    timestamps: false
  });

  DetallePrestamo.associate = function(models) {
    DetallePrestamo.belongsTo(models.Material, {
      foreignKey: 'id_material',
      as: 'material'
    });
    DetallePrestamo.belongsTo(models.Prestamo, {
      foreignKey: 'id_prestamo',
      as: 'prestamo'
    });
  };

  return DetallePrestamo;
};