const express = require("express");
const router = express.Router();
const database = require("./database");

router.post("/login", async (req, res) => {
    const { usuario, password } = req.body;
    try {
        const connection = await database.getConnection();
        const result = await connection.query(
              "SELECT * FROM usuario WHERE nombre_usuario = ? AND contraseña = ?",
            [usuario, password]
        );
        if (result.length > 0) {
            res.json({ acceso: true, rol: result[0].rol }); //envías el rol
        } else {
            res.json({ acceso: false });
        }
    } catch (error) {
        console.error(error); // <-- Esto mostrará el error real en la terminal
        res.status(500).json({ error: "Error en el servidor" });
    }
});
module.exports = router; // Exportar el router para usarlo en index.js