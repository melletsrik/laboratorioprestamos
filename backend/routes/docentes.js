const express = require("express");
const router = express.Router();
const { getConnection } = require("../database");

router.post("/registrar-docente", async (req, res) => {
  const { p_nRegistro, p_cNombre, p_cApellido } = req.body;

  if (!p_nRegistro || !p_cNombre || !p_cApellido) {
    return res.status(400).json({ mensaje: "Faltan datos obligatorios" });
  }

  try {
    const pool = getConnection();

    // 1. Registrar persona
    const [personaResult] = await pool.execute(
      "INSERT INTO Persona (registro, nombre, apellido) VALUES (?, ?, ?)",
      [p_nRegistro, p_cNombre, p_cApellido]
    );
    const id_persona = personaResult.insertId;

    // 2. Registrar docente
    const [docenteResult] = await pool.execute(
      "INSERT INTO Docente (id_persona) VALUES (?)",
      [id_persona]
    );

    res.status(201).json({
      mensaje: "Docente registrado correctamente",
      id_docente: docenteResult.insertId,
      id_persona,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: "Error interno al registrar docente" });
  }
});

module.exports = router;
