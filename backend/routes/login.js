const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs"); // para comparar la contraseña hasheada
const jwt = require("jsonwebtoken");
const { getConnection } = require("../database");

const JWT_SECRET = process.env.JWT_SECRET; // usa variable .env

router.post("/", async (req, res) => {
  const { nombre_usuario, contrasena } = req.body;

  if (!nombre_usuario || !contrasena) {
    return res.status(400).json({ mensaje: "Faltan datos de usuario o contraseña" });
  }

  try {
    const pool = getConnection();

    // Ejecutamos la consulta con pool.execute
    const [rows] = await pool.execute(
      "SELECT id_usuario, nombre_usuario, contrasena FROM usuario WHERE nombre_usuario = ?",
      [nombre_usuario]
    );

    if (rows.length === 0) {
      return res.status(401).json({ mensaje: "Usuario o contraseña incorrectos" });
    }

    const user = rows[0];

    // Logs para depurar
    console.log("Usuario encontrado:", user.nombre_usuario);
    console.log("Hash en BD:", user.contrasena);
    console.log("Contraseña recibida:", contrasena);

    // Compara contraseña con bcrypt
    const esValido = await bcrypt.compare(contrasena, user.contrasena);
    console.log("¿Contraseña válida?", esValido);

    if (!esValido) {
      return res.status(401).json({ mensaje: "Usuario o contraseña incorrectos" });
    }

    // Si es válido, genera token JWT (puedes agregar payload que quieras)
    const token = jwt.sign(
      { id_usuario: user.id_usuario, nombre_usuario: user.nombre_usuario },
      JWT_SECRET,
      { expiresIn: "8h" }
    );

    return res.json({ token });
  } catch (error) {
    console.error("Error en login:", error);
    return res.status(500).json({ mensaje: "Error interno del servidor" });
  }
});

module.exports = router;
