const express = require("express");
const router = express.Router();
const { getConnection } = require("../database");

router.post("/registrar-persona", async (req, res) => {
  const { registro, nombre, apellido } = req.body;

  if (!registro || !nombre || !apellido) {
    return res.status(400).json({ mensaje: "Faltan datos para crear persona" });
  }

  try {
    const pool = getConnection();
    const [result] = await pool.execute(
      "INSERT INTO Persona (registro, nombre, apellido) VALUES (?, ?, ?)",
      [registro, nombre, apellido]
    );

    res.status(201).json({ mensaje: "Persona creada", id_persona: result.insertId });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: "Error interno al crear persona" });
  }
});

module.exports = router;
