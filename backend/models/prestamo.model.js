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
        allowNull: true,
      },
      id_materia: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      id_usuario_entrega: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      id_usuario_recibe: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      fecha_prestamo: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      fecha_devolucion: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      id_modulo: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      id_semestre: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      id_estado: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      observaciones: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
    },
    {
      tableName: "Prestamo",
      timestamps: false,
    }
  );

  // models/prestamo.model.js
  Prestamo.associate = (models) => {
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

    // Agrega esta asociación para cargar materiales a través de detalles
    Prestamo.belongsToMany(models.Material, {
      through: models.Detalle_Prestamo,
      foreignKey: "id_prestamo",
      otherKey: "id_material",
      as: "materiales",
    });
  };
  return Prestamo;
};
