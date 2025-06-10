const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs"); // para comparar la contraseña hasheada
const jwt = require("jsonwebtoken");
const { getConnection } = require("../database");

const JWT_SECRET = process.env.JWT_SECRET; // usa variable .env

router.post("/", async (req, res) => {
  const { nombre_usuario, contrasena } = req.body;

  if (!nombre_usuario || !contrasena) {
    return res
      .status(400)
      .json({ mensaje: "Faltan datos de usuario o contraseña" });
  }

  try {
    const pool = getConnection();

    const [rows] = await pool.execute(
      `SELECT id_usuario, nombre_usuario, password_ , id_rol FROM Usuario WHERE nombre_usuario = ?`,
      [nombre_usuario]
    );

    if (rows.length === 0) {
      return res
        .status(401)
        .json({ mensaje: "Usuario o contraseña incorrectos" });
    }
    const user = rows[0];//obtiene la contra de la base de datos

    const esValido = await bcrypt.compare(contrasena, user.password_);
    if (!esValido) {
      return res
        .status(401)
        .json({ mensaje: "Usuario o contraseña incorrectos" });
    }//compara la contraseña ingresada

    // genera token JWT 
    const token = jwt.sign(
      { id_usuario: user.id_usuario, nombre_usuario: user.nombre_usuario, id_rol:user.id_rol },
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