const mysql= require ("promise-mysql");
const dotenv= require("dotenv");
dotenv.config(); //cargar las variables de entorno

const connection= mysql.createConnection({
    host: process.env.HOST,
    database: process.env.DATABASE,
    user:process.env.USER,
    password:process.env.PASSWORD
    /*no poner el password aca, ya q cuando se pase el programa es inseguro. */
})

 const getConnection=async ()=> await connection;

 module.exports={ //exportar getconnection
    getConnection
 }