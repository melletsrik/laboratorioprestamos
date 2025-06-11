module.exports = (sequelize, DataTypes) => {
  const Persona = sequelize.define('Persona', {
    id_persona: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    nombre: {
      type: DataTypes.STRING(25),
      allowNull: false
    },
    apellido: {
      type: DataTypes.STRING(50),
      allowNull: false
    }
  }, {
    tableName: 'Persona',
    timestamps: false
  });

  Persona.associate = function(models) {
    Persona.hasOne(models.Estudiante, {
      foreignKey: 'id_persona',
      as: 'estudiante'
    });
    Persona.hasOne(models.Docente, {
      foreignKey: 'id_persona',
      as: 'docente'
    });
  };

  return Persona;
};