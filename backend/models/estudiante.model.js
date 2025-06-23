module.exports = (sequelize, DataTypes) => {
  const Estudiante = sequelize.define(
    "Estudiante",
    {
      id_estudiante: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      id_persona: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      Registro: {
        type: DataTypes.STRING(25),
        allowNull: false,
        unique: true,
      },
      estado: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
    },
    {
      tableName: "Estudiante",
      timestamps: false,
    },
  );

  Estudiante.associate = function (models) {
    Estudiante.belongsTo(models.Persona, {
      foreignKey: "id_persona",
      as: "persona",
    });
    Estudiante.hasMany(models.Estudiante_Materia, {
      foreignKey: "id_estudiante",
      as: "materias",
    });
  };

  return Estudiante;
};
