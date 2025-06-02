const express = require("express");
const router = express.Router();
const database = require("../database");
const bcrypt = require("bcryptjs");

router.post("/usuarios", async (req, res) => {
  try {
    const { id_persona, id_rol, username, password } = req.body;

    if (!id_persona || !id_rol || !username || !password) {
      return res.status(400).json({ message: "Faltan datos obligatorios" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const connection = database.getConnection();

    const existing = await connection.query(
      "SELECT * FROM usuario WHERE username = ?",
      [username]
    );

    if (existing.length > 0) {
      return res.status(409).json({ message: "El nombre de usuario ya existe" });
    }

    await connection.query(
      `INSERT INTO usuario (id_persona, id_rol, username, password) VALUES (?, ?, ?, ?)`,
      [id_persona, id_rol, username, hashedPassword]
    );

    res.status(201).json({ message: "Usuario creado exitosamente" });
  } catch (error) {
    console.error("Error al crear usuario:", error);
    res.status(500).json({ message: "Error al crear usuario" });
  }
});

module.exports = router;
