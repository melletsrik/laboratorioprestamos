module.exports = (sequelize, DataTypes) => {
  const Estudiante = sequelize.define(
    "Estudiante",
    {
      id_estudiante: {
        type: DataTypes.INTEGER,
        primaryKey: true,
       // autoIncrement: true,
      },
      id_persona: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      Registro: {
        type: DataTypes.STRING(25),
        allowNull: false,
        unique: {
    name: "uq_estudiante_registro",
    msg: "Este número de registro ya está en uso",
  }
      }
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
    Estudiante.hasMany(models.Prestamo, {
      foreignKey: "id_estudiante",
      as: "prestamo",
    });
  };

  return Estudiante;
};
