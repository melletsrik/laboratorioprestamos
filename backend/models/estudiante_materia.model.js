module.exports = (sequelize, DataTypes) => {
  const Estudiante_Materia = sequelize.define(
    "Estudiante_Materia",
    {
      id_estudiantes_materia: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      id_estudiante: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      id_docente_materia: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      id_modulo: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      id_semestre: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      tableName: "Estudiante_Materia",
      timestamps: false,
    }
  );

  Estudiante_Materia.associate = function (models) {
    Estudiante_Materia.belongsTo(models.Estudiante, {
      foreignKey: "id_estudiante",
      as: "estudiante",
    });
    Estudiante_Materia.belongsTo(models.Docente_Materia, {
      foreignKey: "id_docente_materia",
      as: "docente_materia",
    });
    Estudiante_Materia.hasMany(models.Prestamo, {
      foreignKey: "id_estudiantes_materia",
      as: "prestamos",
    });
  };

  return Estudiante_Materia;
};