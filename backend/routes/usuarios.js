const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const { getConnection } = require("../database");

router.post("/registrar-usuario", async (req, res) => {
  const { id_persona, nombre_usuario, password, rol } = req.body;

  if (!id_persona || !nombre_usuario || !password || !rol) {
    return res.status(400).json({ mensaje: "Faltan datos obligatorios" });
  }

  try {
    const pool = getConnection();

    // Verificar que persona exista
    const [personaRows] = await pool.execute(
      "SELECT * FROM Persona WHERE id_persona = ?",
      [id_persona]
    );
    if (personaRows.length === 0) {
      return res.status(404).json({ mensaje: "La persona no existe" });
    }

    // Verificar que no exista nombre_usuario duplicado
    const [usuarioRows] = await pool.execute(
      "SELECT * FROM Usuario WHERE nombre_usuario = ?",
      [nombre_usuario]
    );
    if (usuarioRows.length > 0) {
      return res.status(409).json({ mensaje: "El nombre de usuario ya está en uso" });
    }

    // Hashear contraseña
    const passwordHash = await bcrypt.hash(password, 10);

    // Insertar usuario
    const [result] = await pool.execute(
      "INSERT INTO Usuario (id_persona, nombre_usuario, password_, rol) VALUES (?, ?, ?, ?)",
      [id_persona, nombre_usuario, passwordHash, rol]
    );

    res.status(201).json({ mensaje: "Usuario creado", id_usuario: result.insertId });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: "Error interno" });
  }
});

module.exports = router;
