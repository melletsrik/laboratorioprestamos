const express= require("express");
const morgan= require("morgan"); /*dependencia para ver las peticiones que llegan al servidor*/
const cors= require("cors");
const loginRouter= require("./login"); //importar el router de login
const prestamoRouter= require("./prestamo"); // Asegúrate de importar el router de ventanaPrestamo

//CONFiguracion INICIAL
const app= express();
app.set("port", 4000);

//MIDDLEWARE
app.use(cors({
    origin:["http://localhost:4000"]  //especificar el origen de la peticion del front
}));
app.use(morgan("dev")); //morgan es un middleware que nos ayuda a ver las peticiones que llegan al servidor
app.use(express.json());//debe estar antes de rutas, para que pueda leer el body de las peticiones

/*app our servidaor*/
/*rutas*/
app.use(loginRouter);
app.use(prestamoRouter); // Asegúrate de importar y definir ventanaPrestamoRouter

app.listen(app.get("port"));
console.log("Escuchamos "+app.get("port"));
/*api de tipo rest, api se dedica a dar consultas respuestas, rest es intuitivo consumir esa api */
