module.exports = (sequelize, DataTypes) => {
  const Docente = sequelize.define(
    "Docente",
    {
      id_docente: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      id_persona: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      estado: { // <-- Agrega esto
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
    },
    {
      tableName: "Docente",
      timestamps: false,
    }
  );

  Docente.associate = function (models) {
    Docente.belongsTo(models.Persona, {
      foreignKey: "id_persona",
      as: "persona",
    });
    Docente.hasMany(models.Docente_Materia, {
      foreignKey: "id_docente",
      as: "materias",
    });
  };

  return Docente;
};
