module.exports = (sequelize, DataTypes) => {
  const Prestamo = sequelize.define(
    "Prestamo",
    {
      id_prestamo: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      id_estudiante: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      id_docente: {
        type: DataTypes.INTEGER,
      },
      id_materia: {
        type: DataTypes.INTEGER,
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
        defaultValue: DataTypes.NOW,
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
    Prestamo.belongsTo(models.Estudiante, {
      foreignKey: "id_estudiante",
      as: "estudiante",
    });
    
    Prestamo.belongsTo(models.Docente, {
      foreignKey: "id_docente",
      as: "docente",
    });
    
    Prestamo.belongsTo(models.Materia, {
      foreignKey: "id_materia",
      as: "materia",
    });
    
    Prestamo.belongsTo(models.Usuario, {
      foreignKey: "id_usuario_entrega",
      as: "usuarioEntrega",
    });
    
    Prestamo.belongsTo(models.Usuario, {
      foreignKey: "id_usuario_recibe",
      as: "usuarioRecibe",
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