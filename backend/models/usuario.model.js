module.exports = (sequelize, DataTypes) => {
  const Usuario = sequelize.define('Usuario', {
    id_usuario: {
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
    },
    nombre_usuario: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true
    },
    password_: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    id_rol: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Rol',
        key: 'id_rol'
      }
    }
  }, {
    tableName: 'Usuario',
    timestamps: false
  });

  Usuario.associate = function(models) {
    Usuario.belongsTo(models.Rol, {
      foreignKey: 'id_rol',
      as: 'rol'
    });
  };

  return Usuario;
};