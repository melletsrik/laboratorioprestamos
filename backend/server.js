require("dotenv").config(); // Siempre va al inicio, antes de usar variables de entorno
const express = require("express");
const morgan = require("morgan"); /*dependencia para ver las peticiones que llegan al servidor*/
const cors = require("cors");
// const { getPool } = require("../database"); // No es necesario aquí, úsalo en los routers

//RUTAS
const loginRouter = require("./routes/login"); //importar el router de login
const prestamosRouter = require("./routes/prestamos"); // Asegúrate de importar el router de ventanaPrestamo
const usuariosRouter = require("./routes/usuarios");

const personasRouter = require("./routes/personas");
const docentesRouter = require("./routes/docentes");
const estudiantesRouter = require("./routes/estudiantes");

//CONFIGURACION INICIAL
const app = express();
const PORT = process.env.SERVER_PORT || 4000;

//MIDDLEWARE
app.use(cors());

app.use(morgan("dev")); //morgan es un middleware que nos ayuda a ver las peticiones que llegan al servidor
app.use(express.json()); //debe estar antes de rutas, para que pueda leer el body de las peticiones

// NO necesitas llamar a initConnection ni a getPool aquí si usas pool en los routers

/// RUTAS
app.use("/login", loginRouter);
app.use("/prestamos", prestamosRouter);

app.use("/usuarios", usuariosRouter)
app.use("/personas", personasRouter);

app.use("/docentes", docentesRouter);
app.use("/estudiantes", estudiantesRouter);

// LEVANTAR SERVIDOR
app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});
/*api de tipo rest, api se dedica a dar consultas respuestas, rest es intuitivo consumir esa api */