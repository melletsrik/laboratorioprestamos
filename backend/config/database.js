require("dotenv").config();

module.exports = {
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  host: process.env.DB_HOST,
  dialect: "mysql",
  logging: false, // Esto desactiva los logs de SQL
   timezone: '-04:00', // Establece el timezone para Sequelize
  dialectOptions: {
    dateStrings: true, // Permite manejar fechas como strings
    typeCast:true,
  }
};