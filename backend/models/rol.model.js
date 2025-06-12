module.exports = (sequelize, DataTypes) => {
  const Rol = sequelize.define(
    "Rol",
    {
      id_rol: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      descripcion: {
        type: DataTypes.STRING(25),
        allowNull: false,
      },
    },
    {
      tableName: "Rol",
      timestamps: false,
    }
  );

  Rol.associate = function (models) {
    Rol.hasMany(models.Usuario, {
      foreignKey: "id_rol",
      as: "usuarios",
    });
  };

  return Rol;
};
