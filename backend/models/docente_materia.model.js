module.exports = (sequelize, DataTypes) => {
  const Docente_Materia = sequelize.define(
    "Docente_Materia",
    {
      id_docente_materia: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      id_materia: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      id_docente: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      tableName: "Docente_Materia",
      timestamps: false,
    }
  );

  Docente_Materia.associate = function (models) {
    Docente_Materia.belongsTo(models.Materia, {
      foreignKey: "id_materia",
      as: "materia",
    });
    Docente_Materia.belongsTo(models.Docente, {
      foreignKey: "id_docente",
      as: "docente",
    });
    Docente_Materia.hasMany(models.Estudiante_Materia, {
      foreignKey: "id_docente_materia",
      as: "estudiantes",
    });
  };

  return Docente_Materia;
};
