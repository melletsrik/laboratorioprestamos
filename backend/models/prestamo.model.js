module.exports = (sequelize, DataTypes) => {
  const Prestamo = sequelize.define(
    "Prestamo",
    {
      id_prestamo: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      id_estudiantes_materia: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      id_usuario_entrega: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      id_usuario_recibe: {
        type: DataTypes.INTEGER,
      },
      fecha_prestamo: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      fecha_devolucion: {
        type: DataTypes.DATE,
      },
      observaciones: {
        type: DataTypes.TEXT,
      },
      id_estado: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      tableName: "Prestamo",
      timestamps: false,
    }
  );

  Prestamo.associate = function (models) {
    Prestamo.belongsTo(models.Estudiante_Materia, {
      foreignKey: "id_estudiantes_materia",
      as: "estudiante_materia",
    });
    Prestamo.belongsTo(models.Usuario, {
      foreignKey: "id_usuario_entrega",
      as: "usuario_entrega",
    });
    Prestamo.belongsTo(models.Usuario, {
      foreignKey: "id_usuario_recibe",
      as: "usuario_recibe",
    });
    Prestamo.belongsTo(models.Estado_Prestamo, {
      foreignKey: "id_estado",
      as: "estado",
    });
    Prestamo.hasMany(models.Detalle_Prestamo, {
      foreignKey: "id_prestamo",
      as: "detalles",
    });
  };

  return Prestamo;
};