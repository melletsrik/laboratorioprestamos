module.exports = (sequelize, DataTypes) => {
  const Usuario = sequelize.define(
    "Usuario",
    {
      id_usuario: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      nombre: {
        type: DataTypes.STRING(25),
        allowNull: false,
      },
      apellido: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
      nombre_usuario: {
        type: DataTypes.STRING(50),
        allowNull: false,
          unique: {
    name: "uq_usuario_nombre_usuario",
    msg: "Este nombre de usuario ya está en uso"
  }
      },
      password_: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      id_rol: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      estado: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true
      }
    },
    {
      tableName: "Usuario",
      timestamps: false,
    }
  );

  Usuario.associate = function (models) {
    Usuario.belongsTo(models.Rol, {
      foreignKey: "id_rol",
      as: "rol",
    });
    Usuario.hasMany(models.Prestamo, {
      foreignKey: "id_usuario_entrega",
      as: "prestamos_entregados",
    });
    Usuario.hasMany(models.Prestamo, {
      foreignKey: "id_usuario_recibe",
      as: "prestamos_recibidos",
    });
  };

  return Usuario;
};